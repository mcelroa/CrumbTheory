import { BrowserRouter, Route, Routes } from "react-router";
import StoreLayout from "./components/StoreLayout";
import MenuPage from "./pages/MenuPage";

export default function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<StoreLayout />}>
               <Route index element={<MenuPage />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
}
