const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

export const formatPrice = (value: number) => euro.format(value);

// Pickup dates are plain dates ("2026-09-25"); build them in local time so they don't shift a day
export const formatDate = (isoDate: string) =>
   new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-IE", {
      weekday: "short",
      day: "numeric",
      month: "short",
   });

export const toIsoDate = (date: Date) => {
   const pad = (n: number) => String(n).padStart(2, "0");
   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
