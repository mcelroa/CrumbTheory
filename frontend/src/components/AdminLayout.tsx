import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "../context/auth";

const navClass = ({ isActive }: { isActive: boolean }) =>
   `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      isActive ? "bg-ink text-cream" : "text-muted hover:text-ink"
   }`;

export default function AdminLayout() {
   const { logout } = useAuth();

   return (
      <div className="min-h-screen">
         <header className="border-b border-line bg-paper">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
               <Link to="/admin/orders" className="font-display text-xl font-semibold">
                  Crumb<span className="text-crust">Theory</span>{" "}
                  <span className="font-sans text-sm font-medium text-muted">Admin</span>
               </Link>
               <nav className="flex gap-1">
                  <NavLink to="/admin/orders" className={navClass}>
                     Orders
                  </NavLink>
                  <NavLink to="/admin/items" className={navClass}>
                     Items
                  </NavLink>
               </nav>
               <div className="ml-auto flex items-center gap-4 text-sm">
                  <Link to="/" className="text-muted hover:text-ink">
                     View shop
                  </Link>
                  <button type="button" onClick={logout} className="font-medium text-crust hover:underline">
                     Log out
                  </button>
               </div>
            </div>
         </header>
         <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <Outlet />
         </main>
      </div>
   );
}
