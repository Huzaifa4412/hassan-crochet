import { buildMetadata } from "@/lib/seo";
import { CartPage } from "@/components/cart/CartPage";

export const metadata = buildMetadata({ title: "Your cart", path: "/cart", noIndex: true });

export default function Page() { return <CartPage />; }
