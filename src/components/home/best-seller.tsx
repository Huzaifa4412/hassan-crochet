import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/sanity/queries";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion/Reveal";

const BestSeller = async () => {
  const products = await getFeaturedProducts(4);

  return (
    <section className="bg-[#fffaf4] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase text-[#bf6036]">
              Loved this week
            </p>
            <h2 className="text-4xl font-semibold tracking-normal text-[#241814] md:text-5xl">
              Best sellers with a personal touch.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#756156]">
              Customer favorites selected for softness, keepsake value, and the
              kind of personalization that photographs beautifully.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#dfc9b8] bg-white px-5 text-sm font-semibold text-[#3a2a24] shadow-sm transition-colors hover:bg-[#fff1e6]"
          >
            View collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {products.length > 0 ? (
          <StaggerReveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <StaggerItem key={product._id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        ) : (
          <div className="rounded-[1.75rem] border border-[#ead7c7] bg-white p-10 text-center text-[#7b665c]">
            No products found
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;
