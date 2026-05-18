"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import type { Product } from "@/sanity/queries";
import { cn } from "@/lib/utils";
import * as pixel from "@/lib/fpixel";
import { getProductEngagementPayload } from "@/lib/meta-events";

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
}

function getProductImage(product: Product) {
  return product.mainImageUrl || product.variants?.[0]?.imageUrl || "";
}

export function ProductCard({
  product,
  className,
  showQuickView = false,
  onQuickView,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const mainImage = getProductImage(product);
  const variants = product.variants || [];
  const trackCustomizeClick = (source: string) => {
    pixel.event("CustomizeProduct", getProductEngagementPayload(product, source));
  };
  const trackWishlist = () => {
    pixel.event("AddToWishlist", getProductEngagementPayload(product, "product_card"));
  };
  const trackEtsyClick = () => {
    pixel.event("InitiateCheckout", {
      ...getProductEngagementPayload(product, "product_card_etsy_link"),
      destination: "etsy",
    });
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn("group h-full", className)}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#ead7c7] bg-white shadow-[0_18px_50px_rgba(79,48,30,0.08)] transition-shadow duration-300 group-hover:shadow-[0_30px_70px_rgba(79,48,30,0.16)]">
        <button
          onClick={(e) => {
            e.preventDefault();
            trackWishlist();
            setIsFavorite((value) => !value);
          }}
          className={cn(
            "absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/85 text-[#6f5a50] shadow-[0_12px_30px_rgba(50,30,20,0.12)] backdrop-blur transition-all hover:bg-white hover:text-[#bf6036] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf6036]",
            isFavorite && "text-[#bf6036]",
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn("h-4 w-4", isFavorite && "fill-current")}
          />
        </button>

        <Link
          href={`/products/${product.slug.current}`}
          onClick={() => trackCustomizeClick("product_card_image")}
          className="relative block aspect-[4/4.6] overflow-hidden bg-[#f6eee8]"
        >
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                "object-cover transition duration-700 group-hover:scale-105",
                !isImageLoaded && "scale-105 blur-xl",
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_45%,rgba(45,28,20,0.28)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2 pr-14">
            {(product.badges?.length ? product.badges : product.featured ? ["Featured"] : []).slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/70 bg-white/82 px-3 py-1 text-[11px] font-semibold text-[#8a4a2b] shadow-sm backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex translate-y-3 items-center justify-between gap-3 rounded-2xl bg-white/88 p-3 opacity-0 shadow-[0_14px_36px_rgba(48,29,19,0.14)] backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="text-xs font-semibold text-[#6f5a50]">
              Preview and personalize
            </span>
            <ArrowRight className="h-4 w-4 text-[#bf6036]" />
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            {product.category && (
              <p className="text-xs font-semibold uppercase text-[#9b7a68]">
                {product.category.title}
              </p>
            )}
            {variants.length > 0 && (
              <div className="flex -space-x-1">
                {variants.slice(0, 4).map((variant, index) => {
                  const styleColor =
                    variant.colorValue && !variant.colorValue.startsWith("bg-")
                      ? { backgroundColor: variant.colorValue }
                      : undefined;
                  return (
                    <span
                      key={`${variant.colorName}-${index}`}
                      className={cn(
                        "h-5 w-5 rounded-full border-2 border-white shadow-sm",
                        variant.colorValue?.startsWith("bg-")
                          ? variant.colorValue
                          : "bg-[#e8d5c4]",
                      )}
                      style={styleColor}
                      title={variant.colorName}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href={`/products/${product.slug.current}`}
            onClick={() => trackCustomizeClick("product_card_title")}
          >
            <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-[#2f211b] transition-colors group-hover:text-[#a94f2c]">
              {product.title}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#7b665c]">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-5">
            <Link
              href={`/products/${product.slug.current}`}
              onClick={() => trackCustomizeClick("product_card_customize_cta")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#bf6036] px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(191,96,54,0.22)] transition-colors hover:bg-[#a94f2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf6036] focus-visible:ring-offset-2"
            >
              Customize now
              <ArrowRight className="h-4 w-4" />
            </Link>
            {(product.etsyLink || showQuickView) && (
              <div className="flex gap-2">
                {product.etsyLink && (
                  <a
                    href={product.etsyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackEtsyClick}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#ead7c7] text-sm font-semibold text-[#6f5a50] transition-colors hover:bg-[#fff1e6]"
                  >
                    View on Etsy
                  </a>
                )}
                {showQuickView && (
                  <button
                    onClick={() => onQuickView?.(product)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-[#ead7c7] text-sm font-semibold text-[#6f5a50] transition-colors hover:bg-[#fff1e6]"
                  >
                    Quick view
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

interface ProductCardCompactProps {
  product: Product;
  className?: string;
}

export function ProductCardCompact({ product, className }: ProductCardCompactProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const mainImage = getProductImage(product);
  const trackCompactCustomizeClick = () => {
    pixel.event(
      "CustomizeProduct",
      getProductEngagementPayload(product, "compact_product_card"),
    );
  };

  return (
    <motion.article
      whileHover={{ x: 4 }}
      className={cn("group overflow-hidden rounded-2xl border border-[#ead7c7] bg-white p-3 shadow-sm", className)}
    >
      <div className="flex gap-4">
        <Link
          href={`/products/${product.slug.current}`}
          onClick={trackCompactCustomizeClick}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f6eee8]"
        >
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.title}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          {product.category && (
            <p className="text-[10px] font-semibold uppercase text-[#9b7a68]">
              {product.category.title}
            </p>
          )}
          <Link
            href={`/products/${product.slug.current}`}
            onClick={trackCompactCustomizeClick}
          >
            <h4 className="mt-1 line-clamp-2 font-semibold leading-tight text-[#2f211b] group-hover:text-[#a94f2c]">
              {product.title}
            </h4>
          </Link>
          {product.shortDescription && (
            <p className="mt-1 line-clamp-1 text-xs text-[#7b665c]">
              {product.shortDescription}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <Link
              href={`/products/${product.slug.current}`}
              onClick={trackCompactCustomizeClick}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#bf6036]"
            >
              Customize <ArrowRight className="h-3 w-3" />
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                pixel.event(
                  "AddToWishlist",
                  getProductEngagementPayload(product, "compact_product_card"),
                );
                setIsFavorite((value) => !value);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1e6] text-[#8b7569]"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-3.5 w-3.5", isFavorite && "fill-current text-[#bf6036]")} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductCardFeatured({
  product,
  className,
}: ProductCardCompactProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#8a4a2b] shadow-sm backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" />
        Featured
      </div>
      <ProductCard product={product} />
    </div>
  );
}

export default ProductCard;
