import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RoleGuard } from './core/auth/RoleGuard'
import { useRole } from './core/auth/useRole'
import { AuthScreen } from './features/AuthScreen'
import { AmbientKioskView } from './features/AmbientKioskView'
import { ReceptionLayout } from './features/ReceptionLayout'
import { DoctorLayout } from './features/DoctorLayout'
import { AdminLayout } from './features/AdminLayout'
import { SuperAdminLayout } from './features/SuperAdminLayout'
import { SurveyRouter } from './features/SurveyRouter'

function RoleRedirect() {
  const { role } = useRole()

  if (!role) {
    return <Navigate to="/login" replace />
  }

  switch (role) {
    case 'super_admin':
      return <Navigate to="/super-admin" replace />
    case 'clinic_admin':
      return <Navigate to="/admin" replace />
    case 'doctor':
      return <Navigate to="/doctor" replace />
    case 'receptionist':
      return <Navigate to="/reception" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleRedirect />,
  },
  {
    path: '/login',
    element: <AuthScreen />,
  },
  {
    path: '/kiosk',
    element: <AmbientKioskView />,
  },
  {
    path: '/reception',
    element: (
      <RoleGuard allowedRoles={['receptionist', 'clinic_admin', 'super_admin']}>
        <ReceptionLayout />
      </RoleGuard>
    ),
  },
  {
    path: '/doctor',
    element: (
      <RoleGuard allowedRoles={['doctor', 'clinic_admin', 'super_admin']}>
        <DoctorLayout />
      </RoleGuard>
    ),
  },
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['clinic_admin', 'super_admin']}>
        <AdminLayout />
      </RoleGuard>
    ),
  },
  {
    path: '/super-admin',
    element: (
      <RoleGuard allowedRoles={['super_admin']}>
        <SuperAdminLayout />
      </RoleGuard>
    ),
  },
  {
    path: '/survey/:sessionId',
    element: <SurveyRouter />,
  },
])
