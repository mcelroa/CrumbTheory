import { createContext, useContext } from "react";
import type { BakeryItem } from "../types/api";

export const MAX_QUANTITY = 50;

export type CartLine = {
   id: string;
   name: string;
   price: number;
   quantity: number;
};

export type CartContextValue = {
   lines: CartLine[];
   count: number;
   total: number;
   add: (item: BakeryItem) => void;
   setQuantity: (id: string, quantity: number) => void;
   remove: (id: string) => void;
   clear: () => void;
   isOpen: boolean;
   setOpen: (open: boolean) => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
   const cart = useContext(CartContext);
   if (!cart) {
      throw new Error("useCart must be used inside CartProvider");
   }
   return cart;
}
