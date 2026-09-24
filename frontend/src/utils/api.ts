import axios from "axios";

const api = axios.create({
   baseURL: "/api",
   headers: {
      "Content-Type": "application/json",
   },
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
