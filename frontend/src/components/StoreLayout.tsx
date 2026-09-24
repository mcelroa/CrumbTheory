import { Link, Outlet } from "react-router";
import { useCart } from "../context/cart";
import CartDrawer from "./CartDrawer";

export default function StoreLayout() {
   const { count, setOpen } = useCart();

   return (
      <div className="flex min-h-screen flex-col">
         <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
               <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
                  Crumb<span className="text-crust">Theory</span>
               </Link>
               <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium transition hover:border-crust"
               >
                  <BasketIcon />
                  Basket
                  {count > 0 && (
                     <span className="rounded-full bg-crust px-2 py-0.5 text-xs font-semibold text-white">
                        {count}
                     </span>
                  )}
               </button>
            </div>
         </header>

         <main className="flex-1">
            <Outlet />
         </main>

         <footer className="border-t border-line py-8 text-center text-sm text-muted">
            Order ahead online · pay when you collect
         </footer>

         <CartDrawer />
      </div>
   );
}

function BasketIcon() {
   return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
         <path d="M4 10h16l-1.5 9a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 10Z" strokeLinejoin="round" />
         <path d="M8.5 10 12 4l3.5 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
   );
}
