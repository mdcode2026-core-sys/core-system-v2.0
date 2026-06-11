import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './core/auth/AuthProvider'
import { PinAuthProvider } from './core/auth/PinAuthProvider'
import { RealtimeProvider } from './core/realtime/RealtimeProvider'
import { router } from './router'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PinAuthProvider>
          <RealtimeProvider>
            <RouterProvider router={router} />
          </RealtimeProvider>
        </PinAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
