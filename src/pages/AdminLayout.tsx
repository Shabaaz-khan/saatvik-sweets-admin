import { useState, type ReactNode } from 'react';
import { useAuth } from '../lib/auth';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  LogOut,
  Candy,
  Store,
  Menu,
  X,
} from 'lucide-react';

export type AdminPage = 'dashboard' | 'products' | 'categories' | 'orders';

export default function AdminLayout({
  page,
  onNavigate,
  onGoStore,
  children,
}: {
  page: AdminPage;
  onNavigate: (p: AdminPage) => void;
  onGoStore: () => void;
  children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav: { id: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-stone-200/70 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white">
          <Candy className="w-5 h-5" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-stone-900 leading-none">Mithai Mart</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Admin Console</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((n) => {
          const Icon = n.icon;
          const active = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => {
                onNavigate(n.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${active ? 'text-rose-600' : 'text-stone-400'}`} />
              {n.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-stone-200/70 space-y-1">
        <button onClick={onGoStore} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">
          <Store className="w-[18px] h-[18px] text-stone-400" /> View Storefront
        </button>
        <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">
          <LogOut className="w-[18px] h-[18px] text-stone-400" /> Sign out
        </button>
        <div className="px-3 pt-3 text-xs text-stone-400 truncate">
          {user?.email}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-stone-200/70 flex-col fixed inset-y-0">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white shadow-xl animate-slide-in">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
              <X className="w-5 h-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-stone-200/70 h-14 flex items-center px-4 gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-stone-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Candy className="w-4 h-4" />
            </div>
            <span className="font-display font-semibold text-stone-900">Mithai Mart</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
