"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { ETSY_SHOP_URL, storeFacts } from "@/lib/store-facts";

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    viewport: { once: true },
  };

  return (
    <div className="bg-[#FAF2EF] min-h-screen font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.png"
            alt="Soft knit sweater texture"
            fill
            className="object-cover opacity-40 blur-[2px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-[#FAF2EF]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-primary/10 text-primary rounded-full">
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl  text-gray-900 mb-6 leading-tight">
              Crafting Warmth, <br /> One Stitch at a Time
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Knitty Petit makes personalized baby and kids name sweaters: soft
              knit sweaters with each name embroidered by hand in{" "}
              {storeFacts.location.label}, sold through our Etsy shop.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight * 0.8,
              behavior: "smooth",
            })
          }
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Core Story Section */}
      <section className="py-24 px-4 md:px-20 container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            {...fadeIn}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/img.png"
              alt="The Knitty Petit maker at work"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div {...fadeIn} className="space-y-8">
            <h2 className="text-4xl md:text-5xl  text-gray-900 leading-tight">
              The hands behind <br />
              every name
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Knitty Petit wasn&apos;t just born out of a hobby; it was born
                out of a desire to create something tangible in a digital world.
                What started as a few handmade gifts for family soon turned into
                a passion for sharing the &quot;slow-made&quot; lifestyle with
                the world.
              </p>
              <p>
                We believe that in a world of mass production, there&apos;s a
                special magic in something that takes hours to create. Each
                stitch is deliberate, each design is personal, and each product
                is made to be cherished for years to come.
              </p>
              <div className="pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20"
                >
                  Explore Our Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-4 md:px-20">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl  text-gray-900 mb-4">
              Our Values
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Heart className="w-8 h-8 text-primary" />,
                title: "Hand-Crafted with Love",
                desc: "Every name is embroidered by hand, stitch by stitch, after you order. Little icons are crocheted appliqués.",
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                title: "Premium & Safe",
                desc: `Sweaters are ${storeFacts.material} with ribbed neck and cuffs. Wash cold, inside out, and air dry.`,
              },
              {
                icon: <Sparkles className="w-8 h-8 text-primary" />,
                title: "Uniquely Yours",
                desc: "From personalized names to custom colors, we make sure every piece is as unique as you are.",
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                className="p-8 bg-white border border-primary/10 rounded-3xl shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="mb-6 p-4 bg-[#FAF2EF] rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                  {value.icon}
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4 md:px-20 container mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
          <motion.div {...fadeIn} className="order-2 md:order-1 space-y-8">
            <h2 className="text-4xl md:text-5xl  text-gray-900 leading-tight">
              How a name <br />
              sweater is made
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                You choose the sweater color, the name, the lettering and any
                small icons in our online preview. When the order arrives on
                Etsy, we match threads to your design and stitch the name by
                hand.
              </p>
              <p>
                Preview the name, lettering and colors before placing your order.
                Check the Etsy listing for current sizes, shipping estimates and return eligibility.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Your name</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">
                  Stitched by hand
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Preview</div>
                <div className="text-sm text-gray-500 uppercase tracking-widest">
                  Before ordering
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fadeIn}
            className="order-1 md:order-2 relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/crochet-process.png"
              alt="Embroidering a name onto a knit sweater"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          {...fadeIn}
          className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30"
        >
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl  mb-8 max-w-3xl mx-auto leading-tight">
              Ready to design their name sweater?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
              Preview the name, colors and icons first, then order on Etsy.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/products"
                className="px-10 py-4 bg-white text-primary rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
              >
                Design yours
              </Link>
              <a
                href={ETSY_SHOP_URL}
                target="_blank"
                rel="noopener"
                className="px-10 py-4 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all"
              >
                Visit our Etsy shop
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
