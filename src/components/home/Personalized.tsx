import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Palette, Sparkles, Type } from "lucide-react";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/motion/Reveal";

const steps = [
  {
    icon: Type,
    title: "Write the name",
    copy: "Pick a friendly lettering style and preview how the embroidery sits on the sweater.",
  },
  {
    icon: Palette,
    title: "Tune the palette",
    copy: "Choose softer tones for keepsakes or brighter colors for birthday moments.",
  },
  {
    icon: Sparkles,
    title: "Add tiny details",
    copy: "Layer in flowers, hearts, or playful icons without making the design feel crowded.",
  },
];

const swatches = ["#f3c6c1", "#f5dfc8", "#d9e4d0", "#b8cadc", "#d8c4e7"];

const Personalized = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#f3e2d4] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute left-[-12rem] top-16 -z-10 h-96 w-96 rounded-full bg-white/55 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-10rem] -z-10 h-96 w-96 rounded-full bg-[#d7e2c7]/45 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal className="relative">
          <div className="relative rounded-[2.25rem] border border-white/70 bg-white/35 p-3 shadow-[0_30px_90px_rgba(91,54,35,0.14)] backdrop-blur">
            <div className="grid gap-3 md:grid-cols-[0.64fr_0.36fr]">
              <div className="relative min-h-[34rem] overflow-hidden rounded-[1.8rem] bg-[#efe0d5]">
                <Image
                  src="/products/img.png"
                  alt="Child wearing a personalized handmade sweater"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-[50%_20%]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2b1b14]/45 to-transparent p-5 pt-24">
                  <div className="inline-flex rounded-full bg-white/88 px-4 py-2 text-sm font-semibold text-[#7b503d] shadow-sm backdrop-blur">
                    Live preview feel, handmade finish
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="relative overflow-hidden rounded-[1.6rem] bg-white p-4 shadow-[0_18px_48px_rgba(79,48,30,0.10)]">
                  <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-[#fff4ef]">
                    <Image
                      src="/Shirts-Varient/Light Pink.avif"
                      alt="Light pink sweater color variant"
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase text-[#a94f2c]">
                    Base color
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {swatches.map((swatch) => (
                      <span
                        key={swatch}
                        className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: swatch }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.6rem] bg-[#2f211b] p-5 text-white shadow-[0_18px_48px_rgba(47,33,27,0.18)]">
                  <p className="text-xs font-semibold uppercase text-[#f2c4a3]">
                    Personalization note
                  </p>
                  <p className="mt-3 text-2xl font-semibold leading-tight">
                    Name, icon, and color choices stay visible together.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 left-6 right-6 hidden rounded-[1.5rem] border border-[#ead7c7] bg-white/92 p-4 shadow-[0_18px_50px_rgba(79,48,30,0.14)] backdrop-blur md:block">
              <div className="grid grid-cols-3 divide-x divide-[#ead7c7] text-center">
                {["Soft yarn", "Clean stitch", "Gift-ready"].map((item) => (
                  <div key={item} className="px-3">
                    <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-[#5f7d55]" />
                    <span className="text-sm font-semibold text-[#4b352d]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase text-[#a94f2c]">
              Personalized by design
            </p>
            <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-normal text-[#241814] md:text-6xl">
              Build the sweater like a keepsake, not a form.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f5a50]">
              The customization area should feel calm and guided: choose the
              name, adjust the palette, add one meaningful accent, then order
              with a design you already understand.
            </p>
          </div>

          <StaggerReveal className="mt-8 grid gap-4">
            {steps.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="group grid grid-cols-[3.25rem_1fr] gap-4 rounded-[1.35rem] border border-[#ead7c7] bg-white/78 p-4 shadow-[0_12px_32px_rgba(79,48,30,0.07)] backdrop-blur transition-transform hover:-translate-y-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1e6] text-[#bf6036]">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-[#bf6036]">
                        0{index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-[#2f211b]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#756156]">
                      {step.copy}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#bf6036] px-7 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(191,96,54,0.22)] transition-colors hover:bg-[#a94f2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bf6036] focus-visible:ring-offset-2"
            >
              Start customizing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm font-medium text-[#7b665c]">
              Preview the look before Etsy checkout.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Personalized;
