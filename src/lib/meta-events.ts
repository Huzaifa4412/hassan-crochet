import type { Product } from "@/sanity/queries";

export const DEFAULT_PIXEL_CURRENCY = "USD";
export const DEFAULT_PRODUCT_VALUE = 18.99;

type ProductLike = Pick<
  Product,
  "_id" | "title" | "category" | "slug" | "variants" | "mainImageUrl" | "etsyLink"
>;

export function getProductPixelPayload(product: ProductLike) {
  return {
    content_ids: [product._id],
    content_name: product.title,
    content_type: "product",
    content_category: product.category?.title || "Crochet",
    currency: DEFAULT_PIXEL_CURRENCY,
    value: DEFAULT_PRODUCT_VALUE,
  };
}

export function getProductEngagementPayload(
  product: ProductLike,
  source: string,
) {
  return {
    ...getProductPixelPayload(product),
    source,
    product_slug: product.slug?.current,
    variant_count: product.variants?.length || 0,
    has_etsy_link: Boolean(product.etsyLink),
  };
}

export function getSearchPixelPayload(
  query: string,
  source: string,
  resultCount?: number,
) {
  return {
    search_string: query.trim(),
    source,
    content_category: "product_search",
    ...(typeof resultCount === "number" ? { result_count: resultCount } : {}),
  };
}

export function getCustomizationPixelPayload({
  selectedColor,
  addedTexts,
  addedIcons,
  textColorName,
  textFontName,
}: {
  selectedColor?: string;
  addedTexts: Array<{ text: string; color: string; font: string }>;
  addedIcons: string[];
  textColorName?: string;
  textFontName?: string;
}) {
  return {
    selected_color: selectedColor || "Not selected",
    text_count: addedTexts.length,
    text_lengths: addedTexts.map((item) => item.text.trim().length),
    icon_count: addedIcons.length,
    icon_names: addedIcons,
    text_color: textColorName || "Not selected",
    text_font: textFontName || "Not selected",
    has_customization: addedTexts.length > 0 || addedIcons.length > 0,
  };
}
