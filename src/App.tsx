import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { ToastProvider } from './lib/toast';
import { CartProvider } from './lib/cart';
import LoginPage from './pages/LoginPage';
import AdminLayout, { type AdminPage } from './pages/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import TypesPage from './pages/TypesPage';
import OrdersPage from './pages/OrdersPage';
import StorePage from './pages/StorePage';
import { Candy, Loader2 } from 'lucide-react';

type AppView = 'store' | 'admin';

function AppShell() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<AppView>('store');
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');

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

  if (view === 'store') {
    return <StorePage onGoAdmin={() => setView('admin')} />;
  }

  if (!user) {
    return <LoginPage onGoStore={() => setView('store')} />;
  }

  return (
    <AdminLayout page={adminPage} onNavigate={setAdminPage} onGoStore={() => setView('store')}>
      {adminPage === 'dashboard' && <DashboardPage onNavigate={(p) => setAdminPage(p)} />}
         {adminPage === 'categories' && <CategoriesPage />}
         {adminPage === "types" && <TypesPage />}
      {adminPage === 'products' && <ProductsPage />}
      {adminPage === 'orders' && <OrdersPage />}
    </AdminLayout>
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
