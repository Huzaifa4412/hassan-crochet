import { buildMetadata } from "@/lib/seo";
import { CheckoutPage } from "@/components/cart/CheckoutPage";

export const metadata = buildMetadata({ title: "Review your checkout", path: "/checkout", noIndex: true });

export default function Page() { return <CheckoutPage />; }
