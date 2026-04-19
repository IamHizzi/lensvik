"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

const COLORS = [
    { name: "Phantom Black", hex: "#000000" },
    { name: "Deep Navy", hex: "#1e293b" },
    { name: "Gunmetal Gray", hex: "#475569" },
    { name: "Luxe Gold", hex: "#d4af37" },
    { name: "Silver Titanium", hex: "#94a3b8" }
];

const SIZES = [
    { label: "S", description: "Narrow Fit" },
    { label: "M", description: "Standard Fit" },
    { label: "L", description: "Wide Fit" }
];

export function VariationSelector() {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedSize, setSelectedSize] = useState(SIZES[1]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Color Selector */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Finish: <span className="text-slate-900">{selectedColor.name}</span></span>
                </div>
                <div className="flex items-center gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            className={`relative w-8 h-8 rounded-full transition-all duration-300 ${
                                selectedColor.name === color.name ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                        >
                            {selectedColor.name === color.name && (
                                <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-md" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Select Size</span>
                    <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline italic">Size Guide</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {SIZES.map((size) => (
                        <button
                            key={size.label}
                            onClick={() => setSelectedSize(size)}
                            className={`p-3 rounded-xl border-2 transition-all text-center group ${
                                selectedSize.label === size.label 
                                ? 'border-primary bg-primary/5' 
                                : 'border-slate-100 hover:border-slate-200'
                            }`}
                        >
                            <span className={`block text-sm font-black italic tracking-tighter ${selectedSize.label === size.label ? 'text-primary' : 'text-slate-900'}`}>
                                {size.label}
                            </span>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {size.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
