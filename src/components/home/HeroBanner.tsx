"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react";

const heroStats = [
  { value: "500+", label: "custom keepsakes" },
  { value: "5.0", label: "average rating" },
  { value: "100%", label: "hand finished" },
];

const HeroBanner = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#fffaf4] px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(180deg,#fff_0%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute left-0 top-24 -z-10 h-80 w-80 rounded-full bg-[#f7d8bf]/35 blur-3xl" />
      <div className="absolute bottom-10 right-0 -z-10 h-72 w-72 rounded-full bg-[#dbe8d0]/45 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={false}
          className="max-w-2xl animate-in fade-in slide-in-from-bottom-4"
        >
          <motion.div
            initial={false}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#edc6aa] bg-white/75 px-4 py-2 text-sm font-medium text-[#9b4f2d] shadow-[0_16px_40px_rgba(116,70,36,0.08)] backdrop-blur"
          >
            <Sparkles className="h-4 w-4" />
            Personalized crochet made to keep
          </motion.div>

          <motion.h1
            initial={false}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-normal text-[#231814] sm:text-6xl lg:text-7xl"
          >
            Modern handmade pieces for tiny milestone moments.
          </motion.h1>

          <motion.p
            initial={false}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-8 text-[#6f5a50]"
          >
            Custom sweaters, nursery details, and crochet keepsakes with soft
            yarn, careful embroidery, and a preview-first personalization flow.
          </motion.p>

          <motion.div
            initial={false}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#bf6036] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(191,96,54,0.28)] transition-colors hover:bg-[#a94f2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf6036] focus-visible:ring-offset-2"
              >
                Shop custom pieces
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ddc9bb] bg-white/70 px-7 py-3 text-sm font-semibold text-[#35231d] shadow-[0_12px_30px_rgba(70,42,26,0.07)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf6036] focus-visible:ring-offset-2"
              >
                Meet the studio
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={false}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-[#ead9cc] pt-6"
          >
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-2xl font-semibold text-[#2b1d18]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-[#8b756a]">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={false}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-2xl animate-in fade-in slide-in-from-right-4"
        >
          <div className="relative aspect-[4/4.8] overflow-hidden rounded-[2.25rem] bg-[#f3dfcf] shadow-[0_30px_90px_rgba(87,50,31,0.18)]">
            <Image
              src="/banner2.png"
              alt="Personalized handmade crochet sweater styled for a baby gift"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[50%_8%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_45%,rgba(44,25,16,0.24)_100%)]" />
          </div>

          <motion.div
            initial={false}
            transition={{ delay: 0.45, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-6 left-4 max-w-[17rem] rounded-3xl border border-white/80 bg-white/88 p-4 shadow-[0_22px_60px_rgba(60,36,24,0.18)] backdrop-blur sm:left-8"
          >
            <div className="mb-3 flex items-center gap-1 text-[#d99438]">
              {[0, 1, 2, 3, 4].map((item) => (
                <Star key={item} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm font-medium leading-6 text-[#3a2a24]">
              The kind of gift parents keep long after the first wear.
            </p>
          </motion.div>

          <motion.div
            initial={false}
            transition={{ delay: 0.58, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-2 top-8 hidden rounded-full border border-[#ead4c3] bg-[#fffaf4]/90 px-4 py-3 text-sm font-semibold text-[#725142] shadow-[0_18px_48px_rgba(80,52,36,0.14)] backdrop-blur sm:flex sm:items-center sm:gap-2"
          >
            <ShieldCheck className="h-4 w-4 text-[#5f7d55]" />
            Preview before ordering
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
