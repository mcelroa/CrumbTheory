import { useEffect } from "react";
import { Link } from "react-router";
import { MAX_QUANTITY, useCart } from "../context/cart";
import { formatPrice } from "../utils/format";

export default function CartDrawer() {
   const { lines, total, isOpen, setOpen, setQuantity, remove } = useCart();

   useEffect(() => {
      if (!isOpen) return;
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [isOpen, setOpen]);

   return (
      <div className={`fixed inset-0 z-30 ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
         <div
            className={`absolute inset-0 bg-ink/30 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setOpen(false)}
         />
         <aside
            role="dialog"
            aria-label="Your basket"
            className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-xl transition-transform duration-300 ${
               isOpen ? "translate-x-0" : "translate-x-full"
            }`}
         >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
               <h2 className="text-2xl font-semibold">Your basket</h2>
               <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-3 py-1 text-2xl leading-none text-muted hover:text-ink"
                  aria-label="Close basket"
               >
                  ×
               </button>
            </div>

            {lines.length === 0 ? (
               <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-muted">
                  <p className="font-display text-xl text-ink">Nothing here yet</p>
                  <p>Add something from the menu to get started.</p>
               </div>
            ) : (
               <>
                  <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                     {lines.map((line) => (
                        <li key={line.id} className="flex items-center gap-4 py-4">
                           <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{line.name}</p>
                              <p className="text-sm text-muted">{formatPrice(line.price)} each</p>
                              <button
                                 type="button"
                                 onClick={() => remove(line.id)}
                                 className="mt-1 text-sm text-crust hover:underline"
                              >
                                 Remove
                              </button>
                           </div>
                           <div className="flex items-center rounded-full border border-line">
                              <QtyButton
                                 label={`Fewer ${line.name}`}
                                 disabled={line.quantity <= 1}
                                 onClick={() => setQuantity(line.id, line.quantity - 1)}
                              >
                                 −
                              </QtyButton>
                              <span className="w-8 text-center text-sm font-medium tabular-nums">{line.quantity}</span>
                              <QtyButton
                                 label={`More ${line.name}`}
                                 disabled={line.quantity >= MAX_QUANTITY}
                                 onClick={() => setQuantity(line.id, line.quantity + 1)}
                              >
                                 +
                              </QtyButton>
                           </div>
                           <p className="w-16 text-right font-medium tabular-nums">
                              {formatPrice(line.price * line.quantity)}
                           </p>
                        </li>
                     ))}
                  </ul>

                  <div className="border-t border-line px-6 py-5">
                     <div className="mb-4 flex justify-between text-lg">
                        <span>Total</span>
                        <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
                     </div>
                     <Link
                        to="/checkout"
                        onClick={() => setOpen(false)}
                        className="block rounded-full bg-crust py-3 text-center font-semibold text-white transition hover:bg-crust-dark"
                     >
                        Checkout
                     </Link>
                     <p className="mt-3 text-center text-sm text-muted">You pay when you collect.</p>
                  </div>
               </>
            )}
         </aside>
      </div>
   );
}

function QtyButton(props: { label: string; disabled: boolean; onClick: () => void; children: string }) {
   return (
      <button
         type="button"
         aria-label={props.label}
         disabled={props.disabled}
         onClick={props.onClick}
         className="h-8 w-8 rounded-full text-lg leading-none hover:bg-caramel-light disabled:opacity-30 disabled:hover:bg-transparent"
      >
         {props.children}
      </button>
   );
}
