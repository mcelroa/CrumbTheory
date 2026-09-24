import { HeartIcon } from "./icons";

export default function Logo({ inverted = false }: { inverted?: boolean }) {
   return (
      <span className="inline-flex flex-col items-center leading-none">
         <span className="relative font-display text-3xl tracking-tight">
            crumb theory
            <HeartIcon
               className={`absolute -top-3.5 left-1/2 h-4 w-4 -translate-x-1/2 ${inverted ? "text-blush" : "text-crust"}`}
            />
         </span>
         <span
            className={`mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] ${
               inverted ? "text-paper/70" : "text-muted"
            }`}
         >
            Gluten free bakery
         </span>
      </span>
   );
}
