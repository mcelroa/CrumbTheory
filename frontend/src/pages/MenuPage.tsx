import { useCallback, useEffect, useState } from "react";
import { useCart } from "../context/cart";
import type { BakeryItem } from "../types/api";
import api from "../utils/api";
import { formatPrice } from "../utils/format";

export default function MenuPage() {
   const [items, setItems] = useState<BakeryItem[] | null>(null);
   const [failed, setFailed] = useState(false);

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

   return (
      <>
         <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-crust">Baked fresh</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
               Order ahead, and we'll have it waiting.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
               Choose your bakes, pick a collection day, and pay when you come in.
            </p>
         </section>

         <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
            {failed ? (
               <div className="rounded-2xl border border-line bg-paper p-8 text-center">
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
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items === null
                     ? Array.from({ length: 6 }, (_, i) => (
                          <div key={i} className="h-80 animate-pulse rounded-2xl bg-caramel-light/60" />
                       ))
                     : items.map((item) => <MenuCard key={item.id} item={item} />)}
               </div>
            )}
         </section>
      </>
   );
}

function MenuCard({ item }: { item: BakeryItem }) {
   const { lines, add } = useCart();
   const inBasket = lines.find((line) => line.id === item.id)?.quantity ?? 0;

   return (
      <article
         className={`flex flex-col overflow-hidden rounded-2xl border border-line bg-paper ${
            item.isAvailable ? "" : "opacity-60"
         }`}
      >
         {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
         ) : (
            <div className="flex aspect-[4/3] items-center justify-center bg-caramel-light font-display text-6xl text-caramel">
               {item.name.charAt(0)}
            </div>
         )}

         <div className="flex flex-1 flex-col p-5">
            <div className="flex items-baseline justify-between gap-4">
               <h2 className="text-xl font-semibold">{item.name}</h2>
               <span className="font-medium tabular-nums">{formatPrice(item.price)}</span>
            </div>
            {item.description && <p className="mt-2 flex-1 text-muted">{item.description}</p>}

            <button
               type="button"
               disabled={!item.isAvailable}
               onClick={() => add(item)}
               className="mt-5 rounded-full bg-crust py-2.5 font-semibold text-white transition hover:bg-crust-dark disabled:cursor-not-allowed disabled:bg-muted"
            >
               {!item.isAvailable ? "Sold out" : inBasket > 0 ? `Add another (${inBasket} in basket)` : "Add to basket"}
            </button>
         </div>
      </article>
   );
}
