import { motion } from "motion/react";
import type { View } from "@/src/types/order";

interface SupportViewProps {
  view: Extract<View, "shipping-policy" | "returns-exchanges" | "contact-us">;
  onBackHome: () => void;
}

const contentByView = {
  "shipping-policy": {
    title: "SHIPPING POLICY",
    points: [
      "WE OFFER FREE ISLANDWIDE SHIPPING ACROSS SRI LANKA ON ALL PURE WHITE THOBE ORDERS.",
      "ORDERS ARE PROCESSED WITHIN 24 HOURS AFTER CONFIRMATION BY OUR TEAM.",
      "STANDARD DELIVERY TIME IS 1 TO 3 BUSINESS DAYS DEPENDING ON YOUR LOCATION.",
      "YOU WILL RECEIVE A CONFIRMATION CALL BEFORE DISPATCH TO VERIFY YOUR ORDER DETAILS.",
    ],
  },
  "returns-exchanges": {
    title: "RETURNS & EXCHANGES",
    points: [
      "EXCHANGES ARE ACCEPTED WITHIN 7 DAYS OF DELIVERY FOR SIZE ISSUES ON UNWORN ITEMS.",
      "ITEMS MUST BE IN ORIGINAL CONDITION, UNUSED, UNWASHED, AND WITH ORIGINAL PACKAGING.",
      "TO REQUEST AN EXCHANGE, CONTACT OUR SUPPORT TEAM WITH YOUR ORDER NUMBER AND PREFERRED SIZE.",
      "RETURNS FOR REFUNDS ARE REVIEWED CASE BY CASE ONLY IF THE ITEM ARRIVES DEFECTIVE OR INCORRECT.",
    ],
  },
  "contact-us": {
    title: "CONTACT US",
    points: [
      "FOR ORDERS, SUPPORT, OR BULK INQUIRIES, PLEASE CONTACT THE PURE WHITE TEAM.",
      "PHONE / WHATSAPP: +94 77 123 4567",
      "EMAIL: SUPPORT@PUREWHITETHOBES.COM",
      "WORKING HOURS: MONDAY TO SATURDAY, 9:00 AM TO 7:00 PM.",
    ],
  },
} as const;

export function SupportView({ view, onBackHome }: SupportViewProps) {
  const content = contentByView[view];

  return (
    <motion.section
      key={view}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-4xl mx-auto border border-black bg-stone-50"
    >
      <div className="p-8 md:p-12 space-y-8">
        <div className="flex items-center justify-between gap-4 border-b border-black pb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
            {content.title}
          </h1>
          <button
            type="button"
            onClick={onBackHome}
            className="btn-brutal text-xs px-4 py-2"
          >
            BACK TO HOME
          </button>
        </div>

        <ul className="space-y-5">
          {content.points.map((point, index) => (
            <li
              key={point}
              className="text-sm md:text-base leading-relaxed font-medium flex gap-3"
            >
              <span className="font-mono font-bold text-[10px] pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
