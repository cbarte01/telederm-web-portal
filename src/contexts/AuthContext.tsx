import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPasswordRequest: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // We want "logout on tab close" behavior.
  // supabase-js persists sessions in localStorage by default; sessionStorage is cleared when a tab closes.
  // We use a per-tab marker: if a session is restored but the marker is missing, we sign out.
  const TAB_SESSION_MARKER_KEY = "telederm_tab_session_marker";

  useEffect(() => {
    // Track whether initial session check is complete to avoid race conditions
    let initialCheckComplete = false;
    let shouldSignOut = false;

    // Check for tab marker FIRST, before any auth events
    const hasTabMarker = (() => {
      try {
        return sessionStorage.getItem(TAB_SESSION_MARKER_KEY) === "1";
      } catch {
        return false;
      }
    })();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // If we haven't completed initial check and there's no marker, 
        // this is a restored session that should be invalidated
        if (!initialCheckComplete && session && !hasTabMarker) {
          shouldSignOut = true;
          return; // Don't update state yet, let getSession handle it
        }

        // Maintain per-tab marker
        if (event === "SIGNED_OUT") {
          try {
            sessionStorage.removeItem(TAB_SESSION_MARKER_KEY);
          } catch {
            // ignore
          }
        }

        // Only set marker for explicit sign-in actions, not restored sessions
        if (event === "SIGNED_IN" && initialCheckComplete) {
          try {
            sessionStorage.setItem(TAB_SESSION_MARKER_KEY, "1");
          } catch {
            // ignore
          }
        }

        if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          try {
            sessionStorage.setItem(TAB_SESSION_MARKER_KEY, "1");
          } catch {
            // ignore
          }
        }

        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      initialCheckComplete = true;

      // If the browser restored a persisted session (localStorage) but this is a fresh tab, sign out.
      if (session && !hasTabMarker) {
        supabase.auth.signOut().finally(() => {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        });
        return;
      }

      // If we have a valid session with marker, ensure marker is set
      if (session && hasTabMarker) {
        try {
          sessionStorage.setItem(TAB_SESSION_MARKER_KEY, "1");
        } catch {
          // ignore
        }
      }

      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    // Clear any sensitive session data before signing out
    try {
      sessionStorage.removeItem("telederm_consultation_draft");
    } catch {
      // Ignore storage errors
    }
    await supabase.auth.signOut();
  };

  const resetPasswordRequest = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { error: error as Error | null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error: error as Error | null };
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPasswordRequest,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
