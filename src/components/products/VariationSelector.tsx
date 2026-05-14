"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

// Mapping of common eyewear colors to hex codes
const COLOR_MAP: Record<string, string> = {
    "Black": "#000000",
    "Phantom Black": "#000000",
    "Navy": "#1e293b",
    "Deep Navy": "#1e293b",
    "Gray": "#475569",
    "Gunmetal Gray": "#475569",
    "Gold": "#d4af37",
    "Luxe Gold": "#d4af37",
    "Silver": "#94a3b8",
    "Silver Titanium": "#94a3b8",
    "Tortoise": "#78350f",
    "Brown": "#78350f",
    "Clear": "#f8fafc",
    "Rose Gold": "#fda4af",
};

interface VariationSelectorProps {
    variants?: Array<{ color?: string; size?: string }>;
    onChange: (selections: { color: string; size: string }) => void;
}

export function VariationSelector({ variants = [], onChange }: VariationSelectorProps) {
    // Extract unique colors and sizes from variants
    const availableColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean))) as string[];
    const availableSizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean))) as string[];

    // Fallbacks if no variants provided
    const displayColors = availableColors.length > 0 ? availableColors : ["Phantom Black"];
    const displaySizes = availableSizes.length > 0 ? availableSizes : ["S", "M", "L"];

    const [selectedColor, setSelectedColor] = useState(displayColors[0]);
    const [selectedSize, setSelectedSize] = useState(displaySizes.includes("M") ? "M" : displaySizes[0]);

    useEffect(() => {
        onChange({ color: selectedColor, size: selectedSize });
    }, [selectedColor, selectedSize]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Color Selector */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Finish: <span className="text-slate-900">{selectedColor}</span></span>
                </div>
                <div className="flex items-center gap-3">
                    {displayColors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`relative w-8 h-8 rounded-full transition-all duration-300 border border-slate-100 ${
                                selectedColor === color ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: COLOR_MAP[color] || "#cbd5e1" }}
                        >
                            {selectedColor === color && (
                                <Check className={`w-3 h-3 absolute inset-0 m-auto drop-shadow-md ${color === 'Clear' ? 'text-slate-900' : 'text-white'}`} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Size: <span className="text-slate-900">{selectedSize}</span></span>
                </div>
                <div className="flex items-center gap-2">
                    {displaySizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-10 h-10 rounded-xl border-2 transition-all font-black text-xs ${
                                selectedSize === size ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
