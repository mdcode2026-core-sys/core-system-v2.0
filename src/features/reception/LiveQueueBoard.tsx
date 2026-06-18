import { useEffect, useState } from "react";
import { supabase } from "../../infrastructure/supabase/client";
import { useQueueChannel } from "../../core/realtime/useQueueChannel";

interface QueueSession {
  id: string;
  session_status: "waiting" | "checked_in" | "in_consultation" | "completed" | "cancelled";
  priority_score: number;
  created_at: string;
  clinic_patients: { id: string; full_name: string; phone: string }[] | null;
  clinic_procedures: { name: string; duration_minutes: number }[] | null;
  clinic_staff: { full_name: string }[] | null;
  room_number: string | null;
}

interface LiveQueueBoardProps {
  tenantId: string;
  onSessionClick?: (session: QueueSession) => void;
}

export function LiveQueueBoard({ tenantId, onSessionClick }: LiveQueueBoardProps) {
  const [sessions, setSessions] = useState<QueueSession[]>([]);
  const [filter, setFilter] = useState<"all" | "waiting" | "checked_in" | "in_consultation">("all");
  const [isLoading, setIsLoading] = useState(true);

  useQueueChannel(tenantId);

  const fetchQueue = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("clinic_visit_sessions")
      .select("id, session_status, priority_score, created_at, room_number, clinic_patients(id, full_name, phone), clinic_procedures(name, duration_minutes), clinic_staff(full_name)")
      .eq("tenant_id", tenantId)
      .in("session_status", ["waiting", "checked_in", "in_consultation"])
      .order("priority_score", { ascending: false })
      .order("created_at", { ascending: true });
    setSessions(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchQueue(); }, [tenantId]);

  const filtered = filter === "all" ? sessions : sessions.filter((s) => s.session_status === filter);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      waiting: "bg-slate-700 text-slate-300",
      checked_in: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      in_consultation: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    };
    return styles[status] || "bg-slate-700 text-slate-300";
  };

  const getWaitTime = (createdAt: string) => {
    const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Live Queue</h2>
          <p className="text-sm text-slate-500">{sessions.length} active sessions</p>
        </div>
        <div className="flex gap-2">
          {(["all", "waiting", "checked_in", "in_consultation"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}>{f === "all" ? "All" : f.replace("_", " ")}</button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-800">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500"><div className="w-8 h-8 border-2 border-slate-600 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />Loading queue...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No sessions in queue</div>
        ) : (
          filtered.map((session) => (
            <button key={session.id} onClick={() => onSessionClick?.(session)} className="w-full p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors text-left">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                <span className={`text-lg font-bold ${session.priority_score > 70 ? "text-red-400" : session.priority_score > 40 ? "text-amber-400" : "text-slate-400"}`}>{session.priority_score}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white truncate">{session.clinic_patients?.[0]?.full_name || "Walk-in"}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${getStatusBadge(session.session_status)}`}>{session.session_status.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  <span>{session.clinic_procedures?.[0]?.name || "General"}</span>
                  <span>•</span>
                  <span>Wait: {getWaitTime(session.created_at)}</span>
                  {session.room_number && <><span>•</span><span className="text-emerald-400">Room {session.room_number}</span></>}
                </div>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm text-slate-400">{session.clinic_staff?.[0]?.full_name || "Unassigned"}</p>
                <p className="text-xs text-slate-600">{session.clinic_procedures?.[0]?.duration_minutes || "--"} min</p>
              </div>
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
