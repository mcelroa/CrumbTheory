import { useEffect, useState } from "react";
import api from "./utils/api";

export default function App() {
   const [items, setItems] = useState<BakeryItem[]>([]);

   useEffect(() => {
      const fetchItems = async () => {
         try {
            const response = await api.get<BakeryItem[]>("/bakeryitems");
            setItems(response.data);
         } catch (error) {
            console.error("Failed to fetch bakery items:", error);
         }
      };

      fetchItems();
   }, []);

   return (
      <>
         <ul>
            {items.map((item) => (
               <li key={item.id}>
                  {item.name}: €{item.price}
               </li>
            ))}
         </ul>
      </>
   );
}
