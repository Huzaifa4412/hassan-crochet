import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/sanity/queries";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion/Reveal";

const OurProducts = async () => {
  const products = await getProducts(4);

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-[#bf6036]">
              The product shelf
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-normal text-[#241814] md:text-5xl">
              Soft pieces designed around names, colors, and first memories.
            </h2>
          </div>
          <p className="text-base leading-7 text-[#756156]">
            Choose a base piece, preview colors, add lettering or icons, then
            complete the custom order with confidence.
          </p>
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
          <div className="rounded-[1.75rem] border border-[#ead7c7] bg-[#fffaf4] p-10 text-center text-[#7b665c]">
            No products found
          </div>
        )}

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#31211b] px-7 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(49,33,27,0.16)] transition-colors hover:bg-[#4a3329]"
          >
            Browse all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default OurProducts;
