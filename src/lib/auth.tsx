import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { setToken, clearToken } from "./api";
import { login, register, getMe } from "../api/api";
type AdminUser = { id: string; email: string; name: string };

type AuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
const res = await getMe();

setUser(res.user);
      } catch {
        clearToken();
      }
      setLoading(false);
    })();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
const res = await register({
  email,
  password,
});

setToken(res.token);
setUser(res.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
const res = await login({
  email,
  password,
});

setToken(res.token);
setUser(res.user);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const signOut = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
