export const PRODUCT_BASE_PRICE = 40;
export const SWEATER_ONLY_PRICE = 18;
export const SWEATER_ONLY_SIZE = "0–3 months";
export const ICON_PRICE = 4;
export const PRODUCT_CURRENCY = "USD";

export function getCustomizationPrice(iconCount: number) {
  return PRODUCT_BASE_PRICE + iconCount * ICON_PRICE;
}

export function formatPrice(amount: number) {
  return `$${amount.toFixed(2)}`;
}
