import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Loader2, Candy } from "lucide-react";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white">
            <Candy className="w-6 h-6" />
          </div>

          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
  return (
    <Navigate
      to="/login"
      replace
      state={{ from: location }}
    />
  );
}

  return <Outlet />;
}