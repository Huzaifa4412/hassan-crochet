import Link from "next/link";
import { ICON_PRICE, PRODUCT_BASE_PRICE, SWEATER_ONLY_PRICE, SWEATER_ONLY_SIZE, formatPrice } from "@/lib/pricing";

const questions = [
  {
    title: "What is a personalized baby name sweater?",
    answer: "A baby name sweater is a knitted pullover personalized with a child's name. At Knitty Petit, you can preview the lettering, thread colors, and decorative icons before completing your hand-embroidered sweater order on Etsy.",
    href: "/blog/baby-name-sweater-embroidery-fonts-stitches-guide",
    label: "Explore name lettering and embroidery styles",
  },
  {
    title: "How much does a name sweater cost?",
    answer: `The website's personalized sweater price is ${formatPrice(PRODUCT_BASE_PRICE)} USD with the name included. Each icon adds ${formatPrice(ICON_PRICE)}. The ${formatPrice(SWEATER_ONLY_PRICE)} option is a sweater only in ${SWEATER_ONLY_SIZE}, without a name or icons. Review your selected options and final total on Etsy before paying.`,
  },
  {
    title: "Which size should I choose for a baby or toddler?",
    answer: "Choose for the age and measurements at the time the child will wear the sweater. Compare the Etsy listing's size chart with a sweater that already fits, and check with the recipient's parent if you are buying a gift. Available sizes and measurements are shown on the listing.",
    href: "/blog/what-size-baby-name-sweater-should-you-get",
    label: "Read the baby name sweater sizing guide",
  },
  {
    title: "Can I give a name sweater as a baby shower gift?",
    answer: "A name sweater can be a personal baby shower or first birthday gift when you know the child's name. Confirm the spelling with the parents, choose a size for the intended occasion, and check the delivery estimate before ordering. If the name is a surprise, ask the parents before personalizing it.",
    href: "/blog/baby-shower-gift-ideas",
    label: "Compare baby shower gift ideas",
  },
  {
    title: "How long will my order take to arrive in the US?",
    answer: "Check the delivery estimate on the Etsy listing using your US ZIP code. Processing and transit times depend on the selected options and destination. For a shower, birthday, or photo session, message the seller on Etsy about your date before placing the order.",
  },
  {
    title: "How do I wash a hand-embroidered sweater?",
    answer: "Follow the care label and the instructions supplied with your sweater. Avoid pulling the raised embroidery and check the fiber-specific washing and drying instructions before the first wash. Our care guide explains what to check before cleaning personalized knitwear.",
    href: "/blog/how-to-wash-hand-embroidered-baby-sweater",
    label: "Read the embroidered sweater care guide",
  },
];

export function SweaterShoppingGuide() {
  return (
    <section aria-labelledby="sweater-buying-guide" className="border-t border-[#ead7c7] bg-[#fffaf4] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <h2 id="sweater-buying-guide" className="max-w-3xl text-3xl font-semibold text-[#2f211b] sm:text-4xl">
          Choosing your personalized baby sweater
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-[#756156]">
          Start with the name and the occasion, then choose the colors and size.
          Use the preview to plan your design and review the Etsy listing for
          available options, materials, delivery, and order policies.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((question) => (
            <div key={question.title} className="rounded-3xl border border-[#ead7c7] bg-white p-6">
              <h3 className="text-xl font-semibold text-[#2f211b]">{question.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#756156]">{question.answer}</p>
              {question.href && (
                <Link href={question.href} className="mt-4 inline-block font-semibold text-[#a94f2c] underline underline-offset-4">
                  {question.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
