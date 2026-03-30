import { motion } from "motion/react";
import {
  Box,
  CheckCircle,
  ChevronRight,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { PRICE_PAIR_LKR, PRICE_SINGLE_LKR } from "@/src/constants";

interface HomeViewProps {
  onGoToOrder: () => void;
}

export function HomeView({ onGoToOrder }: HomeViewProps) {
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-24"
    >
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] card-brutal overflow-hidden group">
          <img
            src="/images/thobe-hero.jpg"
            alt="Premium White Thobe"
            className="object-cover w-full h-full grayscale transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-6 left-6 bg-black text-white px-3 py-1 font-mono text-[10px] font-bold tracking-widest">
            NEW ARRIVAL
          </div>
          <div className="absolute bottom-6 right-6 bg-white border-brutal p-4 max-w-[200px]">
            <p className="font-mono text-[9px] font-bold opacity-50 mb-1">
              EST. 2026
            </p>
            <p className="text-xs font-bold leading-tight">
              HAND-CRAFTED EXCELLENCE IN EVERY STITCH.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter">
              PURE <br /> WHITE
            </h1>
            <p className="text-lg font-medium leading-relaxed max-w-md opacity-80">
              THE DEFINITIVE WHITE THOBE. ENGINEERED FOR COMFORT, DESIGNED FOR
              DISTINCTION.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-black pt-8">
            <div>
              <p className="font-mono text-[10px] font-bold opacity-40 mb-2">
                PRICE
              </p>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl md:text-3xl font-bold">
                    {PRICE_SINGLE_LKR.toLocaleString()} LKR
                  </span>
                  <span className="text-[10px] font-mono font-bold opacity-50">
                    1 PC
                  </span>
                </div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-lg md:text-xl font-bold">
                    {PRICE_PAIR_LKR.toLocaleString()} LKR
                  </span>
                  <span className="text-[10px] font-mono font-bold opacity-50">
                    2 PCS
                  </span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold opacity-40 mb-2">
                SHIPPING
              </p>
              <p className="text-sm font-bold">FREE ACROSS SRI LANKA</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onGoToOrder}
              className="btn-brutal-black flex-grow text-sm flex items-center justify-center gap-3 group"
            >
              ORDER NOW{" "}
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-brutal text-sm"
            >
              LEARN MORE
            </button>
          </div>

          <div className="flex items-center gap-6 opacity-40 grayscale">
            <div className="flex items-center gap-1 font-mono text-[9px] font-bold">
              <ShieldCheck size={12} /> SECURE CHECKOUT
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] font-bold">
              <Truck size={12} /> FAST DELIVERY
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] font-bold">
              <CheckCircle size={12} /> QUALITY GUARANTEED
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="space-y-12">
        <div className="flex items-end justify-between border-b-brutal pb-4">
          <h2 className="text-4xl font-black tracking-tighter">
            SPECIFICATIONS
          </h2>
          <p className="font-mono text-[10px] font-bold opacity-50">01 / 03</p>
        </div>
        <div className="grid md:grid-cols-3 gap-0 border-t border-l border-black">
          {[
            {
              title: "PREMIUM COTTON",
              desc: "Sourced from the finest Egyptian cotton mills for maximum breathability.",
              icon: Box,
            },
            {
              title: "PRECISION FIT",
              desc: "Our unique 2D sizing system ensures a tailored look for every body type.",
              icon: LayoutDashboard,
            },
            {
              title: "DURABLE FINISH",
              desc: "Reinforced stitching and high-grade thread for a thobe that lasts years.",
              icon: ShieldCheck,
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-8 border-r border-b border-black space-y-4 hover:bg-stone-50 transition-colors"
            >
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                <f.icon size={20} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white p-12 md:p-24 space-y-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <ShoppingBag size={400} />
        </div>
        <div className="max-w-2xl space-y-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
            TRUSTED BY <br /> THOUSANDS.
          </h2>
          <p className="text-lg opacity-70">
            JOIN OVER 5,000 SATISFIED CUSTOMERS WHO HAVE UPGRADED THEIR WARDROBE
            WITH OUR PREMIUM THOBES.
          </p>
          <div className="flex gap-12 pt-8">
            <div>
              <div className="text-4xl font-bold">5K+</div>
              <div className="font-mono text-[10px] font-bold opacity-50">
                HAPPY CLIENTS
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold">99%</div>
              <div className="font-mono text-[10px] font-bold opacity-50">
                SATISFACTION
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold">24H</div>
              <div className="font-mono text-[10px] font-bold opacity-50">
                DISPATCH
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center py-24 space-y-8">
        <h2 className="text-5xl font-black tracking-tighter">
          READY TO ORDER?
        </h2>
        <p className="font-mono text-sm font-bold opacity-50">
          LIMITED STOCK AVAILABLE FOR THE 2026 COLLECTION.
        </p>
        <button
          type="button"
          onClick={onGoToOrder}
          className="btn-brutal-black px-12 py-4 text-lg"
        >
          START YOUR ORDER
        </button>
      </section>
    </motion.div>
  );
}
