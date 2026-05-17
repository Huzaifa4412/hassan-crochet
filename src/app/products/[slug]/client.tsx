"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Download,
  Copy,
  Heart,
  Info,
  Palette,
  Type,
  Sparkles,
  ArrowRight,
  Shield,
  Truck,
  Gem,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
  Award,
  Clock,
  Quote,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { Pacifico, Sniglet } from "next/font/google";

import CustomizationCanvas, {
  CustomizationCanvasRef,
} from "@/components/CustomizationCanvas";
import { Product } from "@/sanity/queries";
import { useToaster } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";

// Configure Google Fonts
const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const sniglet = Sniglet({ subsets: ["latin"], weight: "400", display: "swap" });

// Purchase notification data (defined outside component to avoid re-renders)
const PURCHASE_LOCATIONS = [
  { city: "Phoenix", country: "USA" },
  { city: "New York", country: "USA" },
  { city: "Los Angeles", country: "USA" },
  { city: "Chicago", country: "USA" },
  { city: "Houston", country: "USA" },
  { city: "Miami", country: "USA" },
  { city: "Seattle", country: "USA" },
  { city: "Boston", country: "USA" },
  { city: "Dallas", country: "USA" },
  { city: "Atlanta", country: "USA" },
  { city: "Denver", country: "USA" },
  { city: "London", country: "UK" },
  { city: "Toronto", country: "Canada" },
  { city: "Sydney", country: "Australia" },
  { city: "Berlin", country: "Germany" },
  { city: "Paris", country: "France" },
  { city: "Rome", country: "Italy" },
];

const TIME_AGO_OPTIONS = [
  "Just now",
  "1 minute ago",
  "2 minutes ago",
  "3 minutes ago",
  "5 minutes ago",
  "8 minutes ago",
  "10 minutes ago",
  "12 minutes ago",
  "15 minutes ago",
];

const ICONS = [
  // Classic Flowers
  { name: "Blue Flower", url: "/icons/Blue Flower-half.png", price: 4 },
  { name: "Brown Flower", url: "/icons/Brown Flower-half.png", price: 4 },
  { name: "Green Flower", url: "/icons/Green Flower-half.png", price: 4 },
  { name: "Orange Flower", url: "/icons/Orange Flower-half.png", price: 4 },
  { name: "Pink Flower", url: "/icons/Pink Flower-half.png", price: 4 },
  { name: "Purple Flower", url: "/icons/Purple Flower-half.png", price: 4 },
  { name: "Purple Flower 2", url: "/icons/Purple Flower2-half.png", price: 4 },
  { name: "White Flower", url: "/icons/White Flower-half.png", price: 4 },
  { name: "Yellow Flower", url: "/icons/Yellow Flower-half.png", price: 4 },
  { name: "Sun Flower", url: "/icons/Sun Flower.png", price: 4 },
  { name: "Pink Sun Flower", url: "/icons/Pink Sun Flower.png", price: 4 },
  { name: "Pink Combo", url: "/icons/Pink Combo.png", price: 4 },
  { name: "White Combo", url: "/icons/White Combo.png", price: 4 },
  { name: "Yellow Combo", url: "/icons/Yellow Combo.png", price: 4 },

  // Nature & Animals
  { name: "Bee", url: "/icons/Bee.png", price: 4 },
  { name: "Bee 2", url: "/icons/Bee 2.png", price: 4 },
  { name: "Bee Flying", url: "/icons/Bee Flying.png", price: 4 },
  { name: "Banana", url: "/icons/Banana.png", price: 4 },
  { name: "Cherry", url: "/icons/Cherry.png", price: 4 },
  { name: "Cherry 2", url: "/icons/cherry 2.png", price: 4 },
  { name: "Strawberry", url: "/icons/Strawberry.png", price: 4 },
  { name: "Leaf", url: "/icons/Leaf.png", price: 4 },
  { name: "Green Leaf", url: "/icons/Green Leaf.png", price: 4 },
  { name: "Sun", url: "/icons/Sun.png", price: 4 },
  { name: "Star", url: "/icons/Star.png", price: 4 },
  { name: "Heart", url: "/icons/Heart.png", price: 4 },
  { name: "Dear", url: "/icons/Dear.png", price: 4 },
  { name: "Mushroom", url: "/icons/Mashroom.png", price: 4 },
  { name: "Grarvo", url: "/icons/Grarvo.png", price: 4 },
  { name: "Pine Apple", url: "/icons/Pine Apply.png", price: 4 },
  { name: "Tree", url: "/icons/Tree.png", price: 4 },
  { name: "Decor", url: "/icons/decore.png", price: 4 },

  // Holiday
  { name: "Christmas Tree", url: "/icons/Chrisman Tree.png", price: 4 },
  { name: "Santa", url: "/icons/Santa.png", price: 4 },
  { name: "Ring Bell", url: "/icons/Ring Bell.png", price: 4 },
];

// Single color options
const SINGLE_TEXT_COLORS = [
  { name: "Midnight Black", value: "#1A1A1D", preview: "#1A1A1D" }, // A1
  { name: "Deep Maroon", value: "#800020", preview: "#800020" }, // A2
  { name: "Rosewood", value: "#9E5B53", preview: "#9E5B53" }, // A3
  { name: "Charcoal Grey", value: "#545454", preview: "#545454" }, // A4
  { name: "Royal Blue", value: "#2B3399", preview: "#2B3399" }, // A5
  { name: "Sand", value: "#D2B48C", preview: "#D2B48C" }, // A6
  { name: "Baby Pink", value: "#F4C2C2", preview: "#F4C2C2" }, // A7
  { name: "Grass Green", value: "#567D46", preview: "#567D46" }, // A8
  { name: "Sunflower Yellow", value: "#FFC300", preview: "#FFC300" }, // A9
  { name: "Grape Purple", value: "#6F2DA8", preview: "#6F2DA8" }, // A10
  { name: "Sage Green", value: "#8A9A5B", preview: "#8A9A5B" }, // A11
  { name: "Denim Blue", value: "#5D8AA8", preview: "#5D8AA8" }, // A12
  { name: "Deep Cobalt", value: "#0047AB", preview: "#0047AB" }, // A13
  { name: "Turquoise", value: "#00CED1", preview: "#00CED1" }, // A14
  { name: "Hot Pink", value: "#FF69B4", preview: "#FF69B4" }, // A15
  { name: "Terracotta", value: "#E2725B", preview: "#E2725B" }, // A16
  { name: "Bright Orange", value: "#FF8C00", preview: "#FF8C00" }, // A17
  { name: "Dusty Rose", value: "#DCAE96", preview: "#DCAE96" }, // A18
  { name: "Lavender", value: "#B57EDC", preview: "#B57EDC" }, // A19
  { name: "Pale Mint", value: "#F5FFFA", preview: "#F5FFFA" }, // A20
  { name: "Forest Green", value: "#014421", preview: "#014421" }, // A21
  { name: "Olive Green", value: "#BAB86C", preview: "#BAB86C" }, // A22
  { name: "Mustard", value: "#E1AD01", preview: "#E1AD01" }, // A23
  { name: "Stone Grey", value: "#888581", preview: "#888581" }, // A24
  { name: "Antique Rose", value: "#9B5D65", preview: "#9B5D65" }, // A25
  { name: "Dark Moss", value: "#4A5D23", preview: "#4A5D23" }, // A26
  { name: "Neon Lime", value: "#CCFF00", preview: "#CCFF00" }, // A27
  { name: "Taupe", value: "#B38B6D", preview: "#B38B6D" }, // A28
  { name: "Seafoam Blue", value: "#93A8AC", preview: "#93A8AC" }, // A29
];

// Multi-color palette options with individual swatches
const MULTI_COLOR_PALETTES = [
  {
    name: "Blossom",
    value: "blossom",
    colors: ["#FF69B4", "#FFB6C1", "#FFF0F5"], // magenta, light pink, pale pink
  },
  {
    name: "Cloudy",
    value: "cloudy",
    colors: ["#87CEEB", "#B0E0E6", "#E6E6FA", "#A9A9A9"], // sky-blue, powder-blue, lavender, gray
  },
  {
    name: "Rainbow",
    value: "rainbow",
    colors: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD"], // pink, yellow, green, blue, purple
  },
  {
    name: "Grassland",
    value: "grassland",
    colors: ["#556B2F", "#98FB98", "#808080"], // olive green, mint green, gray
  },
];

const FONTS = [
  { name: "Pacifico", value: "Pacifico, cursive" },
  { name: "Sniglet", value: "Sniglet, cursive" },
];

interface ProductClientProps {
  product: Product;
}

// Helper to get Tailwind bg class from color value
function getBgClass(colorValue: string): string {
  if (colorValue?.startsWith("#")) {
    const hex = colorValue.toLowerCase();
    const colorMap: Record<string, string> = {
      "#000000": "bg-black",
      "#ffffff": "bg-white",
      "#d2c4b5": "bg-[#D2C4B5]",
      "#ef4444": "bg-red-500",
      "#dc2626": "bg-red-600",
    };
    return colorMap[hex] || `bg-[${colorValue}]`;
  }
  return colorValue || "";
}

// Get badge labels from product data
function getBadgeLabels(badges?: string[]): {
  primary?: string;
  secondary?: string;
} {
  if (!badges || badges.length === 0) {
    return { primary: "Handmade", secondary: "Customizable" };
  }
  return {
    primary: badges[0],
    secondary: badges.length > 1 ? badges[1] : "Customizable",
  };
}

// Review Card Component
interface Review {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  date: string;
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      initial={false}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="h-full"
    >
      <Card className="group flex h-full min-h-[560px] overflow-hidden rounded-[1.75rem] border border-[#ead7c7] bg-[#fffdf9] shadow-[0_18px_50px_rgba(91,54,37,0.1)] transition-all duration-300 hover:border-[#cf6f3f]/50 hover:shadow-[0_28px_70px_rgba(91,54,37,0.16)]">
        <div className="p-3 pb-0">
          <div className="relative overflow-hidden rounded-[1.35rem] border border-[#ead7c7] bg-[#f4e8dd] shadow-inner">
            <div className="h-[310px] w-full overflow-hidden bg-[#f4e8dd]">
              <img
                src={review.image}
                alt={`Customer photo from ${review.name}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
              />
            </div>
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/70 bg-white/92 px-3 py-1.5 shadow-md backdrop-blur">
              <Check className="size-3.5 text-[#3f7b4b]" />
              <span className="text-[11px] font-bold text-[#4d3b34]">
                Verified
              </span>
            </div>
            <div className="absolute bottom-3 right-3 rounded-full border border-[#ead7c7] bg-white/92 px-3 py-1.5 text-[11px] font-bold text-[#bf6036] shadow-lg backdrop-blur">
              Customer photo
            </div>
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-3.5 ${star <= review.rating ? "fill-[#f5b301] text-[#f5b301]" : "fill-[#ead7c7] text-[#ead7c7]"}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-[#9a7867]">
              {review.date}
            </span>
          </div>

          <blockquote className="flex-1 rounded-[1.25rem] bg-[#fff7ef] px-4 py-3">
            <p className="text-center text-sm font-semibold leading-6 text-[#321f18]">
              &ldquo;{review.text}&rdquo;
            </p>
          </blockquote>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#ead7c7] pt-3">
            <div>
              <p className="text-sm font-black text-[#251611]">{review.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#7a6258]">
                <span className="size-1 rounded-full bg-[#cf6f3f]" />
                {review.location}
              </p>
            </div>
            <Quote className="size-5 text-[#cf6f3f]/55" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProductClient({ product }: ProductClientProps) {
  const canvasRef = useRef<CustomizationCanvasRef>(null);
  const { addToast } = useToaster();

  // Social proof state (fixed initial values instead of random)
  const [boughtIn24h, setBoughtIn24h] = useState(105);
  const [customizingNow, setCustomizingNow] = useState(87);

  // Reviews data with new images
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      location: "Los Angeles, CA",
      image: "/reviews/iap_600x600.7262401728_ae9vfp81.webp",
      rating: 5,
      text: "Absolutely love my customized crochet piece! The quality is amazing and it looks exactly like I designed it.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Emily R.",
      location: "New York, NY",
      image: "/reviews/iap_600x600.7328186625_r1km0fan.webp",
      rating: 5,
      text: "The customization process was so easy and fun. My order arrived quickly and exceeded my expectations!",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Jessica T.",
      location: "Chicago, IL",
      image: "/reviews/iap_600x600.7339273571_jw5pkmrx.webp",
      rating: 5,
      text: "Perfect gift for my sister's birthday! She was thrilled with the personal touch. Will definitely order again.",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "Amanda K.",
      location: "Miami, FL",
      image: "/reviews/iap_600x600.7350513508_e26ewa8o.webp",
      rating: 5,
      text: "Beautiful craftsmanship and the colors are even better in person. Highly recommend!",
      date: "5 days ago",
    },
    {
      id: 5,
      name: "Rachel P.",
      location: "Seattle, WA",
      image: "/reviews/iap_600x600.7427157934_78avfdyy.webp",
      rating: 5,
      text: "This is my third purchase and I'm never disappointed. The attention to detail is outstanding.",
      date: "1 day ago",
    },
    {
      id: 6,
      name: "Jennifer L.",
      location: "Denver, CO",
      image: "/reviews/iap_600x600.7499091595_dm9fhjrt.webp",
      rating: 5,
      text: "Fast shipping and excellent customer service. The final product is stunning!",
      date: "4 days ago",
    },
    {
      id: 7,
      name: "Melissa H.",
      location: "Phoenix, AZ",
      image: "/reviews/iap_600x600.7582209944_dtbqy69e.webp",
      rating: 5,
      text: "Love how I could personalize every detail. It made for such a thoughtful gift.",
      date: "6 days ago",
    },
    {
      id: 8,
      name: "Nicole S.",
      location: "Boston, MA",
      image: "/reviews/iap_600x600.7647883905_626g80nw.webp",
      rating: 5,
      text: "The quality exceeded my expectations. Beautiful work and great communication!",
      date: "2 weeks ago",
    },
    {
      id: 9,
      name: "Stephanie B.",
      location: "Dallas, TX",
      image: "/reviews/iap_600x600.7716775214_ho4q4bo4 (1).webp",
      rating: 5,
      text: "Absolutely gorgeous! The personalization options are fantastic and the result is perfect.",
      date: "1 week ago",
    },
  ];

  // Show purchase notification toast periodically
  useEffect(() => {
    const showPurchaseNotification = () => {
      const location =
        PURCHASE_LOCATIONS[
          Math.floor(Math.random() * PURCHASE_LOCATIONS.length)
        ];
      const timeAgo =
        TIME_AGO_OPTIONS[Math.floor(Math.random() * TIME_AGO_OPTIONS.length)];

      addToast({
        variant: "purchase",
        message: `Someone from ${location.city}, ${location.country} purchased ${timeAgo}`,
        duration: 6000,
      });
    };

    // Show first notification after 3 seconds
    const firstTimer = setTimeout(showPurchaseNotification, 3000);

    // Show subsequent notifications every 15-25 seconds
    const intervalTimer = setInterval(
      () => {
        showPurchaseNotification();
      },
      Math.random() * 10000 + 15000,
    );

    return () => {
      clearTimeout(firstTimer);
      clearInterval(intervalTimer);
    };
  }, [addToast]);

  // Animate bought count (slower, more realistic)
  useEffect(() => {
    const interval = setInterval(() => {
      setBoughtIn24h((prev) => {
        // Only increase occasionally (70% chance of staying the same or +1, 30% chance of -1)
        const change = Math.random() > 0.3 ? (Math.random() > 0.5 ? 1 : 0) : -1;
        return Math.max(50, Math.min(150, prev + change));
      });
    }, 15000); // Update every 15 seconds instead of 3

    return () => clearInterval(interval);
  }, []);

  // Animate customizing count (slower, more realistic)
  useEffect(() => {
    const interval = setInterval(() => {
      setCustomizingNow((prev) => {
        // Small fluctuations, mostly staying stable
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        return Math.max(40, Math.min(120, prev + change));
      });
    }, 20000); // Update every 20 seconds instead of 4

    return () => clearInterval(interval);
  }, []);

  // Convert Sanity variants to color format
  const colors =
    product.variants
      ?.map((v) => ({
        name: v.colorName,
        value: v.colorValue ? getBgClass(v.colorValue) : undefined,
        imageUrl: v.imageUrl,
        sortOrder: v.sortOrder ?? 0,
      }))
      ?.sort((a, b) => a.sortOrder - b.sortOrder) || [];

  // Product state
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Customization state
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState(SINGLE_TEXT_COLORS[0].value);
  const [textFont, setTextFont] = useState(FONTS[0].value);
  const [isMultiColor, setIsMultiColor] = useState(false);
  const [addedIcons, setAddedIcons] = useState<string[]>([]);
  const [addedTexts, setAddedTexts] = useState<
    Array<{ text: string; color: string; font: string }>
  >([]);
  const [copied, setCopied] = useState(false);

  // Selection state
  const [hasSelectedText, setHasSelectedText] = useState(false);
  const [selectedObjectType, setSelectedObjectType] = useState<
    "text" | "group" | "image" | null
  >(null);

  // UI state
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Update canvas base image when color changes
  useEffect(() => {
    if (canvasRef.current && selectedColor && selectedColor.imageUrl) {
      canvasRef.current.updateBaseImage(selectedColor.imageUrl);
    }
  }, [selectedColor]);

  // Handlers
  const handleAddText = () => {
    if (!customText.trim()) return;
    canvasRef.current?.addText(customText, textFont, textColor);
    setAddedTexts((prev) => [
      ...prev,
      { text: customText, color: textColor, font: textFont },
    ]);
    setCustomText("");
  };

  // Handle selection change from canvas
  const handleSelectionChange = (
    hasSelection: boolean,
    selectionType: "text" | "group" | "image" | null,
  ) => {
    setHasSelectedText(
      hasSelection && (selectionType === "text" || selectionType === "group"),
    );
    setSelectedObjectType(selectionType);
  };

  const handleDeleteSelected = () => {
    canvasRef.current?.deleteSelected();
  };

  const handleObjectRemoved = (type: "text" | "icon", name: string) => {
    if (type === "icon") {
      setAddedIcons((prev) => prev.filter((i) => i !== name));
    } else if (type === "text") {
      setAddedTexts((prev) => prev.filter((t) => t.text !== name));
    }
  };

  // Handle color change - update selected object if exists
  const handleTextColorChange = (newColor: string, multiColor: boolean) => {
    setTextColor(newColor);
    setIsMultiColor(multiColor);

    // If a text object is selected, update it in real-time
    if (
      hasSelectedText &&
      (selectedObjectType === "text" || selectedObjectType === "group")
    ) {
      canvasRef.current?.updateSelectedTextColor(newColor, textFont);
    }
  };

  // Handle font change - update selected object if exists
  const handleFontChange = (newFont: string) => {
    setTextFont(newFont);

    // If a text object is selected, update it in real-time
    if (
      hasSelectedText &&
      (selectedObjectType === "text" || selectedObjectType === "group")
    ) {
      canvasRef.current?.updateSelectedTextColor(textColor, newFont);
    }
  };

  const handleAddIcon = (icon: (typeof ICONS)[0]) => {
    canvasRef.current?.addIcon(icon.url);
    if (!addedIcons.includes(icon.name)) {
      setAddedIcons((prev) => [...prev, icon.name]);
    }
  };

  const handleDownloadPreview = () => {
    canvasRef.current?.download();
  };

  const currentSummary = `Product: ${product.title} | Color: ${selectedColor?.name} | Text: ${addedTexts.length > 0 ? addedTexts.map((t) => t.text).join(", ") : "None"} | Text Color: ${isMultiColor ? MULTI_COLOR_PALETTES.find((p) => p.value === textColor)?.name : SINGLE_TEXT_COLORS.find((c) => c.value === textColor)?.name} | Font: ${FONTS.find((f) => f.value === textFont)?.name} | Icons: ${addedIcons.length > 0 ? addedIcons.join(", ") : "None"}`;

  const handleCopyCustomizations = () => {
    navigator.clipboard.writeText(currentSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderForm,
          productName: product.title,
          productLink: product.etsyLink || "Link Not Provided",
          customizationDetails: currentSummary,
        }),
      });

      if (response.ok) {
        if (product.etsyLink) {
          window.open(product.etsyLink, "_blank", "noopener,noreferrer");
        } else {
          addToast({
            variant: "default",
            message:
              "Etsy link for this product is not available. Please contact us.",
            duration: 5000,
          });
        }
        setIsOrderDialogOpen(false);
        setOrderForm({ name: "", email: "", phone: "", address: "" });
      } else {
        const errorData = await response.json();
        addToast({
          variant: "default",
          message:
            "Failed to submit order: " + (errorData.message || "Unknown error"),
          duration: 5000,
        });
      }
    } catch {
      addToast({
        variant: "default",
        message: "Failed to submit order. Please check your connection.",
        duration: 5000,
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const badges = getBadgeLabels(product.badges);
  const trustHighlights = [
    { icon: Shield, label: "Secure Etsy checkout" },
    { icon: Truck, label: "Made to order" },
    { icon: Heart, label: "Handmade keepsake" },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf4] text-[#251611]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-[#7a6258] sm:mb-7 sm:gap-2 sm:text-sm">
          <Link
            href="/"
            className="shrink-0 transition-colors hover:text-[#bf6036]"
          >
            Home
          </Link>
          <span className="shrink-0">/</span>
          <Link
            href="/products"
            className="shrink-0 transition-colors hover:text-[#bf6036]"
          >
            Products
          </Link>
          <span className="shrink-0">/</span>
          <span className="truncate text-[#251611]">
            {product.title}
          </span>
        </nav>

        {/* Product Header */}
        <motion.header
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 overflow-hidden rounded-[2rem] border border-[#ead7c7] bg-white/75 shadow-[0_24px_80px_rgba(124,82,58,0.12)] backdrop-blur sm:mb-10"
        >
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {badges.primary && (
                  <Badge className="rounded-full border border-[#e6c6b4] bg-[#fff1e6] px-3 py-1 text-xs font-semibold text-[#a84e2b] hover:bg-[#fff1e6]">
                    {badges.primary}
                  </Badge>
                )}
                {badges.secondary && (
                  <Badge className="rounded-full border border-[#ead7c7] bg-white px-3 py-1 text-xs font-semibold text-[#6f574d] hover:bg-white">
                    {badges.secondary}
                  </Badge>
                )}
                {product.category && (
                  <Badge className="rounded-full border border-[#ead7c7] bg-[#f7efe8] px-3 py-1 text-xs font-semibold text-[#6f574d] hover:bg-[#f7efe8]">
                    {product.category.title}
                  </Badge>
                )}
                {product.inStock === false && (
                  <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bf6036]">
                  Personalized crochet studio
                </p>
                <h1 className="max-w-3xl text-3xl font-black leading-[0.95] tracking-tight text-[#24130f] sm:text-5xl lg:text-6xl">
                  {product.title}
                </h1>
                {product.shortDescription && (
                  <p className="max-w-2xl text-base leading-7 text-[#735f56] sm:text-lg">
                    {product.shortDescription}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {trustHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-[#ead7c7] bg-[#fffaf4] px-4 py-3"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-[#cf6f3f] text-white shadow-[0_12px_30px_rgba(207,111,63,0.25)]">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm font-semibold text-[#4d3b34]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.header>

        {/* Main Content - Flex container with sticky */}
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          {/* Left Column - Canvas (Sticky on all devices) */}
          <motion.div
            initial={false}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="sticky top-16 z-20 order-first self-start lg:top-24"
          >
            <Card className="overflow-hidden rounded-[2rem] border border-[#ead7c7] bg-white shadow-[0_24px_70px_rgba(124,82,58,0.16)]">
              <CardContent className="p-0">
                <div className="relative h-[310px] w-full overflow-hidden bg-[#f5ece4] sm:h-[420px] lg:min-h-[560px]">
                  <div className="absolute inset-4 rounded-[1.5rem] border border-white/70 pointer-events-none" />
                  {/* Badges */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex flex-col gap-2">
                    {badges.primary && (
                      <Badge className="rounded-full bg-[#251611] px-3 py-1 text-[10px] text-white shadow-lg hover:bg-[#251611] sm:text-xs">
                        {badges.primary}
                      </Badge>
                    )}
                  </div>

                  {/* Interactive indicator */}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 pointer-events-none">
                    <div className="flex items-center gap-2 rounded-full border border-[#ead7c7] bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
                      <Sparkles className="size-4 text-[#bf6036]" />
                      <span className="text-xs font-semibold text-[#4d3b34] sm:text-sm">
                        Drag to customize
                      </span>
                    </div>
                  </div>

                  {/* Remove Selected Button */}
                  {selectedObjectType && (
                    <div className="absolute bottom-3 left-3 z-20">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDeleteSelected}
                        className="h-8 gap-1.5 shadow-lg animate-in fade-in slide-in-from-bottom-2 bg-red-600 hover:bg-red-700 text-white border-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  )}

                  <CustomizationCanvas
                    ref={canvasRef}
                    initialImage={
                      selectedColor?.imageUrl || colors[0]?.imageUrl || ""
                    }
                    onSelectionChange={handleSelectionChange}
                    onObjectRemoved={handleObjectRemoved}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Customization (Scrollable) */}
          <div className="min-w-0 space-y-5">
            {/* Action Bar */}

            {/* Color Selection */}
            <motion.div
              initial={false}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
            <Card className="w-full overflow-hidden rounded-[1.75rem] border border-[#ead7c7] bg-white/90 shadow-[0_18px_55px_rgba(124,82,58,0.1)]">
              <CardHeader className="px-4 pb-3 sm:px-6 sm:pb-4">
                {/* In demand text above color selection */}
                <div className="mb-2 sm:mb-3">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#a84e2b] sm:text-sm md:text-base">
                    <span className="size-2 rounded-full bg-[#cf6f3f] shadow-[0_0_0_6px_rgba(207,111,63,0.12)]" />
                    In demand.{" "}
                    <span className="inline-block min-w-[2ch]">
                      {boughtIn24h}
                    </span>{" "}
                    people bought this in the last 24 hours.
                  </p>
                </div>
                <CardTitle className="text-lg font-black text-[#251611] sm:text-xl">
                  Choose Your Color
                </CardTitle>
                <CardDescription className="text-sm text-[#7a6258]">
                  Pick the sweater base before adding text and icon details.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {colors.map((color) => (
                    <TooltipProvider key={color.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedColor(color)}
                            aria-label={color.name}
                            className={`relative aspect-square overflow-hidden rounded-2xl border-2 bg-[#f8efe8] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#cf6f3f] focus:ring-offset-2 focus:ring-offset-white ${
                              selectedColor?.name === color.name
                                ? "border-[#cf6f3f] shadow-lg ring-2 ring-[#cf6f3f]/25"
                                : "border-[#ead7c7] opacity-90 hover:border-[#cf6f3f]/60 hover:opacity-100 hover:shadow-md"
                            }`}
                          >
                            {color.imageUrl ? (
                              <img
                                src={color.imageUrl}
                                alt={color.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                  {color.name}
                                </span>
                              </div>
                            )}
                            {selectedColor?.name === color.name && (
                              <div className="absolute inset-0 flex items-center justify-center bg-[#cf6f3f]/20">
                                <Check className="h-5 w-5 sm:h-8 sm:w-8 text-white drop-shadow-lg" />
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="capitalize font-medium">{color.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
            </motion.div>

            {/* Customization Studio */}
            <Card className="w-full overflow-hidden rounded-[1.75rem] border border-[#ead7c7] bg-white/95 shadow-[0_18px_55px_rgba(124,82,58,0.1)]">
              <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
                <Accordion
                  type="multiple"
                  defaultValue={["text", "icons"]}
                  className="w-full"
                >
                  {/* Text Customization */}
                  <AccordionItem
                    value="text"
                    className="border-b last:border-0"
                  >
                    <AccordionTrigger className="hover:no-underline py-3 sm:py-4 px-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#fff1e6] text-[#bf6036] sm:size-11">
                          <Type className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          {/* Customizing count above Add Text */}
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#a84e2b] sm:text-sm md:text-base">
                            <span className="size-2 rounded-full bg-[#cf6f3f] shadow-[0_0_0_6px_rgba(207,111,63,0.12)]" />
                            <span className="inline-block min-w-[2ch]">
                              {customizingNow}
                            </span>{" "}
                            shoppers are customizing this right now.
                          </div>
                          <div className="mt-0.5 text-[10px] text-[#7a6258] sm:mt-1 sm:text-xs">
                            Personalize with your message
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-3 sm:pt-4 pb-4 sm:pb-6 space-y-3 sm:space-y-5 px-1">
                      {/* Text Input */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="custom-text"
                          className="text-xs sm:text-sm font-medium"
                        >
                          Your Message
                        </Label>
                        <div className="flex gap-1.5 sm:gap-2">
                          <Input
                            id="custom-text"
                            placeholder="Type your message..."
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddText()
                            }
                            className="h-10 flex-1 rounded-xl border-[#ead7c7] bg-[#fffaf4] text-sm focus-visible:ring-[#cf6f3f] sm:h-11"
                          />
                          <Button
                            onClick={handleAddText}
                            size="icon"
                            className="h-10 w-10 rounded-xl bg-[#cf6f3f] text-white hover:bg-[#b95c33] sm:h-11 sm:w-11"
                            disabled={!customText.trim()}
                          >
                            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Font Selection */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label
                          htmlFor="text-font"
                          className="text-xs sm:text-sm font-medium"
                        >
                          Font Style
                        </Label>
                        <Select
                          value={textFont}
                          onValueChange={handleFontChange}
                        >
                          <SelectTrigger
                            id="text-font"
                            className="h-10 w-full rounded-xl border-[#ead7c7] bg-[#fffaf4] text-sm focus:ring-[#cf6f3f] sm:h-11"
                          >
                            <SelectValue>
                              <span
                                style={{ fontFamily: textFont }}
                                className="text-xs sm:text-sm"
                              >
                                {FONTS.find((f) => f.value === textFont)?.name}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {FONTS.map((f) => (
                              <SelectItem
                                key={f.value}
                                value={f.value}
                                className="text-sm"
                              >
                                <span style={{ fontFamily: f.value }}>
                                  {f.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs sm:text-sm font-medium">
                            Text Color
                          </Label>
                          {hasSelectedText && (
                            <span className="text-[10px] sm:text-xs text-primary bg-primary/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary animate-pulse" />
                              <span className="hidden sm:inline">
                                Editing selected text
                              </span>
                              <span className="sm:hidden">Editing</span>
                            </span>
                          )}
                        </div>

                        {/* Single Colors Grid */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1 overflow-hidden">
                          {SINGLE_TEXT_COLORS.map((color) => (
                            <TooltipProvider key={color.value}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() =>
                                      handleTextColorChange(color.value, false)
                                    }
                                    aria-label={color.name}
                                    className={`relative size-8 overflow-hidden rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#cf6f3f] focus:ring-offset-2 ${
                                      textColor === color.value && !isMultiColor
                                        ? "border-[#cf6f3f] shadow-lg ring-2 ring-[#cf6f3f]/25"
                                        : "border-[#ead7c7] opacity-75 shadow-sm hover:opacity-100"
                                    }`}
                                  >
                                    <div
                                      className="w-full h-full"
                                      style={{ backgroundColor: color.preview }}
                                    />
                                    {textColor === color.value &&
                                      !isMultiColor && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                          <Check className="h-4 w-4 text-white drop-shadow-md" />
                                        </div>
                                      )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="font-medium">{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>

                        {/* Multi Colors Section */}
                        <div className="space-y-2 pt-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Multi colors
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {MULTI_COLOR_PALETTES.map((palette) => (
                              <button
                                key={palette.value}
                                onClick={() =>
                                  handleTextColorChange(palette.value, true)
                                }
                                className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                  textColor === palette.value && isMultiColor
                                    ? "border-[#cf6f3f] bg-[#fff1e6] shadow-md"
                                    : "border-[#ead7c7] bg-[#fffaf4] hover:border-[#cf6f3f]/60"
                                }`}
                              >
                                {/* Color Swatches - compact horizontal */}
                                <div className="flex gap-1">
                                  {palette.colors.map((swatchColor, idx) => (
                                    <div
                                      key={idx}
                                      className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                      style={{ backgroundColor: swatchColor }}
                                    />
                                  ))}
                                </div>
                                {/* Palette Name */}
                                <span className="text-xs font-medium">
                                  {palette.name}
                                </span>
                                {/* Selected indicator */}
                                {textColor === palette.value &&
                                  isMultiColor && (
                                      <div className="absolute top-1 right-1">
                                      <div className="w-4 h-4 rounded-full bg-[#cf6f3f] flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white" />
                                      </div>
                                    </div>
                                  )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Icons Customization */}
                  <AccordionItem
                    value="icons"
                    className="border-b last:border-0"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#fff1e6] text-[#bf6036]">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-[#251611]">Add Icons</div>
                          <div className="text-xs text-[#7a6258]">
                            Decorate with beautiful icons
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-4">
                      <div className="grid max-h-[280px] grid-cols-6 gap-3 overflow-y-auto pr-2 scrollbar-hide">
                        {ICONS.map((icon) => (
                          <TooltipProvider key={icon.name}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleAddIcon(icon)}
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData(
                                      "text/plain",
                                      icon.url,
                                    );
                                    e.dataTransfer.effectAllowed = "copy";
                                  }}
                                  draggable
                                  className="group relative flex aspect-square cursor-grab items-center justify-center rounded-2xl border border-[#ead7c7] bg-[#fffaf4] shadow-sm transition-all hover:border-[#cf6f3f]/60 hover:bg-[#fff1e6] hover:shadow-md active:cursor-grabbing"
                                >
                                  <img
                                    src={icon.url}
                                    alt={icon.name}
                                    className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity"
                                    draggable={false}
                                  />
                                  {addedIcons.includes(icon.name) && (
                                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#cf6f3f] shadow-md">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="flex flex-col items-center">
                                <p>{icon.name}</p>
                                <p>(+ $ {icon.price} USD)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Click or drag icons to add to your design
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Separator className="bg-[#ead7c7]" />

                {/* Summary */}
                <Alert className="rounded-2xl border-[#ead7c7] bg-[#fffaf4]">
                  <Info className="h-4 w-4 text-[#bf6036]" />
                  <AlertDescription className="text-sm">
                    <div className="space-y-2">
                      <p className="font-bold flex items-center gap-2 text-[#251611]">
                        <Award className="h-4 w-4" />
                        Your Customization
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <span className="text-[#7a6258]">Color:</span>
                        <span className="font-medium text-[#251611]">
                          {selectedColor?.name}
                        </span>
                        <span className="text-[#7a6258]">Text:</span>
                        <span className="font-medium text-[#251611]">
                          {addedTexts.length > 0
                            ? addedTexts.map((t) => t.text).join(", ")
                            : "None"}
                        </span>
                        <span className="text-[#7a6258]">
                          Text Color:
                        </span>
                        <span className="font-medium text-[#251611]">
                          {isMultiColor
                            ? MULTI_COLOR_PALETTES.find(
                                (p) => p.value === textColor,
                              )?.name
                            : SINGLE_TEXT_COLORS.find(
                                (c) => c.value === textColor,
                              )?.name}
                        </span>
                        <span className="text-[#7a6258]">Icons:</span>
                        <span className="font-medium text-[#251611]">
                          {addedIcons.length > 0
                            ? addedIcons.join(", ")
                            : "None"}
                        </span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadPreview}
                    className="h-11 gap-2 rounded-xl border-[#d9bca9] bg-white text-[#5c4036] hover:bg-[#fff1e6] hover:text-[#251611]"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyCustomizations}
                    className="h-11 gap-2 rounded-xl border-[#d9bca9] bg-white text-[#5c4036] hover:bg-[#fff1e6] hover:text-[#251611]"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                {/* Etsy Note */}
                <div className="mt-4 rounded-2xl border border-[#ead7c7] bg-[#f9efe2] p-4">
                  <p className="flex items-start gap-2 text-sm font-bold text-[#5c4036]">
                    <Info className="mt-0.5 size-4 text-[#bf6036]" />
                    <span>Important Note:</span>
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#7a6258]">
                    Please copy the text below to Etsy&apos;s personalization
                    box, or take a screenshot and send it to the seller!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium CTA */}
            <Card className="relative w-full overflow-hidden rounded-[1.75rem] border-0 bg-[#251611] text-white shadow-[0_24px_70px_rgba(37,22,17,0.28)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f5d6bd] to-transparent" />
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4 relative z-10">
                <div className="flex items-center justify-center">
                  <Badge className="border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#ffe4d0] shadow-md backdrop-blur-sm hover:bg-white/10 sm:px-4 sm:py-1.5 sm:text-xs">
                    CUSTOM ORDER
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-300 text-yellow-300" />
                    <span>Premium handmade craftsmanship</span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOrderDialogOpen(true)}
                  className="h-11 w-full rounded-full bg-[#cf6f3f] text-sm font-bold text-white shadow-xl hover:bg-[#dd7d4e] sm:h-12 sm:text-base"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  Order on Etsy
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
                </Button>
                <p className="text-center text-xs leading-relaxed text-[#f5d6bd] sm:text-base">
                  Pricing starts at $18.99. Choose your perfect size ( from 0
                  months to 7 Years) and complete your order securely on Etsy.
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <div className="text-center">
                    <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm sm:h-9 sm:w-9">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-medium opacity-90">
                      Secure
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm sm:h-9 sm:w-9">
                      <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-medium opacity-90">
                      Fast
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm sm:h-9 sm:w-9">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-medium opacity-90">
                      Handmade
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="relative mt-16 overflow-hidden rounded-[2.25rem] border border-[#ead7c7] bg-[#fff7ef] px-4 py-6 shadow-[0_24px_80px_rgba(124,82,58,0.12)] sm:px-6 sm:py-8 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="pointer-events-none absolute -left-24 bottom-10 h-48 w-48 rounded-full bg-[#e9b896]/20 blur-3xl" />
          {/* Section Header */}
          <div className="relative grid gap-5 px-1 sm:px-2 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#dfbea9] bg-white px-3 py-1.5 shadow-sm sm:gap-2 sm:px-4 sm:py-2">
                <Quote className="w-3 h-3 text-[#bf6036] sm:w-4 sm:h-4" />
                <span className="text-xs font-bold text-[#bf6036] sm:text-sm">
                  Customer gallery
                </span>
              </div>
              <div className="max-w-2xl space-y-3">
                <h2 className="text-3xl font-black leading-[0.98] tracking-tight text-[#251611] sm:text-4xl md:text-5xl">
                  Real little moments, stitched into sweaters.
                </h2>
                <p className="max-w-xl text-sm leading-7 text-[#7a6258] sm:text-base">
                  Browse customer photos, names, colors, and keepsake details
                  from families who customized their own crochet piece.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 overflow-hidden rounded-[1.5rem] border border-[#ead7c7] bg-white shadow-[0_18px_45px_rgba(124,82,58,0.08)]">
              <div className="border-r border-[#ead7c7] p-4 text-center">
                <p className="text-2xl font-black text-[#251611]">5.0</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7867]">
                  Rating
                </p>
              </div>
              <div className="border-r border-[#ead7c7] p-4 text-center">
                <p className="text-2xl font-black text-[#251611]">300+</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7867]">
                  Orders
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-2xl font-black text-[#251611]">Photo</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a7867]">
                  Proof
                </p>
              </div>
            </div>
          </div>

          {/* Rating Summary */}

          {/* Swiper Carousel */}
          <div className="relative mt-8 px-1 sm:px-2">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={18}
              slidesPerView="auto"
              centeredSlides={false}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                bulletClass:
                  "w-2 h-2 rounded-full bg-[#cf6f3f]/25 opacity-100 transition-all",
                bulletActiveClass: "w-7 bg-[#cf6f3f]",
              }}
              navigation={{
                nextEl: ".reviews-button-next",
                prevEl: ".reviews-button-prev",
              }}
              loop={true}
              className="reviews-swiper !overflow-visible pb-12"
            >
              {reviews.map((review) => (
                <SwiperSlide
                  key={review.id}
                  className="!h-auto !w-[84vw] sm:!w-[360px] lg:!w-[350px]"
                >
                  <ReviewCard review={review} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons - Hidden on mobile */}
            <button
              className="reviews-button-prev group absolute -left-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#ead7c7] bg-white text-[#5c4036] shadow-lg transition-all hover:border-[#cf6f3f] hover:bg-[#cf6f3f] hover:text-white sm:flex"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              className="reviews-button-next group absolute -right-2 top-[42%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#ead7c7] bg-white text-[#5c4036] shadow-lg transition-all hover:border-[#cf6f3f] hover:bg-[#cf6f3f] hover:text-white sm:flex"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </section>

        {/* Order Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Complete Your Customization</DialogTitle>
              <DialogDescription>
                Please provide your details before we redirect you to Etsy to
                complete the purchase. This helps us match your customization to
                your order.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleOrderSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={orderForm.name}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={orderForm.email}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number ( For Shipping Purpose )
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input
                  id="address"
                  value={orderForm.address}
                  onChange={(e) =>
                    setOrderForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="123 Main St, City, Country"
                  required
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOrderDialogOpen(false)}
                  disabled={isSubmittingOrder}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmittingOrder}>
                  {isSubmittingOrder ? "Processing..." : "Continue to Etsy"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
