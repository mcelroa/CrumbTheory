import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/auth";

export default function RequireAdmin() {
   const { isLoggedIn } = useAuth();
   const location = useLocation();

   if (!isLoggedIn) {
      return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
   }
   return <Outlet />;
}
