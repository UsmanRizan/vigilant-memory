import { MessageCircle, Phone } from "lucide-react";
import type { View } from "@/src/types/order";

interface AppFooterProps {
  onNavigate: (view: View) => void;
  onOpenSizeGuide: () => void;
}

export function AppFooter({ onNavigate, onOpenSizeGuide }: AppFooterProps) {
  return (
    <footer className="bg-stone-50 border-t border-black py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-mono font-bold text-lg tracking-tighter">
            PURE WHITE
          </h3>
          <p className="text-[11px] opacity-60 leading-relaxed">
            PREMIUM THOBE MANUFACTURER BASED IN SRI LANKA. COMMITTED TO QUALITY,
            TRADITION, AND MODERN ELEGANCE.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono font-bold text-[10px] opacity-40">SHOP</h4>
          <ul className="space-y-2 text-[11px] font-bold font-mono">
            <li>
              <button
                type="button"
                onClick={() => onNavigate("home")}
                className="hover:underline"
              >
                COLLECTION
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate("order-form")}
                className="hover:underline"
              >
                ORDER NOW
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="hover:underline"
              >
                SIZE GUIDE
              </button>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono font-bold text-[10px] opacity-40">
            SUPPORT
          </h4>
          <ul className="space-y-2 text-[11px] font-bold font-mono">
            <li>
              <button
                type="button"
                onClick={() => onNavigate("shipping-policy")}
                className="hover:underline"
              >
                SHIPPING POLICY
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate("returns-exchanges")}
                className="hover:underline"
              >
                RETURNS & EXCHANGES
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate("contact-us")}
                className="hover:underline"
              >
                CONTACT US
              </button>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-mono font-bold text-[10px] opacity-40">
            CONNECT
          </h4>
          <div className="flex gap-4">
            <button
              type="button"
              className="p-2 border border-black hover-invert transition-all"
            >
              <Phone size={16} />
            </button>
            <button
              type="button"
              className="p-2 border border-black hover-invert transition-all"
            >
              <MessageCircle size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[10px] font-bold opacity-40">
          &copy; 2026 PURE WHITE THOBES. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6 font-mono text-[10px] font-bold opacity-40">
          <button type="button" className="hover:underline">
            PRIVACY POLICY
          </button>
          <button type="button" className="hover:underline">
            TERMS OF SERVICE
          </button>
        </div>
      </div>
    </footer>
  );
}
