// ============================================================
// AuthProvider.tsx — CORE SYSTEM v2.1
// Fixed: JWT claims now stored in app_metadata (secure, server-readonly)
// Previously: user_metadata (user-writable = security risk)
// Blueprint Compliance: get_current_tenant_id() reads top-level JWT
// ============================================================

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/infrastructure/supabase/client";

// ── Types ──────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  userRole: string | null;
  isLoading: boolean;
  isPinAuthenticated: boolean;
  pinExpiry: number | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithPin: (pin: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Constants ──────────────────────────────────────────────
const PIN_AUTH_KEY = "core_pin_auth";
const PIN_EXPIRY_HOURS = 24;

// ── Helper: Get tenant_id from app_metadata (secure path) ──
function getTenantIdFromSession(session: Session | null): string | null {
  if (!session) return null;
  // Blueprint-compliant: read from app_metadata (server-controlled)
  const appMeta = session.user.app_metadata;
  return (appMeta?.tenant_id as string) || null;
}

// ── Helper: Get user_role from app_metadata (secure path) ──
function getUserRoleFromSession(session: Session | null): string | null {
  if (!session) return null;
  const appMeta = session.user.app_metadata;
  return (appMeta?.user_role as string) || null;
}

// ── Provider ───────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPinAuthenticated, setIsPinAuthenticated] = useState(false);
  const [pinExpiry, setPinExpiry] = useState<number | null>(null);

  // ── Initialize auth state ────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setTenantId(getTenantIdFromSession(currentSession));
        setUserRole(getUserRoleFromSession(currentSession));
      }

      // Check PIN auth from localStorage
      const pinData = localStorage.getItem(PIN_AUTH_KEY);
      if (pinData) {
        try {
          const parsed = JSON.parse(pinData);
          if (parsed.expiry && Date.now() < parsed.expiry) {
            setIsPinAuthenticated(true);
            setPinExpiry(parsed.expiry);
          } else {
            localStorage.removeItem(PIN_AUTH_KEY);
          }
        } catch {
          localStorage.removeItem(PIN_AUTH_KEY);
        }
      }

      setIsLoading(false);
    };

    initAuth();

    // ── Listen for auth changes ────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setTenantId(getTenantIdFromSession(newSession));
        setUserRole(getUserRoleFromSession(newSession));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Email/Password Sign In ───────────────────────────────
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // ── PIN Sign In ──────────────────────────────────────────
  const signInWithPin = async (pin: string): Promise<{ success: boolean; role?: string; error?: string }> => {
    if (!tenantId) {
      return { success: false, error: "No tenant context. Sign in with email first." };
    }

    // Call RPC with authenticated session (NOT anon)
    const { data, error } = await supabase.rpc("validate_pin", {
      p_tenant_id: tenantId,
      p_pin: pin
    });

    if (error || !data) {
      return { success: false, error: error?.message || "Invalid PIN" };
    }

    // Store PIN auth in localStorage with 24h expiry
    const expiry = Date.now() + PIN_EXPIRY_HOURS * 60 * 60 * 1000;
    localStorage.setItem(PIN_AUTH_KEY, JSON.stringify({
      user_id: data.id,
      role: data.role,
      full_name: data.full_name,
      expiry
    }));

    setIsPinAuthenticated(true);
    setPinExpiry(expiry);
    setUserRole(data.role);

    return { success: true, role: data.role };
  };

  // ── Sign Out ─────────────────────────────────────────────
  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(PIN_AUTH_KEY);
    setUser(null);
    setSession(null);
    setTenantId(null);
    setUserRole(null);
    setIsPinAuthenticated(false);
    setPinExpiry(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        tenantId,
        userRole,
        isLoading,
        isPinAuthenticated,
        pinExpiry,
        signInWithEmail,
        signInWithPin,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
// ── Backward Compatibility Alias ───────────────────────────
// These files import useAuthContext instead of useAuth
export const useAuthContext = useAuth;

