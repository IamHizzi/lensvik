"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, Info, ShieldCheck, Eye, Monitor, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Image from "next/image";

interface LensConfiguratorProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        _id: string;
        name: string;
        price: number;
        image: string;
    };
}

const MAIN_CATEGORIES = [
    {
        id: "power",
        title: "With Power",
        subtitle: "Positive, Negative or Cylindrical",
        tag: "Most common",
        image: "/images/eyeglasses.png",
        icon: <Eye className="w-5 h-5 text-primary" />,
    },
    {
        id: "zero",
        title: "Zero Power",
        subtitle: "Blue light block for screen protection",
        tag: "BLU Screen lenses",
        image: "/images/digital glasses.png",
        icon: <Monitor className="w-5 h-5 text-primary" />,
    },
    {
        id: "progressive",
        title: "Progressive/Bifocals",
        subtitle: "Two powers in one eye",
        image: "/images/v.png",
        icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    },
    {
        id: "frame",
        title: "Frame Only",
        subtitle: "With no lenses",
        image: null,
        icon: <X className="w-5 h-5 text-slate-400" />,
    }
];

const LENS_OPTIONS: Record<string, any[]> = {
    power: [
        { name: "Standard Lens", price: 500, description: "Scratch resistant, Basic use", image: "/images/clear.png", features: ["Scratch resistant", "Basic use"] },
        { name: "Antiglare", price: 1200, description: "UV 400, Double side coating", image: "/images/front-banner.jpeg", features: ["Scratch resistant", "UV 400", "Double side coating", "Antiglare lens"], recommended: true },
        { name: "Lensvik Blu Screen", price: 1500, description: "Screen protection, Minimize eyestrain", image: "/images/digital glasses.png", features: ["Screen protection", "Minimize eyestrain", "Scratch resistant"] },
        { name: "Lensvik Blu Pro", price: 2200, description: "Advanced screen protection", image: "/images/hero_intelligent_screen_1769588125097.png", features: ["Advanced screen protection", "Scratch & smudge resistant", "Hydrophilic coated"] },
        { name: "Smart Lens (Transition + Blu)", price: 2800, description: "Sun protection (Grey), Advanced screen protection", image: "/images/smart glasses.jpeg", features: ["Scratch resistant", "Sun protection (Grey)"] },
    ],
    zero: [
        { name: "BLU Screen Lenses (Green)", price: 1450, description: "Screen protection, Minimize eyestrain", image: "/images/digital glasses.png", features: ["Screen protection", "Minimize eyestrain", "Scratch resistant", "Green coating"] },
        { name: "BLU Screen Lenses (Blue)", price: 1950, description: "Blue coating (same as SC-1)", image: "/images/hero_intelligent_screen_1769588125097.png", features: ["Blue coating", "Screen protection", "Scratch resistant"], recommended: true },
        { name: "Twin Coating (Blue + Green)", price: 2950, description: "Silk coating, Hydrophobic coating", image: "/images/dfd.png", features: ["Silk coating", "Hydrophobic coating", "Minimize fog", "Scratch resistant"] },
        { name: "Transition", price: 2650, description: "Sun protection, sunlight adjustment", image: "/images/transition glasses.png", features: ["Sun protection", "Sunlight adjustment", "Scratch resistant"] },
    ],
    progressive: [
        { name: "Bifocal-D", price: 3200, description: "Concentrated reading zone", image: "/images/v.png", features: ["Reading zone", "Dual vision correction", "Smooth daily use"] },
        { name: "Antiglare Bifocal (Anti+)", price: 4500, description: "Antiglare coating, Anti-reflection", image: "/images/clear.png", features: ["Antiglare coating", "Anti-reflection", "Double side coating"], recommended: true },
        { name: "Progressive (SC)", price: 3800, description: "Multi-distance vision", image: "/images/v.png", features: ["Multi-distance vision", "Wide field of vision", "Perfect for outdoor"] },
    ]
};

export function LensConfigurator({ isOpen, onClose, product }: LensConfiguratorProps) {
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLens, setSelectedLens] = useState<any | null>(null);
    const [prescription, setPrescription] = useState({
        od_sph: "", od_cyl: "", od_axis: "", od_add: "",
        os_sph: "", os_cyl: "", os_axis: "", os_add: "",
        pd: ""
    });

    const { addToCart } = useCart();

    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleCategoryClick = (id: string) => {
        if (id === "frame") {
            addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image
            });
            toast.success("Frame added to cart!");
            onClose();
            return;
        }
        setSelectedCategory(id);
        setStep(2);
    };

    const handleLensSelect = (lens: any) => {
        setSelectedLens(lens);
        setStep(3);
    };

    const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrescription({ ...prescription, [e.target.name]: e.target.value });
    };

    const handleAddToCart = () => {
        const totalItemPrice = product.price + (selectedLens?.price || 0);
        addToCart({
            productId: product._id,
            name: `${product.name} + ${selectedLens?.name}`,
            price: totalItemPrice,
            image: product.image,
            prescription: {
                measurements: { ...prescription },
                lensCategory: { name: selectedCategory || "", price: 0 },
                lensType: { name: selectedLens?.name || "", price: selectedLens?.price || 0 }
            }
        });
        toast.success("Added to cart with prescription!");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Configurator Slider */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                className="relative w-full max-w-xl bg-white h-full flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.1)]"
            >
                {/* Header */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex flex-col">
                    <div className="px-6 md:px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {step > 1 && (
                                <button 
                                    onClick={handleBack}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                                </button>
                            )}
                            <div>
                                <h2 className="uppercase tracking-tighter leading-none text-slate-900">
                                    {step === 1 && "Choose Category"}
                                    {step === 2 && "The Vision"}
                                    {step === 3 && "Lens Prescription"}
                                    {step === 4 && "Order Review"}
                                </h2>
                                <p className="label-tag text-primary mt-1">
                                    Step {step} <span className="text-slate-200 mx-1">/</span> 4
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-all group shadow-sm"
                        >
                            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                        </button>
                    </div>
                    {/* Progress indicator */}
                    <div className="h-1 w-full bg-slate-50">
                        <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 space-y-6 pb-40">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="grid grid-cols-1 gap-5"
                            >
                                {MAIN_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className="relative group p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-primary/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all flex items-center gap-6 text-left"
                                    >
                                        <div className="relative w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                                            {cat.image ? (
                                                <Image src={cat.image} alt={cat.title} fill className="object-contain p-2" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                    <Eye className="w-8 h-8 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-slate-900 uppercase tracking-tighter">{cat.title}</h3>
                                                {cat.tag && (
                                                    <Badge className="bg-primary/10 text-primary border-none label-tag px-2">
                                                        {cat.tag}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-small font-bold text-slate-400 uppercase leading-tight">{cat.subtitle}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-5"
                            >
                                {selectedCategory && LENS_OPTIONS[selectedCategory].map((lens, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleLensSelect(lens)}
                                        className={`w-full text-left p-6 md:p-8 rounded-[2.5rem] border-2 transition-all relative group overflow-hidden ${
                                            lens.recommended ? 'border-primary/20 bg-primary/[0.02] shadow-[0_20px_40px_rgba(178,34,52,0.05)]' : 'border-slate-50 hover:bg-slate-50/50 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="relative w-24 h-24 bg-white rounded-3xl border border-slate-100 p-2 shadow-sm shrink-0 overflow-hidden transform group-hover:rotate-3 transition-transform">
                                                <Image src={lens.image} alt={lens.name} fill className="object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                {lens.recommended && (
                                                    <div className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">
                                                        <Star className="w-3 h-3 fill-primary" /> Most Popular choice
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase italic leading-none">{lens.name}</h3>
                                                    <span className="text-sm md:text-lg font-black italic font-sans text-primary">Rs {lens.price}</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 mb-4">{lens.description}</p>
                                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                    {lens.features.slice(0, 3).map((feat: string, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase italic">
                                                            <Check className="w-3 h-3 text-green-500" />
                                                            {feat}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-10"
                            >
                                <div className="glass-card bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-10">
                                    {/* Right Eye */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                            <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900">Right Eye (OD)</h3>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {["sph", "cyl", "axis", "add"].map((field) => (
                                                <div key={field} className="space-y-2 text-center">
                                                    <label className="label-tag text-slate-400 italic">{field}</label>
                                                    <input
                                                        type="text"
                                                        name={`od_${field}`}
                                                        value={(prescription as any)[`od_${field}`]}
                                                        onChange={handlePrescriptionChange}
                                                        placeholder="0.00"
                                                        className="w-full h-12 text-center bg-white border-2 border-slate-100 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-sans font-bold outline-none transition-all text-small"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Left Eye */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-primary/40" />
                                            <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900">Left Eye (OS)</h3>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {["sph", "cyl", "axis", "add"].map((field) => (
                                                <div key={field} className="space-y-2 text-center">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{field}</label>
                                                    <input
                                                        type="text"
                                                        name={`os_${field}`}
                                                        value={(prescription as any)[`os_${field}`]}
                                                        onChange={handlePrescriptionChange}
                                                        placeholder="0.00"
                                                        className="w-full h-12 text-center bg-white border-2 border-slate-100 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-sans font-bold outline-none transition-all"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PD */}
                                    <div className="pt-6 border-t border-slate-200">
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex-1 space-y-1">
                                                <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900">Pupillary Distance (PD)</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase italic">The distance between your pupils in mm</p>
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="text"
                                                    name="pd"
                                                    value={prescription.pd}
                                                    onChange={handlePrescriptionChange}
                                                    placeholder="64"
                                                    className="w-full h-12 text-center bg-white border-2 border-slate-100 rounded-xl focus:border-primary/50 focus:ring-4 focus:ring-primary/5 font-sans font-bold outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                        <Info className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-[11px] font-bold text-primary/70 uppercase italic leading-relaxed">
                                        Our doctors manually verify every prescription before production to ensure mathematical precision and optical comfort.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <div className="p-8 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20" />
                                        
                                        <div className="flex items-center gap-6 mb-8 relative z-10">
                                            <div className="relative w-24 h-16 bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center justify-center">
                                                <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">{product.name}</h3>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Premium Frame</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 relative z-10">
                                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest italic opacity-60">
                                                <span>{selectedLens?.name}</span>
                                                <span className="font-sans">Rs {selectedLens?.price}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest italic opacity-60">
                                                <span>Frame</span>
                                                <span className="font-sans">Rs {product.price}</span>
                                            </div>
                                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                                <span className="text-xs font-black uppercase italic tracking-[0.2em] text-primary">Final Total</span>
                                                <span className="text-4xl font-black italic font-sans tracking-tight">Rs {product.price + selectedLens?.price}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="text-[10px] font-black uppercase text-primary mb-3 italic tracking-widest">Right Eye (OD)</h4>
                                            <div className="grid grid-cols-2 gap-2 text-[11px] font-black italic text-slate-600 uppercase">
                                                <span>SPL {prescription.od_sph || "0.00"}</span>
                                                <span>CYL {prescription.od_cyl || "0.00"}</span>
                                                <span>AX {prescription.od_axis || "0"}</span>
                                                <span>AD {prescription.od_add || "0"}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 italic tracking-widest">Left Eye (OS)</h4>
                                            <div className="grid grid-cols-2 gap-2 text-[11px] font-black italic text-slate-600 uppercase">
                                                <span>SPL {prescription.os_sph || "0.00"}</span>
                                                <span>CYL {prescription.os_cyl || "0.00"}</span>
                                                <span>AX {prescription.os_axis || "0"}</span>
                                                <span>AD {prescription.os_add || "0"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sticky Footer */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex gap-4 z-30">
                    {step === 4 ? (
                        <Button 
                            onClick={handleAddToCart}
                            size="lg"
                            className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white btn-text text-lg shadow-2xl transition-all shadow-primary/20"
                        >
                            Confirm & Add Rs {product.price + (selectedLens?.price || 0)}
                        </Button>
                    ) : step === 3 ? (
                        <Button 
                            onClick={() => setStep(4)}
                            size="lg"
                            className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black italic uppercase tracking-[0.2em] text-lg shadow-2xl transition-all"
                        >
                            Next Step <ChevronRight className="w-6 h-6 ml-2" />
                        </Button>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
}
