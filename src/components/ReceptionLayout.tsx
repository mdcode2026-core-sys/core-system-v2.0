import { Outlet } from "react-router-dom";
export function ReceptionLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <header className="bg-[#1B2A4A] text-white p-4">
        <h1 className="text-xl font-bold">Reception Dashboard</h1>
        <p className="text-slate-300 text-sm">لوحة الاستقبال</p>
      </header>
      <main className="p-6">
        <div className="bg-white/5 rounded-xl shadow p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
