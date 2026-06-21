import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/infrastructure/supabase/client';
<<<<<<< Updated upstream
import { useAuthStore } from '@/shared/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
=======
>>>>>>> Stashed changes
import { AlertCircle, Clock, User } from 'lucide-react';

interface PatientSession {
  id: string;
  patient_id: string;
  session_status: 'waiting' | 'scheduled' | 'in_progress' | 'completed';
  core_score_display: number | null;
  scheduled_at: string;
<<<<<<< Updated upstream
  patient: {
    full_name: string;
    phone: string;
  } | null;
=======
  patient: { full_name: string; phone: string } | null;
}

function Card({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} onClick={onClick}>{children}</div>;
}

function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`px-2 py-1 rounded text-white text-xs font-medium ${className}`}>{children}</span>;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
>>>>>>> Stashed changes
}

export function DoctorPatientList() {
  const navigate = useNavigate();
<<<<<<< Updated upstream
  const { tenant_id } = useAuthStore();
=======
  const [tenantId, setTenantId] = useState<string | null>(null);
>>>>>>> Stashed changes
  const [sessions, setSessions] = useState<PatientSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
<<<<<<< Updated upstream
    if (!tenant_id) return;

    const fetchSessions = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('clinic_visit_sessions')
        .select(`
          id,
          patient_id,
          session_status,
          core_score_display,
          scheduled_at,
          patient:clinic_patients(full_name, phone)
        `)
        .eq('tenant_id', tenant_id)
=======
    const getTenantId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const tid = session?.user?.user_metadata?.tenant_id || session?.user?.app_metadata?.tenant_id;
      setTenantId(tid || null);
    };
    getTenantId();
  }, []);

  useEffect(() => {
    if (!tenantId) return;
    const fetch = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('clinic_visit_sessions')
        .select('id, patient_id, session_status, core_score_display, scheduled_at, patient:clinic_patients(full_name, phone)')
        .eq('tenant_id', tenantId)
>>>>>>> Stashed changes
        .in('session_status', ['waiting', 'scheduled', 'in_progress'])
        .gte('scheduled_at', `${today}T00:00:00`)
        .lte('scheduled_at', `${today}T23:59:59`)
        .is('deleted_at', null)
        .order('scheduled_at', { ascending: true });
<<<<<<< Updated upstream

      if (error) {
        setError(error.message);
      } else {
        const flattened = (data || []).map((s: any) => ({
          ...s,
          patient: Array.isArray(s.patient) ? s.patient[0] : s.patient
        }));
        setSessions(flattened);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [tenant_id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-amber-500';
      case 'scheduled': return 'bg-blue-500';
      case 'in_progress': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting': return 'في الانتظار';
      case 'scheduled': return 'مجدول';
      case 'in_progress': return 'جارية';
      default: return status;
    }
  };

  const getScoreRecommendation = (score: number | null) => {
    if (score === null) return { label: 'غير محسوب', color: 'text-gray-500' };
    if (score >= 90) return { label: 'hot_lead — اعرض الخطة الكاملة', color: 'text-red-600' };
    if (score >= 80) return { label: 'مؤهل — اعرض التفاصيل', color: 'text-orange-500' };
    if (score >= 60) return { label: 'مرتفع — يحتاج إقناع', color: 'text-yellow-600' };
    if (score >= 40) return { label: 'متوسط — لا تضغط', color: 'text-blue-500' };
    return { label: 'منخفض — ابدأ بأساسيات', color: 'text-gray-600' };
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center gap-2 text-red-600">
        <AlertCircle size={20} />
        <span>خطأ في تحميل البيانات: {error}</span>
      </div>
    );
  }
=======
      if (error) setError(error.message);
      else setSessions((data || []).map((s: any) => ({ ...s, patient: Array.isArray(s.patient) ? s.patient[0] : s.patient })));
      setLoading(false);
    };
    fetch();
  }, [tenantId]);

  const statusColor = (s: string) => ({ waiting: 'bg-amber-500', scheduled: 'bg-blue-500', in_progress: 'bg-green-500' }[s] || 'bg-gray-500');
  const statusLabel = (s: string) => ({ waiting: 'في الانتظار', scheduled: 'مجدول', in_progress: 'جارية' }[s] || s);
  const scoreRec = (score: number | null) => {
    if (score === null) return { label: 'غير محسوب', color: 'text-gray-500' };
    if (score >= 90) return { label: 'hot_lead', color: 'text-red-600' };
    if (score >= 80) return { label: 'مؤهل', color: 'text-orange-500' };
    if (score >= 60) return { label: 'مرتفع', color: 'text-yellow-600' };
    if (score >= 40) return { label: 'متوسط', color: 'text-blue-500' };
    return { label: 'منخفض', color: 'text-gray-600' };
  };

  if (!tenantId) return <div className="p-6 text-center text-gray-500">جاري التحقق من الجلسة...</div>;
  if (loading) return <div className="space-y-4 p-6">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>;
  if (error) return <div className="p-6 flex items-center gap-2 text-red-600"><AlertCircle size={20} /><span>خطأ: {error}</span></div>;
>>>>>>> Stashed changes

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">مرضى اليوم</h1>
<<<<<<< Updated upstream

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Clock className="mx-auto mb-2" size={32} />
            <p>لا يوجد مرضى مجدولون لهذا اليوم</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => {
            const rec = getScoreRecommendation(session.core_score_display);
            return (
              <Card
                key={session.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/doctor/session/${session.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {session.patient?.full_name || 'مريض غير معروف'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {session.patient?.phone || '—'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(session.session_status)}>
                            {getStatusLabel(session.session_status)}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(session.scheduled_at).toLocaleTimeString('ar-JO', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left">
                      {session.core_score_display !== null && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-primary">
                            {session.core_score_display.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-400">Core Score</div>
                        </div>
                      )}
                      <div className={`text-sm mt-1 ${rec.color}`}>
                        {rec.label}
                      </div>
=======
      {sessions.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-gray-500"><Clock className="mx-auto mb-2" size={32} /><p>لا يوجد مرضى مجدولون</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {sessions.map(s => {
            const rec = scoreRec(s.core_score_display);
            return (
              <Card key={s.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/doctor/session/${s.id}`)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><User className="text-primary" size={24} /></div>
                      <div>
                        <h3 className="font-semibold text-lg">{s.patient?.full_name || 'مريض غير معروف'}</h3>
                        <p className="text-sm text-gray-500">{s.patient?.phone || '—'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={statusColor(s.session_status)}>{statusLabel(s.session_status)}</Badge>
                          <span className="text-xs text-gray-400">{new Date(s.scheduled_at).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      {s.core_score_display !== null && <div className="text-right"><div className="text-3xl font-bold text-primary">{s.core_score_display.toFixed(1)}</div><div className="text-xs text-gray-400">Core Score</div></div>}
                      <div className={`text-sm mt-1 ${rec.color}`}>{rec.label}</div>
>>>>>>> Stashed changes
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
<<<<<<< Updated upstream
}
=======
}
>>>>>>> Stashed changes
