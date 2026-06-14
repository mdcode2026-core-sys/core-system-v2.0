import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthScreen from "@/components/AuthScreen";
import AmbientKioskView from "@/components/AmbientKioskView";
import PinPad from "@/components/PinPad";
import { ReceptionLayout } from "@/components/ReceptionLayout";
import { DoctorLayout } from "@/components/DoctorLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { SurveyRouter } from "@/components/SurveyRouter";
import { LiveQueueBoard } from "@/components/LiveQueueBoard";
import CoreScoreWidget from "@/components/CoreScoreWidget";

const DEFAULT_TENANT_ID = "default-tenant-id";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <AuthScreen onSuccess={() => window.location.href = "/reception"} /> },
  { path: "/kiosk", element: <AmbientKioskView tenantId={DEFAULT_TENANT_ID} /> },
  { path: "/kiosk-pin", element: <PinPad onSuccess={(userId, role) => { console.log("PIN login:", userId, role); window.location.href = "/reception"; }} onCancel={() => window.location.href = "/kiosk"} /> },
  {
    path: "/reception",
    element: <ReceptionLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-white">Reception Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CoreScoreWidget score={85} label="Queue Efficiency" trend="up" />
              <CoreScoreWidget score={92} label="Patient Satisfaction" trend="up" />
              <CoreScoreWidget score={78} label="Staff Performance" trend="neutral" />
            </div>
            <LiveQueueBoard tenantId={DEFAULT_TENANT_ID} />
          </div>
        ),
      },
    ],
  },
  {
    path: "/doctor",
    element: <DoctorLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-white">Doctor Dashboard</h1>
            <p className="text-white/60">Patient sessions will appear here</p>
          </div>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <CoreScoreWidget score={88} label="System Uptime" trend="up" size="sm" />
              <CoreScoreWidget score={72} label="Revenue" trend="up" size="sm" />
              <CoreScoreWidget score={95} label="Staff Attendance" trend="up" size="sm" />
              <CoreScoreWidget score={65} label="Patient Retention" trend="down" size="sm" />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    path: "/super-admin",
    element: <SuperAdminLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CoreScoreWidget score={98} label="Global Uptime" trend="up" size="lg" />
              <CoreScoreWidget score={87} label="Tenant Health" trend="up" size="lg" />
              <CoreScoreWidget score={91} label="Billing Status" trend="neutral" size="lg" />
            </div>
          </div>
        ),
      },
    ],
  },
  { path: "/survey/:sessionId", element: <SurveyRouter /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
