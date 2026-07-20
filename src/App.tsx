// import { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider, useAuth } from './lib/auth';
import { ToastProvider } from './lib/toast';
import { CartProvider } from './lib/cart';
import LoginPage from './pages/LoginPage';
import AdminLayout from "./pages/AdminLayout";
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import TypesPage from "./pages/Typespage";
import OrdersPage from './pages/OrdersPage';
import CouponsPage from "./pages/CouponsPage";
import CorporateInquiriesPage from "./pages/CorporateInquiriesPage";
import SettingsPage from "./pages/SettingsPage";
import CorporateCmsPage from "./pages/CorporateCmsPage";
import MenuCmsPage from "./pages/MenuCmsPage";
import AboutCmsPage from "./pages/AboutCmsPage";
import HomeCmsPage from "./pages/HomeCmsPage";
import LegalPage from "./pages/LegalPage";
// import StorePage from './pages/StorePage';
import { Candy, Loader2 } from 'lucide-react';

// type AppView = 'store' | 'admin';

function AppShell() {
  const { loading } = useAuth();
  // const [view, setView] = useState<AppView>('store');
  // const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3 text-stone-400">
          <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white">
            <Candy className="w-6 h-6" />
          </div>
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>
    );
  }

  // if (view === 'store') {
  //   return <StorePage onGoAdmin={() => setView('admin')} />;
  // }

  // if (!user) {
  //   return <LoginPage onGoStore={() => setView('store')} />;
  // }
// if (!user) {
//   return <LoginPage />;
// }
return (
<Routes>

  <Route path="/login" element={<LoginPage />} />

  <Route element={<ProtectedRoute />}>

    <Route element={<AdminLayout />}>

      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />

      <Route
        path="/categories"
        element={<CategoriesPage />}
      />

      <Route
        path="/types"
        element={<TypesPage />}
      />

      <Route
        path="/products"
        element={<ProductsPage />}
      />

      <Route
        path="/orders"
        element={<OrdersPage />}
      />
<Route
    path="/coupons"
    element={<CouponsPage />}
/>
<Route
  path="/corporate"
  element={<CorporateInquiriesPage />}
/>
    <Route
  path="/settings"
  element={<SettingsPage />}
/>
<Route
  path="/website/corporate"
  element={<CorporateCmsPage />}
/>
<Route
  path="/website/menu"
  element={<MenuCmsPage />}
/>
<Route
  path="/website/about"
  element={<AboutCmsPage />}
/>
<Route
  path="/website/home"
  element={<HomeCmsPage />}
/>
<Route
  path="/website/legal"
  element={<LegalPage />}
/>
    </Route>


  </Route>

  <Route
    path="/"
    element={<Navigate to="/dashboard" replace />}
  />

  <Route
    path="*"
    element={<Navigate to="/dashboard" replace />}
  />

</Routes>
);
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
