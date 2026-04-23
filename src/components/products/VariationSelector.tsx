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

export function VariationSelector() {
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

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
        </div>
    );
}
