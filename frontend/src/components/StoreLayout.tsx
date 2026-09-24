import { Link, Outlet } from "react-router";
import { useCart } from "../context/cart";
import CartDrawer from "./CartDrawer";
import { BasketIcon } from "./icons";
import Logo from "./Logo";

// The storefront is a single page; Shop and Our Story scroll to its sections.
const NAV_LINKS = [
   { label: "Home", to: "/" },
   { label: "Shop", to: "/#shop" },
   { label: "Our Story", to: "/#story" },
];

export default function StoreLayout() {
   const { count, setOpen } = useCart();

   return (
      <div className="flex min-h-screen flex-col">
         <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
               <Link to="/" aria-label="Crumb Theory home" className="pt-2">
                  <Logo />
               </Link>

               <nav className="hidden items-center gap-10 md:flex">
                  {NAV_LINKS.map((link) => (
                     <Link
                        key={link.to}
                        to={link.to}
                        className="text-xs font-semibold uppercase tracking-[0.2em] transition hover:text-crust"
                     >
                        {link.label}
                     </Link>
                  ))}
               </nav>

               <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label={`Basket, ${count} ${count === 1 ? "item" : "items"}`}
                  className="relative rounded-full p-2 transition hover:text-crust"
               >
                  <BasketIcon className="h-6 w-6" />
                  {count > 0 && (
                     <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-crust px-1 text-[0.65rem] font-semibold text-white">
                        {count}
                     </span>
                  )}
               </button>
            </div>
         </header>

         <main className="flex-1">
            <Outlet />
         </main>

         <footer className="bg-ink text-paper">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
               <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                  <Link to="/" aria-label="Crumb Theory home" className="pt-2">
                     <Logo inverted />
                  </Link>
                  <nav className="flex gap-8 text-sm text-paper/80">
                     {NAV_LINKS.map((link) => (
                        <Link key={link.to} to={link.to} className="hover:text-blush">
                           {link.label}
                        </Link>
                     ))}
                  </nav>
                  <p className="text-sm text-paper/80">Order ahead online · pay when you collect</p>
               </div>
               <div className="mt-8 flex flex-col items-center gap-2 border-t border-paper/20 pt-6 md:flex-row md:justify-between">
                  <p className="text-xs text-paper/60">© {new Date().getFullYear()} Crumb Theory. All rights reserved.</p>
                  <p className="font-script text-2xl text-blush">Better Bakes. Brighter Days. ♡</p>
               </div>
            </div>
         </footer>

         <CartDrawer />
      </div>
   );
}
