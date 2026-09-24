import type { LoginResponse } from "../types/api";

// The admin session lives outside React so the axios interceptor can read it synchronously
const STORAGE_KEY = "crumbtheory.admin";

let session: LoginResponse | null = load();

function load(): LoginResponse | null {
   try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? (JSON.parse(saved) as LoginResponse) : null;
      return parsed && new Date(parsed.expiresAt) > new Date() ? parsed : null;
   } catch {
      return null;
   }
}

export const getSession = () => session;

export function setSession(next: LoginResponse | null) {
   session = next;
   try {
      if (next) {
         localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } else {
         localStorage.removeItem(STORAGE_KEY);
      }
   } catch {
      // Storage unavailable; the session lasts until the tab closes
   }
}
