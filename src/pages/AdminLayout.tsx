import { useState } from "react";
import { NavLink, Outlet, useNavigate} from "react-router-dom";
import { useAuth } from '../lib/auth';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  LogOut,
  Candy,
  Menu,
  X,
   TicketPercent,
   Building2,
   Settings ,
     Globe,
  Home,
  Info,
  ShieldCheck,
  LayoutList,
  Contact,
  Briefcase,
} from 'lucide-react';


// export type AdminPage = 'dashboard' | 'products' | 'categories'| 'types' | 'orders';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

 const nav = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/categories",
    label: "Categories",
    icon: Tags,
  },
  {
    path: "/types",
    label: "Types",
    icon: Tags,
  },
  {
    path: "/products",
    label: "Products",
    icon: Package,
  },
  {
    path: "/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
  path: "/coupons",
  label: "Coupons",
  icon: TicketPercent,
},
{
  path: "/corporate",
  label: "Corporate",
  icon: Building2,
},
{
  path: "/careers",
  label: "Careers",
  icon: Briefcase,
},
{
  path: "/career-applications",
  label: "Career Applications",
  icon: Briefcase,
},
// {
//   path: "/settings",
//   label: "Settings",
//   icon: Settings,
// },
];
const navigate = useNavigate();

const logout = () => {
    signOut();
    navigate("/login", { replace: true });
};
  const SidebarContent = (
   <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-stone-200/70 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white">
          <Candy className="w-5 h-5" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-stone-900 leading-none">Saatvik sweets</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Admin Console</div>
        </div>
      </div>
<div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
{nav.map((n) => {
  const Icon = n.icon;

  return (
    <NavLink
      key={n.path}
      to={n.path}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? "bg-rose-50 text-rose-700 border border-rose-100"
            : "text-stone-600 hover:bg-stone-100 border border-transparent"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-[18px] h-[18px] ${
              isActive
                ? "text-rose-600"
                : "text-stone-400"
            }`}
          />

          {n.label}
        </>
      )}
    </NavLink>
  );
})}
<div className="mt-6 px-3">

  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
    Website CMS
  </div>

  <NavLink
    to="/website/home"
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-rose-50 text-rose-700 border border-rose-100"
          : "text-stone-600 hover:bg-stone-100"
      }`
    }
  >
    <Home className="w-[18px] h-[18px]" />
    Home CMS
  </NavLink>
  <NavLink
    to="/website/menu"
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-rose-50 text-rose-700 border border-rose-100"
          : "text-stone-600 hover:bg-stone-100"
      }`
    }
  >
    <LayoutList className="w-[18px] h-[18px]" />
    Menu CMS
  </NavLink>
  <NavLink
    to="/website/about"
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-rose-50 text-rose-700 border border-rose-100"
          : "text-stone-600 hover:bg-stone-100"
      }`
    }
  >
    <Info className="w-[18px] h-[18px]" />
    About CMS
  </NavLink>

  <NavLink
    to="/website/corporate"
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-rose-50 text-rose-700 border border-rose-100"
          : "text-stone-600 hover:bg-stone-100"
      }`
    }
  >
    <Building2 className="w-[18px] h-[18px]" />
    Corporate CMS
  </NavLink>
    <NavLink
    to="/website/contact"
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-rose-50 text-rose-700 border border-rose-100"
          : "text-stone-600 hover:bg-stone-100"
      }`
    }
  >
    <Contact className="w-[18px] h-[18px]" />
    Contact CMS
  </NavLink>
  <NavLink
    to="/website/legal"
    className={({ isActive }) =>
      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-rose-50 text-rose-700 border border-rose-100"
          : "text-stone-600 hover:bg-stone-100"
      }`
    }
  >
    <ShieldCheck className="w-[18px] h-[18px]" />
    Leagal CMS
  </NavLink>
</div>
<NavLink
  to="/settings"
  className={({ isActive }) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-rose-50 text-rose-700 border border-rose-100"
        : "text-stone-600 hover:bg-stone-100"
    }`
  }
>
  <Settings className="w-[18px] h-[18px]" />
  Settings
</NavLink>
</div>
      <div className="px-3 py-4 border-t border-stone-200/70 space-y-1">
        {/* <button onClick={onGoStore} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">
          <Store className="w-[18px] h-[18px] text-stone-400" /> View Storefront
        </button> */}
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition">
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
            <span className="font-display font-semibold text-stone-900">Saatvik sweets & savouries</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}
