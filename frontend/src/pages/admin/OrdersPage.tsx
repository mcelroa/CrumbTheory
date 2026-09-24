import { useCallback, useEffect, useState } from "react";
import { ORDER_STATUSES, type Order, type OrderStatus } from "../../types/api";
import api from "../../utils/api";
import { formatDate, formatPrice } from "../../utils/format";

const STATUS_STYLES: Record<OrderStatus, string> = {
   Pending: "bg-peach text-crust-dark",
   Confirmed: "bg-sky-100 text-sky-800",
   Ready: "bg-emerald-100 text-emerald-800",
   Collected: "bg-line text-muted",
   Cancelled: "bg-rose-100 text-rose-800",
};

export default function OrdersPage() {
   const [filter, setFilter] = useState<OrderStatus | null>("Pending");
   const [orders, setOrders] = useState<Order[] | null>(null);
   const [failed, setFailed] = useState(false);

   const load = useCallback(async () => {
      setFailed(false);
      setOrders(null);
      try {
         const response = await api.get<Order[]>("/orders", { params: filter ? { status: filter } : {} });
         setOrders(response.data);
      } catch (error) {
         console.error("Failed to fetch orders:", error);
         setFailed(true);
      }
   }, [filter]);

   useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch when the filter changes
      load();
   }, [load]);

   const updateOrder = (updated: Order) =>
      setOrders((current) => current?.map((order) => (order.id === updated.id ? updated : order)) ?? null);

   // Group by pickup date, keeping the API's ordering
   const groups: [string, Order[]][] = [];
   for (const order of orders ?? []) {
      const last = groups.at(-1);
      if (last && last[0] === order.pickupDate) {
         last[1].push(order);
      } else {
         groups.push([order.pickupDate, [order]]);
      }
   }

   return (
      <>
         <h1 className="text-3xl font-semibold">Orders</h1>

         <div className="mt-6 flex flex-wrap gap-2" role="tablist">
            {[null, ...ORDER_STATUSES].map((status) => (
               <button
                  key={status ?? "All"}
                  type="button"
                  role="tab"
                  aria-selected={filter === status}
                  onClick={() => setFilter(status)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                     filter === status ? "border-ink bg-ink text-cream" : "border-line bg-paper hover:border-ink"
                  }`}
               >
                  {status ?? "All"}
               </button>
            ))}
         </div>

         <div className="mt-8">
            {failed ? (
               <p className="text-muted">
                  Couldn't load orders.{" "}
                  <button type="button" onClick={load} className="font-medium text-crust hover:underline">
                     Try again
                  </button>
               </p>
            ) : orders === null ? (
               <p className="text-muted">Loading…</p>
            ) : orders.length === 0 ? (
               <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
                  No {filter ? filter.toLowerCase() : ""} orders.
               </p>
            ) : (
               <div className="space-y-8">
                  {groups.map(([date, dayOrders]) => (
                     <section key={date}>
                        <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-muted">
                           Collection {formatDate(date)}
                        </h2>
                        <ul className="space-y-3">
                           {dayOrders.map((order) => (
                              <OrderRow key={order.id} order={order} onUpdated={updateOrder} />
                           ))}
                        </ul>
                     </section>
                  ))}
               </div>
            )}
         </div>
      </>
   );
}

function OrderRow({ order, onUpdated }: { order: Order; onUpdated: (order: Order) => void }) {
   const [expanded, setExpanded] = useState(false);
   const [saving, setSaving] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

   async function changeStatus(status: OrderStatus) {
      setSaving(true);
      setError(null);
      try {
         await api.patch(`/orders/${order.id}/status`, { status });
         onUpdated({ ...order, status });
      } catch {
         setError("Couldn't update the status.");
      } finally {
         setSaving(false);
      }
   }

   return (
      <li className="rounded-2xl border border-line bg-paper">
         <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4">
            <button
               type="button"
               onClick={() => setExpanded(!expanded)}
               aria-expanded={expanded}
               className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
               <span className={`text-muted transition ${expanded ? "rotate-90" : ""}`}>›</span>
               <span className="min-w-0">
                  <span className="block truncate font-medium">{order.customerName}</span>
                  <span className="block text-sm text-muted">
                     {itemCount} {itemCount === 1 ? "item" : "items"} · {formatPrice(order.total)}
                  </span>
               </span>
            </button>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
               {order.status}
            </span>
            <select
               value={order.status}
               disabled={saving}
               onChange={(e) => changeStatus(e.target.value as OrderStatus)}
               aria-label={`Status for ${order.customerName}'s order`}
               className="rounded-lg border border-line bg-cream px-2 py-1.5 text-sm disabled:opacity-60"
            >
               {ORDER_STATUSES.map((status) => (
                  <option key={status}>{status}</option>
               ))}
            </select>
         </div>
         {error && <p className="px-4 pb-3 text-sm text-crust-dark">{error}</p>}

         {expanded && (
            <div className="grid gap-6 border-t border-line p-4 sm:grid-cols-2">
               <div>
                  <h3 className="mb-2 font-sans text-sm font-semibold text-muted">Items</h3>
                  <ul className="space-y-1">
                     {order.items.map((item) => (
                        <li key={item.bakeryItemId} className="flex justify-between gap-4">
                           <span>
                              {item.quantity} × {item.itemName}
                           </span>
                           <span className="tabular-nums text-muted">{formatPrice(item.unitPrice * item.quantity)}</span>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="space-y-3 text-sm">
                  <div>
                     <h3 className="mb-1 font-sans font-semibold text-muted">Contact</h3>
                     <a href={`mailto:${order.email}`} className="block text-crust hover:underline">
                        {order.email}
                     </a>
                     <a href={`tel:${order.phone}`} className="block text-crust hover:underline">
                        {order.phone}
                     </a>
                  </div>
                  {order.notes && (
                     <div>
                        <h3 className="mb-1 font-sans font-semibold text-muted">Notes</h3>
                        <p className="whitespace-pre-wrap">{order.notes}</p>
                     </div>
                  )}
                  <p className="text-muted">
                     Placed{" "}
                     {new Date(order.createdAt).toLocaleString("en-IE", { dateStyle: "medium", timeStyle: "short" })} ·
                     Ref <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                  </p>
               </div>
            </div>
         )}
      </li>
   );
}
