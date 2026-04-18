// Local variant images list (from public/Shirts-Varient/)
const LOCAL_FILENAMES = [
  "Beige.avif",
  "Black.avif",
  "Brown.avif",
  "Camel.avif",
  "Dark Green.avif",
  "dusty Rose.avif",
  "Forest Green.avif",
  "Lavender.avif",
  "Light Blue.avif",
  "Light Pink.avif",
  "Mint Green.avif",
  "Navy Blue.avif",
  "OATMEAL.avif",
  "Orange.avif",
  "Red.avif",
  "White.avif",
];

// Map Sanity color names to local filenames if they don't match exactly
const COLOR_SYNONYMS: Record<string, string> = {
  "rose": "dusty Rose.avif",
  "pink": "Light Pink.avif",
  "khaki": "Beige.avif",
  "tan": "Camel.avif",
  "camel": "Camel.avif",
  "orange": "Orange.avif",
  "apricot": "Orange.avif",
  "peach": "Orange.avif",
  "purple": "Lavender.avif",
  "grass": "Mint Green.avif",
  "green": "Dark Green.avif",
  "grey": "OATMEAL.avif", // Fallback if grey is used but oatmeal is the closest local file
  "gray": "OATMEAL.avif",
};

/**
 * Finds a matching local image for a given color name.
 * Performs a case-insensitive search and checks synonyms.
 */
function findLocalImage(colorName: string): string | null {
  if (!colorName) return null;
  
  const normalizedSearch = colorName.toLowerCase().trim();
  
  // 1. Check direct match
  const directMatch = LOCAL_FILENAMES.find(filename => {
    const baseName = filename.replace(".avif", "").toLowerCase();
    return baseName === normalizedSearch;
  });
  
  if (directMatch) return `/Shirts-Varient/${directMatch}`;

  // 2. Check synonyms
  const synonymFilename = COLOR_SYNONYMS[normalizedSearch];
  if (synonymFilename) return `/Shirts-Varient/${synonymFilename}`;
  
  // Debug log for unmatched colors
  if (normalizedSearch && normalizedSearch !== 'spot') {
    console.log(`[Variant-Override] No match for color: "${colorName}" (Normalized: "${normalizedSearch}")`);
  }
  
  return null;
}

/**
 * Applies local image overrides to product variants if applicable.
 * This can be used to mutate the product object or return a copy.
 * Applied to ALL products where variant colors match local assets.
 */
export function applyVariantOverrides<T extends { title?: string; mainImageUrl?: string; variants?: Array<{ colorName: string; imageUrl?: string | null }>; category?: { slug?: { current?: string } } }>(product: T): T {
  if (!product || !product.variants) {
    return product;
  }

  let hasOverride = false;
  const updatedVariants = product.variants.map((variant) => {
    const localImage = findLocalImage(variant.colorName);
    if (localImage) {
      hasOverride = true;
      return { ...variant, imageUrl: localImage };
    }
    return variant;
  });

  if (!hasOverride) {
    return product;
  }

  return { ...product, variants: updatedVariants };
}
