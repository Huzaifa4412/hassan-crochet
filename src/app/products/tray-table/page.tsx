"use client";

import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";

// react icons
import { FaStar } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Download, Copy, Grid } from "lucide-react";

// all data 
import { colors, images as originalImages } from "../../../Data";

// components
import CustomizationCanvas, { CustomizationCanvasRef } from "../../../components/CustomizationCanvas";

const ICONS = [
    { name: "Heart", url: "https://api.iconify.design/ph/heart-fill.svg?color=%23000000" },
    { name: "Star", url: "https://api.iconify.design/ph/star-fill.svg?color=%23000000" },
    { name: "Flower", url: "https://api.iconify.design/ph/flower-lotus-fill.svg?color=%23000000" },
    { name: "Crown", url: "https://api.iconify.design/ph/crown-fill.svg?color=%23000000" },
    { name: "Paw", url: "https://api.iconify.design/ph/paw-print-fill.svg?color=%23000000" },
    { name: "Sun", url: "https://api.iconify.design/ph/sun-fill.svg?color=%23000000" },
    { name: "Moon", url: "https://api.iconify.design/ph/moon-fill.svg?color=%23000000" },
    { name: "Cat", url: "https://api.iconify.design/ph/cat-fill.svg?color=%23000000" },
    { name: "Dog", url: "https://api.iconify.design/ph/dog-fill.svg?color=%23000000" },
];

const FONTS = [
    { name: "Sans-serif", value: "Arial, sans-serif" },
    { name: "Serif", value: "Georgia, serif" },
    { name: "Cursive", value: "cursive" },
    { name: "Monospace", value: "monospace" },
];

export default function TrayTableProductPage() {
    const canvasRef = useRef<CustomizationCanvasRef>(null);

    // Normal Product state
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 12, minutes: 45, seconds: 5 });

    // Customization state
    const [customText, setCustomText] = useState("");
    const [textColor, setTextColor] = useState("#000000");
    const [textFont, setTextFont] = useState(FONTS[0].value);
    const [addedIcons, setAddedIcons] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Update canvas base image when color changes
    useEffect(() => {
        if (canvasRef.current) {
            // Find an image that corresponds to the color, or fallback to the first image.
            // Assuming 'originalImages' indices match the colors array for simplicity in this example.
            const colorIndex = colors.findIndex(c => c.name === selectedColor.name);
            const targetImage = originalImages[colorIndex] || originalImages[0];
            canvasRef.current.updateBaseImage(targetImage);
        }
    }, [selectedColor]);

    // Handlers
    const handleAddText = () => {
        if (!customText.trim()) return;
        canvasRef.current?.addText(customText, textFont, textColor);
        setCustomText(""); // reset
    };

    const handleAddIcon = (icon: typeof ICONS[0]) => {
        canvasRef.current?.addIcon(icon.url);
        if (!addedIcons.includes(icon.name)) {
            setAddedIcons(prev => [...prev, icon.name]);
        }
    };

    const handleDownloadPreview = () => {
        canvasRef.current?.download();
    };

    const currentSummary = `Text: ${customText || "None"} | Text Color: ${textColor} | Font: ${FONTS.find(f => f.value === textFont)?.name} | Icons Added: ${addedIcons.length > 0 ? addedIcons.join(", ") : "None"}`;

    const handleCopyCustomizations = () => {
        navigator.clipboard.writeText(currentSummary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatNumber = (number: number) => number.toString().padStart(2, "0");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-600 selection:text-white pb-20">
            {/* Top Navigation / Branding */}
            <header className="px-6 py-8 md:px-12 flex justify-between items-center border-b border-slate-900">
                <div className="text-2xl font-black tracking-tighter uppercase text-white">
                    Lumina<span className="text-blue-500">.</span>
                </div>
                <div className="text-xs font-mono tracking-widest text-slate-500 uppercase">
                    Custom Studio v1.2
                </div>
            </header>

            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 pt-12 md:pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 xl:gap-x-24">

                    {/* Left column - Customization Canvas (span 7 or 8) */}
                    <div className="lg:col-span-8 flex flex-col space-y-6">

                        {/* Title Section Moved to Left side above image for editorial feel */}
                        <div className="space-y-4 mb-2 lg:hidden block">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight">
                                TRAY <br />
                                <span className="text-slate-500 font-light italic">TABLE</span>
                            </h1>
                        </div>

                        {/* Visual Studio Canvas */}
                        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[750px] bg-slate-900 overflow-hidden ring-1 ring-white/5 shadow-2xl shadow-blue-900/10 group">

                            {/* Technical overlay corners */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 z-10 pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50 z-10 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50 z-10 pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50 z-10 pointer-events-none"></div>

                            {/* Tags */}
                            <div className="absolute top-6 left-6 z-10 space-y-2 pointer-events-none flex flex-col items-start">
                                <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest bg-blue-600 text-white uppercase">
                                    Studio Edition
                                </span>
                                <span className="inline-block px-3 py-1 text-[10px] font-mono bg-black/80 backdrop-blur-sm text-slate-300 border border-white/10 uppercase">
                                    Aesthetics: Brutal
                                </span>
                            </div>

                            {/* Instruction tooltip */}
                            <div className="absolute bottom-6 right-6 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0">
                                <div className="flex items-center gap-3 px-4 py-3 bg-black/80 backdrop-blur-md text-white border border-white/10 shadow-2xl">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-xs font-medium tracking-wide">Interactive Canvas</span>
                                </div>
                            </div>

                            <CustomizationCanvas
                                ref={canvasRef}
                                initialImage={originalImages[0]}
                            />
                        </div>
                    </div>

                    {/* Right column - Product details & forms (span 4) */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-12 space-y-10">

                            {/* Product Meta Desktop */}
                            <div className="space-y-6 hidden lg:block">
                                <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-mono text-slate-500">
                                    <span>Furniture</span>
                                    <span className="w-4 h-px bg-slate-700"></span>
                                    <span>Living</span>
                                </div>
                                <h1 className="text-5xl xl:text-7xl font-black text-white leading-[0.85] tracking-tight">
                                    TRAY <br />
                                    <span className="text-slate-500 font-light italic">TABLE</span>
                                </h1>

                                <div className="flex items-baseline gap-4 pt-4">
                                    <span className="text-3xl font-bold text-white tracking-tighter">$199</span>
                                    <span className="text-lg font-mono text-slate-600 line-through decoration-red-500/50">$400</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-slate-800 to-transparent my-8"></div>

                            {/* Color Selection - Sharp UI */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">01 / Chassis</p>
                                    <p className="text-xs font-mono text-white capitalize">{selectedColor.name}</p>
                                </div>

                                <div className="flex gap-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color)}
                                            aria-label={color.name}
                                            className={`relative w-12 h-12 flex-shrink-0 transition-all duration-300 ease-out flex items-center justify-center
                                                ${selectedColor.name === color.name
                                                    ? "ring-1 ring-white scale-110 z-10"
                                                    : "hover:scale-105 opacity-60 hover:opacity-100"
                                                }`}
                                        >
                                            <div className={`w-full h-full ${color.value} ${color.name === 'white' || color.name === 'beige' ? 'border border-slate-200' : ''}`} />
                                            {selectedColor.name === color.name && (
                                                <div className="absolute inset-0 bg-transparent border-2 border-slate-950" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CUSTOMIZATION SECTION - Brutalist HUD */}
                            <div className="space-y-8 bg-slate-900/50 p-6 md:p-8 border border-slate-800 relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                                    <Grid className="w-24 h-24 text-blue-500 stroke-[0.5]" />
                                </div>

                                <div className="space-y-1 relative z-10">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                                        02 / Customization
                                    </h3>
                                    <p className="text-sm font-light text-slate-400">Stamp your identity.</p>
                                </div>

                                {/* Text Customizer */}
                                <div className="space-y-4 relative z-10">
                                    <div className="flex flex-col gap-4">

                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="ENTER MONIKER..."
                                                value={customText}
                                                onChange={(e) => setCustomText(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddText()}
                                                className="w-full bg-slate-950 border-b-2 border-slate-800 px-0 py-3 text-lg font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-colors uppercase"
                                            />
                                        </div>

                                        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-stretch">
                                            <div className="relative flex-shrink-0 w-12 h-12 group border border-slate-800 focus-within:border-blue-500 transition-colors overflow-hidden">
                                                <input
                                                    type="color"
                                                    value={textColor}
                                                    onChange={(e) => setTextColor(e.target.value)}
                                                    className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                                                    title="Ink Color"
                                                />
                                            </div>

                                            <div className="relative flex-1 border border-slate-800 bg-slate-950 focus-within:border-blue-500 transition-colors">
                                                <select
                                                    value={textFont}
                                                    onChange={(e) => setTextFont(e.target.value)}
                                                    className="w-full h-full appearance-none bg-transparent px-4 py-2 text-sm font-mono text-slate-300 outline-none uppercase"
                                                >
                                                    {FONTS.map(f => <option key={f.value} value={f.value} className="bg-slate-900">{f.name}</option>)}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-xs">▼</div>
                                            </div>

                                            <button
                                                onClick={handleAddText}
                                                className="px-6 bg-slate-100 text-slate-950 hover:bg-blue-500 hover:text-white transition-colors duration-300 font-bold text-sm uppercase tracking-wider h-12"
                                            >
                                                Inject
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Icon Customizer */}
                                <div className="space-y-4 pt-6 border-t border-slate-800/50 relative z-10">
                                    <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Symbols</label>
                                    <div className="grid grid-cols-5 gap-0.5 bg-slate-800 p-0.5">
                                        {ICONS.map((icon) => (
                                            <button
                                                key={icon.name}
                                                onClick={() => handleAddIcon(icon)}
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("text/plain", icon.url);
                                                    e.dataTransfer.effectAllowed = "copy";
                                                }}
                                                draggable
                                                title={`Add ${icon.name}`}
                                                className="aspect-square flex items-center justify-center bg-slate-950 hover:bg-blue-900/20 transition-colors cursor-grab active:cursor-grabbing group relative overflow-hidden"
                                            >
                                                <img
                                                    src={icon.url}
                                                    alt={icon.name}
                                                    className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-all filter invert"
                                                    draggable={false}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary & Actions */}
                                <div className="space-y-4 pt-6 border-t border-slate-800/50 relative z-10">
                                    <div className="bg-black/30 p-4 border-l-2 border-blue-500">
                                        <p className="text-[10px] font-mono text-slate-500 mb-2 uppercase">Current Spec</p>
                                        <p className="font-mono text-xs text-slate-300 leading-relaxed truncate">{currentSummary}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDownloadPreview}
                                            className="flex-1 flex items-center justify-center gap-2 h-12 bg-transparent border border-slate-700 hover:border-slate-400 text-slate-300 transition-colors text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Download className="w-4 h-4" />
                                            Render
                                        </button>
                                        <button
                                            onClick={handleCopyCustomizations}
                                            className="flex-1 flex items-center justify-center gap-2 h-12 bg-transparent border border-slate-700 hover:border-slate-400 text-slate-300 transition-colors text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copied ? "Copied" : "Copy Log"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart Footer section */}
                            <div className="pt-4 space-y-4">
                                <div className="flex gap-4 h-14">
                                    <div className="flex items-stretch border border-slate-700 bg-slate-900/50 w-32">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="flex-1 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-10 font-mono text-sm bg-transparent text-center focus:outline-none text-white appearance-none"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="flex-1 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="flex-1 border border-slate-700 bg-transparent hover:bg-slate-900 flex items-center justify-center gap-3 transition-colors uppercase text-xs font-bold tracking-widest text-slate-300"
                                    >
                                        {isFavorite ? <FaHeart className="w-4 h-4 text-red-500" /> : <FaRegHeart className="w-4 h-4" />}
                                        {isFavorite ? "Saved" : "Save"}
                                    </button>
                                </div>

                                <button className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 font-black text-lg uppercase tracking-[0.2em] relative overflow-hidden group">
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        Acquire
                                        <span className="font-light text-blue-200">/</span>
                                        $199
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
