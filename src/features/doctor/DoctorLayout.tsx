import { ReactNode } from "react";
import { useAuth } from "../../core/auth/useAuth";

interface DoctorLayoutProps {
  children: ReactNode;
  headerSlot?: ReactNode;
  sidebarSlot?: ReactNode;
}

export function DoctorLayout({ children, headerSlot, sidebarSlot }: DoctorLayoutProps) {
  const { fullName, role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-blue-400 tracking-tight">CORE</h1>
          <p className="text-xs text-slate-500 mt-1">Doctor Station</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem href="/doctor" icon="🏠" label="Dashboard" active />
          <NavItem href="/doctor/queue" icon="📋" label="My Queue" />
          <NavItem href="/doctor/patients" icon="👤" label="Patients" />
          <NavItem href="/doctor/notes" icon="📝" label="Clinical Notes" />
          <NavItem href="/doctor/scores" icon="📊" label="Core Scores" />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">{fullName?.charAt(0) || "D"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fullName || "Doctor"}</p>
              <p className="text-xs text-slate-500">{role || "doctor"}</p>
            </div>
          </div>
        </div>
        {sidebarSlot}
      </aside>
      <div className="flex-1 flex flex-col">
        {headerSlot && <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center px-6">{headerSlot}</header>}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active?: boolean }) {
  return (
    <a href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"}`}>
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
