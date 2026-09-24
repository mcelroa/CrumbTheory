import { Link, useLocation } from "react-router";
import type { Order } from "../types/api";
import { formatDate, formatPrice } from "../utils/format";

export default function OrderConfirmedPage() {
   // The order comes from checkout via navigation state; there's no public endpoint to look it up again
   const order = (useLocation().state as { order?: Order } | null)?.order;

   return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
         <p className="text-sm font-semibold uppercase tracking-widest text-crust">Order received</p>
         <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {order ? `Thank you, ${order.customerName.split(" ")[0]}!` : "Thank you!"}
         </h1>

         {order ? (
            <>
               <p className="mt-3 text-lg text-muted">
                  We'll have it ready for collection on <strong className="text-ink">{formatDate(order.pickupDate)}</strong>.
                  Pay when you pick it up.
               </p>

               <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
                  <ul className="divide-y divide-line">
                     {order.items.map((item) => (
                        <li key={item.bakeryItemId} className="flex justify-between gap-4 py-3">
                           <span>
                              {item.quantity} × {item.itemName}
                           </span>
                           <span className="tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
                        </li>
                     ))}
                  </ul>
                  <div className="mt-2 flex justify-between border-t border-line pt-4 text-lg font-semibold">
                     <span>Total to pay</span>
                     <span className="tabular-nums">{formatPrice(order.total)}</span>
                  </div>
                  <p className="mt-4 text-sm text-muted">
                     Order reference <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                  </p>
               </div>
            </>
         ) : (
            <p className="mt-3 text-lg text-muted">Your order has been placed.</p>
         )}

         <Link to="/" className="mt-8 inline-block font-medium text-crust hover:underline">
            ← Back to the menu
         </Link>
      </div>
   );
}
