import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AdminLayout from "./components/AdminLayout";
import RequireAdmin from "./components/RequireAdmin";
import StoreLayout from "./components/StoreLayout";
import LoginPage from "./pages/admin/LoginPage";
import ItemsPage from "./pages/admin/ItemsPage";
import OrdersPage from "./pages/admin/OrdersPage";
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

            <Route path="admin/login" element={<LoginPage />} />
            <Route path="admin" element={<RequireAdmin />}>
               <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="items" element={<ItemsPage />} />
               </Route>
            </Route>
         </Routes>
      </BrowserRouter>
   );
}
