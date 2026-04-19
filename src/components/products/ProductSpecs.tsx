"use client";

import React, { useState } from "react";
import { Ruler, ShieldCheck, Heart, Star, Package, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductSpecsProps {
    measurements?: {
        lensWidth: number;
        bridgeWidth: number;
        templeLength: number;
    };
    description?: string;
}

export function ProductSpecs({ measurements, description }: ProductSpecsProps) {
    const [activeTab, setActiveTab] = useState("details");

    const tabs = [
        { id: "details", label: "The Vision" },
        { id: "specs", label: "Technical Specs" },
        { id: "reviews", label: "Client Voice" },
    ];

    return (
        <div className="mt-12 md:mt-20">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 md:gap-8 mb-8 md:mb-12 border-b border-slate-100 italic font-black uppercase tracking-tighter">
                <button 
                    onClick={() => setActiveTab("details")}
                    className={`pb-4 text-sm md:text-lg transition-all relative ${activeTab === "details" ? "text-primary" : "text-slate-400 hover:text-slate-600"}`}
                >
                    The Vision
                    {activeTab === "details" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
                </button>
                <button 
                    onClick={() => setActiveTab("specs")}
                    className={`pb-4 text-sm md:text-lg transition-all relative ${activeTab === "specs" ? "text-primary" : "text-slate-400 hover:text-slate-600"}`}
                >
                    Technical Specs
                    {activeTab === "specs" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
                </button>
                <button 
                    onClick={() => setActiveTab("how-it-works")}
                    className={`pb-4 text-sm md:text-lg transition-all relative ${activeTab === "how-it-works" ? "text-primary" : "text-slate-400 hover:text-slate-600"}`}
                >
                    How It Works
                    {activeTab === "how-it-works" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
                </button>
                <button 
                    onClick={() => setActiveTab("faq")}
                    className={`pb-4 text-sm md:text-lg transition-all relative ${activeTab === "faq" ? "text-primary" : "text-slate-400 hover:text-slate-600"}`}
                >
                    FAQ
                    {activeTab === "faq" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
                </button>
                <button 
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-4 text-sm md:text-lg transition-all relative ${activeTab === "reviews" ? "text-primary" : "text-slate-400 hover:text-slate-600"}`}
                >
                    Client Voice
                    {activeTab === "reviews" && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-primary" />}
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[250px]">
                <AnimatePresence mode="wait">
                    {activeTab === "details" && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center"
                        >
                            <div className="lg:col-span-3 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] italic">The Architectural Intent</h3>
                                    <p className="text-xl md:text-4xl text-slate-800 font-black tracking-tighter leading-[1.1] italic uppercase">
                                        {description || "A fusion of tectonic geometry and optical precision. hand-assembled using surgical-grade titanium."}
                                    </p>
                                </div>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed italic max-w-2xl">
                                    Experience the future of eyewear with a frame that feels as light as air while maintaining structural integrity for decades. Every angle is calculated for optimal weight distribution.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-primary/20 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black uppercase tracking-widest italic text-primary mb-1">Lifetime Care</span>
                                            <span className="block text-xs font-black uppercase tracking-tighter italic">2-Year Structural Warranty</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-primary/20 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                                            <Package className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-black uppercase tracking-widest italic text-primary mb-1">Sustainable</span>
                                            <span className="block text-xs font-black uppercase tracking-tighter italic">Eco-Consious Recyclable Case</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 relative aspect-square lg:aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 to-transparent z-10" />
                                <img 
                                    src="/images/front-banner.jpeg" 
                                    alt="Craftsmanship" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute bottom-8 left-8 z-20">
                                    <span className="px-5 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-xl">Artisan Craftsmanship</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "specs" && (
                        <motion.div
                            key="specs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-slate-50 rounded-[3rem] p-8 md:p-12 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black uppercase italic tracking-widest text-primary">Frame Metrics</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-[10px] font-black uppercase text-slate-400">Temple Length</span>
                                            <span className="text-xs font-bold italic font-sans">{measurements?.templeLength || 145}mm</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Heart className="w-5 h-5 text-primary" />
                                        <h4 className="text-xs font-black uppercase italic tracking-widest">Material & Build</h4>
                                    </div>
                                    <div className="space-y-4 text-[11px] font-semibold text-slate-600 leading-relaxed italic">
                                        <p>• Hand-carved Surgical Acetate</p>
                                        <p>• 7-Barrel Steel Hinges</p>
                                        <p>• Integrated Wire Core</p>
                                        <p>• Hypoallergenic Nose Pads</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-primary" />
                                        <h4 className="text-xs font-black uppercase italic tracking-widest">Returns & Care</h4>
                                    </div>
                                    <p className="text-[11px] font-semibold text-slate-400 leading-relaxed italic">
                                        Complimentary professional cleaning kit included. Clean only with provided microfiber cloth. 14-day hassle-free returns for unused frames.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "reviews" && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-4xl font-black italic tracking-tight">4.9</h3>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Based on 48 verified purchases</p>
                                </div>
                                <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black italic uppercase tracking-widest text-xs hover:bg-black transition-all">Write A Review</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-slate-300 italic">2 weeks ago</span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700 italic leading-relaxed mb-6 italic">&quot;The frame quality is far superior to anything I&apos;ve owned before. Extremely lightweight and fits like a dream.&quot;</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100" />
                                            <span className="text-[11px] font-black uppercase tracking-tighter italic">Sarah Ahmed <span className="text-primary italic">Verified</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
