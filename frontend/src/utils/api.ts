import axios from "axios";
import { getSession } from "./session";

const api = axios.create({
   baseURL: "/api",
   headers: {
      "Content-Type": "application/json",
   },
});

api.interceptors.request.use((config) => {
   const session = getSession();
   if (session) {
      config.headers.Authorization = `Bearer ${session.token}`;
   }
   return config;
});

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
   onUnauthorized = handler;
};

api.interceptors.response.use(undefined, (error) => {
   // An expired or rejected token: drop the session so the admin is sent back to login
   if (axios.isAxiosError(error) && error.response?.status === 401 && getSession()) {
      onUnauthorized?.();
   }
   return Promise.reject(error);
});

export default api;

export type FormErrors = {
   fields: Record<string, string>;
   general: string[];
};

// Turn an ASP.NET ValidationProblem ({ errors: { PickupDate: ["..."] } }) into per-field messages.
// Keys are matched case-insensitively against `fieldNames`; anything else lands in `general`.
export function toFormErrors(error: unknown, fieldNames: string[]): FormErrors {
   const result: FormErrors = { fields: {}, general: [] };
   const data = axios.isAxiosError(error) ? error.response?.data : undefined;
   const errors = data?.errors as Record<string, string[]> | undefined;

   if (!errors) {
      result.general.push(
         axios.isAxiosError(error) && !error.response
            ? "We couldn't reach the bakery. Check your connection and try again."
            : "Something went wrong. Please try again.",
      );
      return result;
   }

   for (const [key, messages] of Object.entries(errors)) {
      const field = fieldNames.find((name) => name.toLowerCase() === key.replace(/^\$\./, "").toLowerCase());
      if (field && !result.fields[field]) {
         result.fields[field] = messages[0];
      } else {
         result.general.push(...messages);
      }
   }
   return result;
}
