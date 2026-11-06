"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";

export function CartLink() {
  const count = useCart().reduce((sum, item) => sum + item.quantity, 0);
  return (
    <Link href="/cart" aria-label={`Shopping cart, ${count} items`}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e3cdbd] bg-white text-[#31211b] shadow-sm hover:bg-[#fff1e6] focus-visible:outline-2 focus-visible:outline-[#bf6036]">
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#a94f2c] px-1 text-center text-xs leading-5 text-white">{count}</span>}
    </Link>
  );
}
