import { createContext, useContext } from "react";

export type AuthContextValue = {
   isLoggedIn: boolean;
   login: (username: string, password: string) => Promise<void>;
   logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
   const auth = useContext(AuthContext);
   if (!auth) {
      throw new Error("useAuth must be used inside AuthProvider");
   }
   return auth;
}
