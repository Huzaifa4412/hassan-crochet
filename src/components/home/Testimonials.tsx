import Link from "next/link";
import { ETSY_REVIEWS_URL } from "@/lib/store-facts";
import { cn } from "@/lib/utils";

export function TestimonialsSection({ className }: { className?: string }) {
  return (
    <section className={cn("bg-[#fffaf4] px-4 py-20 sm:px-6 lg:px-8", className)} aria-labelledby="buyer-reviews">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#ead7c7] bg-white p-8 text-center sm:p-12">
        <h2 id="buyer-reviews" className="text-3xl font-semibold text-[#241814] sm:text-4xl">See what buyers say on Etsy</h2>
        <p className="mt-4 leading-7 text-[#756156]">Read current buyer feedback on our Etsy shop, then preview your own hand-embroidered name sweater.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a href={ETSY_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#31211b] px-6 py-3 font-semibold text-white">Read Etsy reviews</a>
          <Link href="/products/hand-embroidered-kids-name-sweaters" className="rounded-full border border-[#ead7c7] px-6 py-3 font-semibold text-[#31211b]">Design your name sweater</Link>
        </div>
      </div>
    </section>
  );
}
export default TestimonialsSection;
