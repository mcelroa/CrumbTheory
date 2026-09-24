import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/cart";
import type { CreateOrderRequest, Order } from "../types/api";
import api, { toFormErrors, type FormErrors } from "../utils/api";
import { formatPrice, toIsoDate } from "../utils/format";

const FIELDS = ["customerName", "email", "phone", "pickupDate", "notes"] as const;
type Field = (typeof FIELDS)[number];

function tomorrow() {
   const date = new Date();
   date.setDate(date.getDate() + 1);
   return toIsoDate(date);
}

export default function CheckoutPage() {
   const { lines, total, clear, setOpen } = useCart();
   const navigate = useNavigate();
   const [values, setValues] = useState<Record<Field, string>>({
      customerName: "",
      email: "",
      phone: "",
      pickupDate: tomorrow(),
      notes: "",
   });
   const [errors, setErrors] = useState<FormErrors>({ fields: {}, general: [] });
   const [submitting, setSubmitting] = useState(false);

   if (lines.length === 0) {
      return (
         <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
            <h1 className="text-3xl font-semibold">Your basket is empty</h1>
            <p className="mt-3 text-muted">Pick a few bakes from the menu first.</p>
            <Link
               to="/"
               className="mt-6 inline-block rounded-full bg-crust px-6 py-3 font-semibold text-white hover:bg-crust-dark"
            >
               Back to the menu
            </Link>
         </div>
      );
   }

   const update = (field: Field, value: string) => setValues((current) => ({ ...current, [field]: value }));

   async function submit(e: FormEvent) {
      e.preventDefault();
      setSubmitting(true);
      setErrors({ fields: {}, general: [] });

      const request: CreateOrderRequest = {
         customerName: values.customerName.trim(),
         email: values.email.trim(),
         phone: values.phone.trim(),
         pickupDate: values.pickupDate,
         notes: values.notes.trim() || undefined,
         items: lines.map((line) => ({ bakeryItemId: line.id, quantity: line.quantity })),
      };

      try {
         const response = await api.post<Order>("/orders", request);
         clear();
         navigate("/order/confirmed", { state: { order: response.data } });
      } catch (error) {
         setErrors(toFormErrors(error, [...FIELDS]));
         setSubmitting(false);
      }
   }

   return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px]">
         <form onSubmit={submit} className="order-2 lg:order-1">
            <h1 className="text-3xl font-semibold sm:text-4xl">Checkout</h1>
            <p className="mt-2 text-muted">We'll have your order ready on the day you choose. You pay when you collect.</p>

            {errors.general.length > 0 && (
               <div role="alert" className="mt-6 rounded-xl border border-crust/40 bg-crust/10 p-4 text-crust-dark">
                  {errors.general.map((message) => (
                     <p key={message}>{message}</p>
                  ))}
               </div>
            )}

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
               <TextField
                  label="Name"
                  className="sm:col-span-2"
                  value={values.customerName}
                  onChange={(v) => update("customerName", v)}
                  error={errors.fields.customerName}
                  autoComplete="name"
                  maxLength={100}
                  required
               />
               <TextField
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(v) => update("email", v)}
                  error={errors.fields.email}
                  autoComplete="email"
                  maxLength={200}
                  required
               />
               <TextField
                  label="Phone"
                  type="tel"
                  value={values.phone}
                  onChange={(v) => update("phone", v)}
                  error={errors.fields.phone}
                  autoComplete="tel"
                  maxLength={30}
                  required
               />
               <TextField
                  label="Collection date"
                  type="date"
                  value={values.pickupDate}
                  onChange={(v) => update("pickupDate", v)}
                  error={errors.fields.pickupDate}
                  min={tomorrow()}
                  required
               />
               <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium">
                     Notes <span className="font-normal text-muted">(optional)</span>
                  </span>
                  <textarea
                     value={values.notes}
                     onChange={(e) => update("notes", e.target.value)}
                     rows={3}
                     maxLength={1000}
                     placeholder="Allergies, a message for a cake, anything we should know"
                     className={inputClass(errors.fields.notes)}
                  />
                  {errors.fields.notes && <FieldError message={errors.fields.notes} />}
               </label>
            </div>

            <button
               type="submit"
               disabled={submitting}
               className="mt-8 w-full rounded-full bg-crust py-3.5 font-semibold text-white transition hover:bg-crust-dark disabled:opacity-60 sm:w-auto sm:px-10"
            >
               {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
            </button>
         </form>

         <aside className="order-1 h-fit rounded-2xl border border-line bg-paper p-6 lg:order-2">
            <div className="flex items-baseline justify-between">
               <h2 className="text-xl font-semibold">Your order</h2>
               <button type="button" onClick={() => setOpen(true)} className="text-sm text-crust hover:underline">
                  Edit
               </button>
            </div>
            <ul className="mt-4 divide-y divide-line">
               {lines.map((line) => (
                  <li key={line.id} className="flex justify-between gap-4 py-3">
                     <span>
                        {line.quantity} × {line.name}
                     </span>
                     <span className="tabular-nums">{formatPrice(line.price * line.quantity)}</span>
                  </li>
               ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-line pt-4 text-lg font-semibold">
               <span>Total</span>
               <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
         </aside>
      </div>
   );
}

const inputClass = (error?: string) =>
   `w-full rounded-xl border bg-paper px-4 py-2.5 outline-none transition focus:border-crust focus:ring-2 focus:ring-crust/20 ${
      error ? "border-crust" : "border-line"
   }`;

function FieldError({ message }: { message: string }) {
   return <span className="mt-1.5 block text-sm text-crust-dark">{message}</span>;
}

type TextFieldProps = {
   label: string;
   value: string;
   onChange: (value: string) => void;
   error?: string;
   className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "className">;

function TextField({ label, value, onChange, error, className, ...inputProps }: TextFieldProps) {
   return (
      <label className={`block ${className ?? ""}`}>
         <span className="mb-1.5 block text-sm font-medium">{label}</span>
         <input
            {...inputProps}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error ? true : undefined}
            className={inputClass(error)}
         />
         {error && <FieldError message={error} />}
      </label>
   );
}
