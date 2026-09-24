import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CartContext, MAX_QUANTITY, type CartLine } from "./cart";

const STORAGE_KEY = "crumbtheory.cart";

function loadLines(): CartLine[] {
   try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartLine[]) : [];
   } catch {
      return [];
   }
}

const clamp = (quantity: number) => Math.min(Math.max(quantity, 1), MAX_QUANTITY);

export default function CartProvider({ children }: { children: ReactNode }) {
   const [lines, setLines] = useState<CartLine[]>(loadLines);
   const [isOpen, setOpen] = useState(false);

   useEffect(() => {
      try {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } catch {
         // Storage unavailable (private mode etc.); the cart still works for this visit
      }
   }, [lines]);

   const value = useMemo(
      () => ({
         lines,
         count: lines.reduce((sum, line) => sum + line.quantity, 0),
         total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
         add: (item: { id: string; name: string; price: number }) =>
            setLines((current) => {
               const existing = current.find((line) => line.id === item.id);
               if (existing) {
                  return current.map((line) =>
                     line.id === item.id ? { ...line, quantity: clamp(line.quantity + 1) } : line,
                  );
               }
               return [...current, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
            }),
         setQuantity: (id: string, quantity: number) =>
            setLines((current) =>
               current.map((line) => (line.id === id ? { ...line, quantity: clamp(quantity) } : line)),
            ),
         remove: (id: string) => setLines((current) => current.filter((line) => line.id !== id)),
         clear: () => setLines([]),
         isOpen,
         setOpen,
      }),
      [lines, isOpen],
   );

   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
