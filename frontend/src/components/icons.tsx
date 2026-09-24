type IconProps = { className?: string };

const stroke = {
   viewBox: "0 0 24 24",
   fill: "none",
   stroke: "currentColor",
   strokeWidth: 1.5,
   strokeLinecap: "round",
   strokeLinejoin: "round",
   "aria-hidden": true,
} as const;

export function HeartIcon({ className }: IconProps) {
   return (
      <svg {...stroke} className={className}>
         <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" />
      </svg>
   );
}

export function LeafIcon({ className }: IconProps) {
   return (
      <svg {...stroke} className={className}>
         <path d="M5 19C5 10.5 10.5 5 19.5 4.5 19.5 13.5 14 19 5 19Z" />
         <path d="M5 19 14 10" />
      </svg>
   );
}

export function SproutIcon({ className }: IconProps) {
   return (
      <svg {...stroke} className={className}>
         <path d="M12 21v-9" />
         <path d="M12 12C12 7.5 9 5 4.5 5 4.5 9.5 7.5 12 12 12Z" />
         <path d="M12 14c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6Z" />
      </svg>
   );
}

export function BagIcon({ className }: IconProps) {
   return (
      <svg {...stroke} className={className}>
         <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
         <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
      </svg>
   );
}

export function BasketIcon({ className }: IconProps) {
   return (
      <svg {...stroke} className={className}>
         <path d="M4 10h16l-1.5 9a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 10Z" />
         <path d="M8.5 10 12 4l3.5 6" />
      </svg>
   );
}

export function ArrowIcon({ className }: IconProps) {
   return (
      <svg {...stroke} className={className}>
         <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
   );
}
