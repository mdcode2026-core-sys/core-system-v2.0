import { Outlet } from "react-router-dom";
export function DoctorLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#1B2A4A] text-white p-4">
        <h1 className="text-xl font-bold">Doctor Dashboard</h1>
        <p className="text-slate-300 text-sm">لوحة الطبيب</p>
      </header>
      <main className="p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
