import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LoginResponse } from "../types/api";
import api, { setUnauthorizedHandler } from "../utils/api";
import { getSession, setSession } from "../utils/session";
import { AuthContext } from "./auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
   const [session, setSessionState] = useState(getSession);

   const update = useCallback((next: LoginResponse | null) => {
      setSession(next);
      setSessionState(next);
   }, []);

   const logout = useCallback(() => update(null), [update]);

   useEffect(() => {
      setUnauthorizedHandler(logout);
      return () => setUnauthorizedHandler(null);
   }, [logout]);

   // Log out when the token expires, even if the tab is left open
   useEffect(() => {
      if (!session) return;
      const timer = setTimeout(logout, new Date(session.expiresAt).getTime() - Date.now());
      return () => clearTimeout(timer);
   }, [session, logout]);

   const value = useMemo(
      () => ({
         isLoggedIn: session !== null,
         login: async (username: string, password: string) => {
            const response = await api.post<LoginResponse>("/auth/login", { username, password });
            update(response.data);
         },
         logout,
      }),
      [session, update, logout],
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
