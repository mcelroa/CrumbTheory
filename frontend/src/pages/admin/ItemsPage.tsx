import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { BakeryItem, BakeryItemInput } from "../../types/api";
import api, { toFormErrors, type FormErrors } from "../../utils/api";
import { formatPrice } from "../../utils/format";

export default function ItemsPage() {
   const [items, setItems] = useState<BakeryItem[] | null>(null);
   const [failed, setFailed] = useState(false);
   // null = form closed, "new" = adding, otherwise the item being edited
   const [editing, setEditing] = useState<BakeryItem | "new" | null>(null);

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

   const replace = (updated: BakeryItem) =>
      setItems((current) => {
         if (!current) return [updated];
         return current.some((item) => item.id === updated.id)
            ? current.map((item) => (item.id === updated.id ? updated : item))
            : [...current, updated];
      });

   return (
      <>
         <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">Items</h1>
            <button
               type="button"
               onClick={() => setEditing("new")}
               className="rounded-full bg-crust px-5 py-2 font-semibold text-white hover:bg-crust-dark"
            >
               Add item
            </button>
         </div>

         <div className="mt-8">
            {failed ? (
               <p className="text-muted">
                  Couldn't load items.{" "}
                  <button type="button" onClick={load} className="font-medium text-crust hover:underline">
                     Try again
                  </button>
               </p>
            ) : items === null ? (
               <p className="text-muted">Loading…</p>
            ) : items.length === 0 ? (
               <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
                  No items yet. Add your first bake.
               </p>
            ) : (
               <ul className="divide-y divide-line rounded-2xl border border-line bg-paper">
                  {items.map((item) => (
                     <ItemRow
                        key={item.id}
                        item={item}
                        onEdit={() => setEditing(item)}
                        onUpdated={replace}
                        onDeleted={() => setItems((current) => current?.filter((i) => i.id !== item.id) ?? null)}
                     />
                  ))}
               </ul>
            )}
         </div>

         {editing && (
            <ItemForm
               item={editing === "new" ? null : editing}
               onClose={() => setEditing(null)}
               onSaved={(saved) => {
                  replace(saved);
                  setEditing(null);
               }}
            />
         )}
      </>
   );
}

function ItemRow(props: {
   item: BakeryItem;
   onEdit: () => void;
   onUpdated: (item: BakeryItem) => void;
   onDeleted: () => void;
}) {
   const { item } = props;
   const [busy, setBusy] = useState(false);
   const [confirmingDelete, setConfirmingDelete] = useState(false);
   const [error, setError] = useState<string | null>(null);

   async function toggleAvailable() {
      setBusy(true);
      setError(null);
      const updated = { ...item, isAvailable: !item.isAvailable };
      try {
         await api.put(`/bakeryitems/${item.id}`, updated);
         props.onUpdated(updated);
      } catch {
         setError("Couldn't update availability.");
      } finally {
         setBusy(false);
      }
   }

   async function remove() {
      setBusy(true);
      setError(null);
      try {
         await api.delete(`/bakeryitems/${item.id}`);
         props.onDeleted();
      } catch {
         setError("Couldn't delete this item.");
         setBusy(false);
         setConfirmingDelete(false);
      }
   }

   return (
      <li className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
         {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
         ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-peach font-display text-2xl text-blush">
               {item.name.charAt(0)}
            </div>
         )}
         <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{item.name}</p>
            <p className="text-sm text-muted">{formatPrice(item.price)}</p>
            {error && <p className="text-sm text-crust-dark">{error}</p>}
         </div>

         <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
               type="checkbox"
               checked={item.isAvailable}
               disabled={busy}
               onChange={toggleAvailable}
               className="h-4 w-4 accent-crust"
            />
            {item.isAvailable ? "Available" : "Sold out"}
         </label>

         <div className="flex items-center gap-2 text-sm">
            {confirmingDelete ? (
               <>
                  <span className="text-muted">Delete?</span>
                  <button
                     type="button"
                     disabled={busy}
                     onClick={remove}
                     className="rounded-full bg-crust-dark px-3 py-1 font-medium text-white disabled:opacity-60"
                  >
                     Yes, delete
                  </button>
                  <button type="button" onClick={() => setConfirmingDelete(false)} className="px-2 py-1 text-muted">
                     Cancel
                  </button>
               </>
            ) : (
               <>
                  <button
                     type="button"
                     onClick={props.onEdit}
                     className="rounded-full border border-line px-3 py-1 font-medium hover:border-ink"
                  >
                     Edit
                  </button>
                  <button
                     type="button"
                     onClick={() => setConfirmingDelete(true)}
                     className="px-2 py-1 font-medium text-crust hover:underline"
                  >
                     Delete
                  </button>
               </>
            )}
         </div>
      </li>
   );
}

const FIELDS = ["name", "price", "description", "imageUrl"];

function ItemForm(props: { item: BakeryItem | null; onClose: () => void; onSaved: (item: BakeryItem) => void }) {
   const { item } = props;
   const [name, setName] = useState(item?.name ?? "");
   const [price, setPrice] = useState(item ? String(item.price) : "");
   const [description, setDescription] = useState(item?.description ?? "");
   const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
   const [isAvailable, setIsAvailable] = useState(item?.isAvailable ?? true);
   const [errors, setErrors] = useState<FormErrors>({ fields: {}, general: [] });
   const [saving, setSaving] = useState(false);

   const { onClose } = props;
   useEffect(() => {
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [onClose]);

   async function submit(e: FormEvent) {
      e.preventDefault();
      setSaving(true);
      setErrors({ fields: {}, general: [] });

      const body: BakeryItemInput = {
         id: item?.id,
         name: name.trim(),
         price: Number(price),
         description: description.trim() || null,
         imageUrl: imageUrl.trim() || null,
         isAvailable,
      };

      try {
         if (item) {
            await api.put(`/bakeryitems/${item.id}`, body);
            props.onSaved({ ...body, id: item.id });
         } else {
            const response = await api.post<BakeryItem>("/bakeryitems", body);
            props.onSaved(response.data);
         }
      } catch (error) {
         setErrors(toFormErrors(error, FIELDS));
         setSaving(false);
      }
   }

   const inputClass = (error?: string) =>
      `w-full rounded-xl border bg-cream px-4 py-2.5 outline-none transition focus:border-crust focus:ring-2 focus:ring-crust/20 ${
         error ? "border-crust" : "border-line"
      }`;
   const fieldError = (field: string) =>
      errors.fields[field] && <span className="mt-1 block text-sm text-crust-dark">{errors.fields[field]}</span>;

   return (
      <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/30 sm:items-center sm:p-4" onClick={onClose}>
         <form
            role="dialog"
            aria-label={item ? `Edit ${item.name}` : "Add item"}
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-2xl bg-paper p-6 shadow-xl sm:rounded-2xl"
         >
            <h2 className="text-2xl font-semibold">{item ? "Edit item" : "Add item"}</h2>

            {errors.general.length > 0 && (
               <div role="alert" className="mt-4 rounded-xl bg-crust/10 p-3 text-sm text-crust-dark">
                  {errors.general.map((message) => (
                     <p key={message}>{message}</p>
                  ))}
               </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_140px]">
               <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Name</span>
                  <input
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                     maxLength={100}
                     autoFocus
                     className={inputClass(errors.fields.name)}
                  />
                  {fieldError("name")}
               </label>
               <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Price (€)</span>
                  <input
                     type="number"
                     inputMode="decimal"
                     min="0.01"
                     max="1000"
                     step="0.01"
                     value={price}
                     onChange={(e) => setPrice(e.target.value)}
                     required
                     className={inputClass(errors.fields.price)}
                  />
                  {fieldError("price")}
               </label>
               <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium">
                     Description <span className="font-normal text-muted">(optional)</span>
                  </span>
                  <textarea
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     rows={3}
                     maxLength={1000}
                     className={inputClass(errors.fields.description)}
                  />
                  {fieldError("description")}
               </label>
               <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium">
                     Image URL <span className="font-normal text-muted">(optional)</span>
                  </span>
                  <input
                     type="url"
                     value={imageUrl}
                     onChange={(e) => setImageUrl(e.target.value)}
                     placeholder="https://…"
                     className={inputClass(errors.fields.imageUrl)}
                  />
                  {fieldError("imageUrl")}
               </label>
               <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input
                     type="checkbox"
                     checked={isAvailable}
                     onChange={(e) => setIsAvailable(e.target.checked)}
                     className="h-4 w-4 accent-crust"
                  />
                  Available to order
               </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
               <button type="button" onClick={onClose} className="rounded-full px-5 py-2 font-medium text-muted hover:text-ink">
                  Cancel
               </button>
               <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-crust px-6 py-2 font-semibold text-white hover:bg-crust-dark disabled:opacity-60"
               >
                  {saving ? "Saving…" : item ? "Save changes" : "Add item"}
               </button>
            </div>
         </form>
      </div>
   );
}
