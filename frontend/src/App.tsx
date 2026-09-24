import { BrowserRouter, Route, Routes } from "react-router";
import StoreLayout from "./components/StoreLayout";
import CheckoutPage from "./pages/CheckoutPage";
import MenuPage from "./pages/MenuPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<StoreLayout />}>
               <Route index element={<MenuPage />} />
               <Route path="checkout" element={<CheckoutPage />} />
               <Route path="order/confirmed" element={<OrderConfirmedPage />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}
