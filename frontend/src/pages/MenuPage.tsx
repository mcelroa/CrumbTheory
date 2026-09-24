import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { ArrowIcon, BagIcon, HeartIcon, LeafIcon, SproutIcon } from "../components/icons";
import { useCart } from "../context/cart";
import type { BakeryItem } from "../types/api";
import api from "../utils/api";
import { formatPrice } from "../utils/format";

const FEATURES = [
   { icon: LeafIcon, title: "100% gluten free", text: "Safe for coeliacs & gluten intolerant" },
   { icon: HeartIcon, title: "Small batch", text: "Freshly baked with care" },
   { icon: SproutIcon, title: "Premium ingredients", text: "Real ingredients, no compromises" },
   { icon: BagIcon, title: "Order ahead", text: "Collect in store, pay when you pick up" },
];

const PILL_BUTTON =
   "inline-flex items-center gap-2 rounded-full bg-crust px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-crust-dark";

export default function MenuPage() {
   const [items, setItems] = useState<BakeryItem[] | null>(null);
   const [failed, setFailed] = useState(false);
   const { hash, key } = useLocation();

   const load = useCallback(async () => {
      setFailed(false);
      try {
         const response = await api.get<BakeryItem[]>("/bakeryitems");
         setItems(response.data);
      } catch (error) {
         console.error("Failed to fetch bakery items:", error);
         setFailed(true);
      }
   }, []);

   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
      load();
   }, [load]);

   // React Router doesn't scroll to #hash targets itself; `key` re-runs this when the same link is clicked again.
   useEffect(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else window.scrollTo({ top: 0 });
   }, [hash, key]);

   return (
      <>
         {/* Hero */}
         <section className="relative overflow-hidden bg-petal">
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
               <div className="max-w-lg lg:w-1/2 lg:pr-8">
                  <p className="font-script text-4xl text-crust">Small Batches. Big Dreams.</p>
                  <h1 className="mt-4 text-5xl leading-[1.08] sm:text-6xl">Gluten Free Bakes That Feel Like Home</h1>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                     At Crumb Theory, we believe everyone deserves to enjoy the simple things — like really good cake.
                  </p>
                  <a href="#shop" className={`mt-9 ${PILL_BUTTON}`}>
                     Shop our bakes <ArrowIcon className="h-4 w-4" />
                  </a>
               </div>
               <HeartIcon className="absolute -bottom-2 -left-10 hidden h-8 w-8 -rotate-12 text-crust/70 xl:block" />
            </div>

            <PhotoPanel className="h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-1/2">
               <p className="absolute right-8 top-10 -rotate-12 text-center font-script text-4xl leading-tight text-crust-dark/80">
                  Good things
                  <br />
                  are Gluten Free
               </p>
            </PhotoPanel>
            {/* Curved edge where the hero text panel meets the image */}
            <div className="absolute left-1/2 top-1/2 z-[5] hidden h-[140%] w-56 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-petal lg:block" />
         </section>

         {/* Features */}
         <section className="border-b border-line">
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-4">
               {FEATURES.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex flex-col items-center text-center">
                     <Icon className="h-9 w-9 text-crust" />
                     <h2 className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.2em]">{title}</h2>
                     <p className="mt-2 max-w-40 text-sm text-muted">{text}</p>
                  </li>
               ))}
            </ul>
         </section>

         {/* Shop */}
         <section id="shop" className="scroll-mt-24 bg-petal">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
               <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                  <h2 className="relative inline-flex items-start gap-2 font-script text-5xl sm:text-6xl">
                     Shop Our Bakes
                     <HeartIcon className="mt-2 h-6 w-6 text-crust" />
                     <span className="absolute -bottom-1 left-16 right-10 h-px rotate-[-1.5deg] bg-crust/60" />
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crust">
                     Order ahead · pay on collection
                  </p>
               </div>

               {failed ? (
                  <div className="rounded-lg bg-paper p-8 text-center">
                     <p className="font-display text-xl">We couldn't load the menu.</p>
                     <button
                        type="button"
                        onClick={load}
                        className="mt-4 rounded-full border border-crust px-5 py-2 font-medium text-crust hover:bg-crust hover:text-white"
                     >
                        Try again
                     </button>
                  </div>
               ) : (
                  <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                     {items === null
                        ? Array.from({ length: 5 }, (_, i) => (
                             <div key={i} className="h-96 animate-pulse rounded-lg bg-peach/60" />
                          ))
                        : items.map((item) => <MenuCard key={item.id} item={item} />)}
                  </div>
               )}
            </div>
         </section>

         {/* Our story */}
         <section id="story" className="grid scroll-mt-24 lg:grid-cols-2">
            <PhotoPanel className="min-h-80">
               <p className="absolute inset-0 flex -rotate-6 items-center justify-center text-center font-script text-5xl leading-tight text-crust-dark/80">
                  Better Bakes
                  <br />
                  Brighter Days
               </p>
            </PhotoPanel>
            <div className="relative px-4 py-16 sm:px-12 lg:py-24">
               <div className="max-w-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">Our story</p>
                  <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">More Than Just A Bakery</h2>
                  <p className="mt-6 leading-relaxed text-muted">
                     Crumb Theory was born from a simple idea — that gluten free should never mean missing out. We're here
                     to create treats that taste amazing, feel inclusive and bring a little more joy to your day, one crumb
                     at a time.
                  </p>
                  <a href="#shop" className={`mt-8 ${PILL_BUTTON}`}>
                     Shop our bakes <ArrowIcon className="h-4 w-4" />
                  </a>
               </div>
               <p className="absolute bottom-16 right-10 hidden rotate-[-8deg] text-center font-script text-3xl leading-tight text-crust xl:block">
                  Same great taste.
                  <br />
                  Just Gluten Free.
               </p>
            </div>
         </section>
      </>
   );
}

// Stand-in for photography until real images are added.
function PhotoPanel({ className = "", children }: { className?: string; children?: ReactNode }) {
   return (
      <div className={`relative overflow-hidden bg-linear-to-br from-blush/70 via-peach to-petal ${className}`}>
         {children}
      </div>
   );
}

function MenuCard({ item }: { item: BakeryItem }) {
   const { lines, add } = useCart();
   const inBasket = lines.find((line) => line.id === item.id)?.quantity ?? 0;

   return (
      <article
         className={`flex flex-col overflow-hidden rounded-lg bg-peach/60 shadow-sm ${item.isAvailable ? "" : "opacity-60"}`}
      >
         {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="aspect-square w-full object-cover" />
         ) : (
            <div className="flex aspect-square items-center justify-center bg-linear-to-br from-blush/50 to-peach font-script text-8xl text-crust/60">
               {item.name.charAt(0)}
            </div>
         )}

         <div className="flex flex-1 flex-col items-center px-4 py-5 text-center">
            <h3 className="font-sans text-xs font-semibold uppercase leading-relaxed tracking-[0.2em]">{item.name}</h3>
            <p className="mt-1 font-display text-lg tabular-nums text-crust-dark">{formatPrice(item.price)}</p>
            {item.description && <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink/75">{item.description}</p>}

            <button
               type="button"
               disabled={!item.isAvailable}
               onClick={() => add(item)}
               className="mt-4 rounded-full border border-crust px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-crust transition hover:bg-crust hover:text-white disabled:cursor-not-allowed disabled:border-muted disabled:text-muted disabled:hover:bg-transparent"
            >
               {!item.isAvailable ? "Sold out" : inBasket > 0 ? `Add another (${inBasket})` : "Add to basket"}
            </button>
         </div>
      </article>
   );
}
