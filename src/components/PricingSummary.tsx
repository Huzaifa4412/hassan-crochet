import {
  PRODUCT_BASE_PRICE,
  ICON_PRICE,
  formatPrice,
  getCustomizationPrice,
} from "@/lib/pricing";

export function PricingSummary({ iconCount }: { iconCount: number }) {
  return (
    <div className="space-y-2 rounded-2xl border border-[#ead7c7] bg-[#fffaf4] p-4 text-sm text-[#251611]">
      <dl className="space-y-2">
        <div className="flex justify-between gap-3">
          <dt>Product + name</dt>
          <dd className="font-semibold">{formatPrice(PRODUCT_BASE_PRICE)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Icons ({iconCount} × {formatPrice(ICON_PRICE)})</dt>
          <dd className="font-semibold">{formatPrice(iconCount * ICON_PRICE)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Shipping</dt>
          <dd className="font-semibold">Free</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-[#ead7c7] pt-2 font-bold" aria-live="polite" aria-atomic="true">
          <dt>Product total</dt>
          <dd>{formatPrice(getCustomizationPrice(iconCount))} USD</dd>
        </div>
      </dl>
      <p className="text-xs text-[#7a6258]">Name included. Each icon adds {formatPrice(ICON_PRICE)}. Free shipping. Any applicable taxes are shown at Etsy checkout.</p>
    </div>
  );
}
