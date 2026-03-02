"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, Monitor, BookOpen, Glasses, HelpCircle, ShieldCheck, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PrescriptionFormProps {
    productName: string;
    productPrice: number;
    productImage: string;
    onConfirm: (prescriptionData: any) => void;
    isStandalone?: boolean;
    onBack?: () => void;
}

const visionUsages = [
    { id: "distance", label: "Distance Vision", desc: "Driving, TV, seeing far", icon: Eye, recommend: "single-vision" },
    { id: "reading", label: "Reading / Close", desc: "Books, phone, near tasks", icon: BookOpen, recommend: "single-vision" },
    { id: "both", label: "Near & Far", desc: "Clarity at all distances", icon: Glasses, recommend: "progressive" },
    { id: "screen", label: "Screen / Digital", desc: "Computer & desk work", icon: Monitor, recommend: "single-vision" },
];

const lensCategories = [
    { id: "single-vision", name: "Single Vision", desc: "One focal point — near or far. Best for most prescriptions.", price: 0, tag: "Most Popular" },
    { id: "bifocal", name: "Bifocal", desc: "Two vision zones with a visible line for near and far.", price: 1500, tag: "Classic" },
    { id: "progressive", name: "Progressive", desc: "Seamless all-distance vision. No visible line. Premium digital freeform.", price: 2500, tag: "Premium" },
];

const lensTypes = [
    { id: "clear", name: "Standard Clear", desc: "Anti-reflective & scratch-resistant coating.", price: 500, color: "#E8F4FD", features: ["Anti-Reflective", "Scratch Resistant", "UV Protection"] },
    { id: "blue-cut", name: "Blue Light Filter", desc: "Blocks blue light to reduce digital eye strain.", price: 1200, color: "#E8EAFF", features: ["Blue Light Block", "Anti-Fatigue", "Screen Optimized"] },
    { id: "photochromic", name: "Photochromic", desc: "Auto-darkens outdoors, stays clear indoors.", price: 1800, color: "#F0ECE5", features: ["Auto-Darkening", "100% UV Block", "Indoor/Outdoor"] },
];

export function PrescriptionForm({ productName, productPrice, productImage, onConfirm, isStandalone = false, onBack }: PrescriptionFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [visionUsage, setVisionUsage] = useState<string | null>(null);
    const [measurements, setMeasurements] = useState({
        od_sph: "", od_cyl: "", od_axis: "",
        os_sph: "", os_cyl: "", os_axis: "",
        pd: ""
    });
    const [lensCategory, setLensCategory] = useState<string | null>(null);
    const [lensType, setLensType] = useState<string | null>(null);
    const [showHelp, setShowHelp] = useState(false);

    const steps = [
        { id: 1, label: "Prescription" },
        { id: 2, label: "Category" },
        { id: 3, label: "Type" },
        { id: 4, label: "Review" }
    ];

    const handleNext = () => {
        if (step === 1 && visionUsage && !lensCategory) {
            const usage = visionUsages.find(v => v.id === visionUsage);
            if (usage) setLensCategory(usage.recommend);
        }
        setStep(s => Math.min(s + 1, 4));
    };
    const handlePrev = () => {
        if (step === 1 && onBack) {
            onBack();
        } else {
            setStep(s => Math.max(s - 1, 1));
        }
    };

    const handleConfirm = () => {
        onConfirm({
            measurements, visionUsage,
            lensCategory: lensCategories.find(c => c.id === lensCategory),
            lensType: lensTypes.find(t => t.id === lensType)
        });
        if (!isStandalone) {
            router.push("/cart");
        }
    };

    const totalPrice = productPrice +
        (lensCategories.find(c => c.id === lensCategory)?.price || 0) +
        (lensTypes.find(t => t.id === lensType)?.price || 0);

    const canProceed = () => {
        if (step === 1) return !!visionUsage;
        if (step === 2) return !!lensCategory;
        if (step === 3) return !!lensType;
        return true;
    };

    return (
        <div className={`flex flex-col bg-white ${isStandalone ? 'min-h-[500px] shadow-2xl rounded-2xl border border-slate-100 overflow-hidden mt-4 md:mt-8' : ''}`}>
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-slate-100 border border-slate-200 relative overflow-hidden shrink-0 shadow-inner">
                        <Image src={productImage} alt={productName} fill className="object-contain p-2" />
                    </div>
                    <div>
                        <h2 className="text-[12px] md:text-lg font-black text-slate-900 leading-tight line-clamp-1 italic uppercase tracking-tighter">{productName}</h2>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Lens Configuration</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Est. Total</p>
                    <p className="text-[12px] md:text-xl font-black text-primary leading-tight italic">Rs {totalPrice.toLocaleString()}</p>
                </div>
            </div>

            {/* ── Stepper ── */}
            <div className="flex items-center gap-1 px-4 md:px-6 py-2 md:py-3 bg-slate-50/50 border-b border-slate-100 overflow-x-auto no-scrollbar">
                {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <button
                            onClick={() => step > s.id && setStep(s.id)}
                            className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-black transition-all shrink-0 uppercase tracking-widest italic ${step === s.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' :
                                step > s.id ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer' :
                                    'text-slate-400'
                                }`}
                        >
                            {step > s.id ? <Check className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <span>{s.id}</span>}
                            <span className={step === s.id ? "block" : "hidden sm:block"}>{s.label}</span>
                        </button>
                        {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 mx-1 shrink-0" />}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {/* ═══ Step 1: Prescription ═══ */}
                    {step === 1 && (
                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }} className="p-4 md:p-8"
                        >
                            <p className="text-xs md:text-base font-black text-slate-800 mb-3 md:mb-5 italic uppercase tracking-tight">What do you need glasses for?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
                                {visionUsages.map(v => {
                                    const Icon = v.icon;
                                    const sel = visionUsage === v.id;
                                    return (
                                        <button key={v.id} onClick={() => setVisionUsage(v.id)}
                                            className={`flex items-center md:flex-col gap-3 md:gap-2.5 p-3 md:p-4 rounded-xl border-2 transition-all text-left md:text-center ${sel ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.02]' : 'border-slate-100 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${sel ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                            </div>
                                            <div className="flex flex-col md:items-center">
                                                <span className={`text-xs md:text-sm font-black italic uppercase tracking-tight ${sel ? 'text-primary' : 'text-slate-800'}`}>{v.label}</span>
                                                <span className="text-[10px] md:text-[11px] text-slate-400 font-medium md:mt-1">{v.desc}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between mb-4 md:mb-6 border-t border-slate-50 pt-6 md:pt-10">
                                <p className="text-xs md:text-base font-black text-slate-800 italic uppercase tracking-tight">Prescription Values</p>
                                <button onClick={() => setShowHelp(!showHelp)} className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline italic">
                                    <HelpCircle className="w-3.5 h-3.5" /> Where to find?
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                {/* Right Eye */}
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-blue-200">R</div>
                                        <span className="text-xs md:text-sm font-black text-slate-600 uppercase tracking-widest italic">Right Eye (OD)</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[{ l: "SPH", k: "od_sph" }, { l: "CYL", k: "od_cyl" }, { l: "AXIS", k: "od_axis" }].map(f => (
                                            <div key={f.k}>
                                                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{f.l}</label>
                                                <input type="text" placeholder="0.00"
                                                    className="w-full h-9 md:h-10 rounded-lg bg-slate-50 border-2 border-slate-100 px-2 text-[11px] md:text-xs font-bold text-center focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                                    value={(measurements as any)[f.k]}
                                                    onChange={e => setMeasurements({ ...measurements, [f.k]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Left Eye */}
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg shadow-emerald-200">L</div>
                                        <span className="text-xs md:text-sm font-black text-slate-600 uppercase tracking-widest italic">Left Eye (OS)</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[{ l: "SPH", k: "os_sph" }, { l: "CYL", k: "os_cyl" }, { l: "AXIS", k: "os_axis" }].map(f => (
                                            <div key={f.k}>
                                                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 md:mb-2">{f.l}</label>
                                                <input type="text" placeholder="0.00"
                                                    className="w-full h-9 md:h-10 rounded-lg bg-slate-50 border-2 border-slate-100 px-2 text-[11px] md:text-xs font-bold text-center focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                                    value={(measurements as any)[f.k]}
                                                    onChange={e => setMeasurements({ ...measurements, [f.k]: e.target.value })}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <label className="text-xs md:text-sm font-black text-slate-500 uppercase tracking-widest italic">Pupillary Distance (PD)</label>
                                    <div className="relative group">
                                        <input type="text" placeholder="63"
                                            className="w-16 md:w-20 h-9 md:h-10 rounded-lg bg-slate-50 border-2 border-slate-100 px-2 text-[11px] md:text-xs font-bold text-center focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            value={measurements.pd}
                                            onChange={e => setMeasurements({ ...measurements, pd: e.target.value })}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-bold uppercase">mm</span>
                                    </div>
                                </div>
                                <p className="hidden md:block text-[11px] text-slate-400 font-medium max-w-xs text-right italic">SPH corrects near/farsightedness · CYL corrects astigmatism · PD is typically 58–68mm.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Step 2: Lens Category ═══ */}
                    {step === 2 && (
                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }} className="p-4 md:p-8"
                        >
                            <p className="text-xs md:text-base font-black text-slate-800 mb-1.5 italic uppercase tracking-tight">Choose Lens Category</p>
                            <p className="text-[11px] md:text-xs text-slate-400 mb-6 md:mb-8 font-bold uppercase tracking-widest">Based on your vision usage, we&apos;ve highlighted a recommendation.</p>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 max-w-2xl mx-auto">
                                {lensCategories.map(cat => {
                                    const sel = lensCategory === cat.id;
                                    const rec = visionUsages.find(v => v.id === visionUsage)?.recommend === cat.id;
                                    return (
                                        <button key={cat.id} onClick={() => setLensCategory(cat.id)}
                                            className={`w-full flex items-start sm:items-center gap-3 md:gap-5 p-4 md:p-5 rounded-xl border-2 text-left transition-all ${sel ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.01]' : 'border-slate-100 hover:border-slate-200 shadow-sm'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${sel ? 'bg-primary text-white' : 'bg-slate-100 text-slate-300'}`}>
                                                {sel ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-slate-200" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-sm md:text-base font-black italic uppercase tracking-tight ${sel ? 'text-primary' : 'text-slate-800'}`}>{cat.name}</span>
                                                        {rec && <span className="text-[9px] md:text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg uppercase tracking-widest italic shadow-sm shadow-emerald-100">Recommended</span>}
                                                    </div>
                                                    <p className={`text-sm md:text-base font-black italic leading-none ${sel ? 'text-primary' : 'text-slate-700'}`}>
                                                        {cat.price === 0 ? "Included" : `+ Rs ${cat.price.toLocaleString()}`}
                                                    </p>
                                                </div>
                                                <p className="text-xs md:text-[13px] text-slate-500 font-medium leading-relaxed mb-1">{cat.desc}</p>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat.tag}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Step 3: Lens Type ═══ */}
                    {step === 3 && (
                        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }} className="p-4 md:p-8"
                        >
                            <p className="text-xs md:text-base font-black text-slate-800 mb-1.5 italic uppercase tracking-tight">Lens Coatings & Filters</p>
                            <p className="text-[11px] md:text-xs text-slate-400 mb-6 md:mb-8 font-bold uppercase tracking-widest">Select premium coating for your {lensCategories.find(c => c.id === lensCategory)?.name} lenses.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {lensTypes.map(type => {
                                    const sel = lensType === type.id;
                                    return (
                                        <button key={type.id} onClick={() => setLensType(type.id)}
                                            className={`relative flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl border-2 transition-all ${sel ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]' : 'border-slate-100 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center border-2 border-slate-50 shadow-inner overflow-hidden" style={{ backgroundColor: type.color }}>
                                                {sel && <Check className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                                            </div>

                                            <div className="text-center">
                                                <p className={`text-sm md:text-base font-black italic uppercase tracking-tight mb-0.5 ${sel ? 'text-primary' : 'text-slate-800'}`}>{type.name}</p>
                                                <p className={`text-xs md:text-sm font-black italic mb-2 ${sel ? 'text-primary' : 'text-slate-500'}`}>+ Rs {type.price.toLocaleString()}</p>
                                                <p className="text-[11px] md:text-[12px] text-slate-400 font-medium leading-relaxed mb-4">{type.desc}</p>
                                                <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                                                    {type.features.map(f => (
                                                        <span key={f} className={`text-[9px] md:text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-widest italic ${sel ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>{f}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {sel && (
                                                <div className="absolute top-4 right-4 text-primary">
                                                    <Check className="w-5 h-5 md:w-6 md:h-6" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ═══ Step 4: Review ═══ */}
                    {step === 4 && (
                        <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }} className="p-4 md:p-8"
                        >
                            <p className="text-xs md:text-base font-black text-slate-800 mb-5 md:mb-8 italic uppercase tracking-tight text-center">Review Your Configuration</p>

                            <div className="max-w-xl mx-auto space-y-3">
                                {[
                                    { label: "Selected Frame", value: productName, price: productPrice, editStep: null },
                                    { label: "Vision Usage", value: visionUsages.find(v => v.id === visionUsage)?.label, price: null, editStep: 1 },
                                    { label: "Lens Category", value: lensCategories.find(c => c.id === lensCategory)?.name, price: lensCategories.find(c => c.id === lensCategory)?.price, editStep: 2 },
                                    { label: "Lens Coating", value: lensTypes.find(t => t.id === lensType)?.name, price: lensTypes.find(t => t.id === lensType)?.price, editStep: 3 },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex-1">
                                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-0.5">{row.label}</p>
                                            <p className="text-xs md:text-sm font-black text-slate-800 italic uppercase tracking-tighter">{row.value}</p>
                                        </div>
                                        <div className="flex items-center gap-3 md:gap-5">
                                            {row.price != null && (
                                                <span className="text-xs md:text-sm font-black text-slate-700 italic">
                                                    {row.price === 0 ? "Included" : `Rs ${row.price.toLocaleString()}`}
                                                </span>
                                            )}
                                            {row.editStep && (
                                                <button onClick={() => setStep(row.editStep!)} className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest hover:underline italic">Edit</button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Prescription summary */}
                                {(measurements.od_sph || measurements.os_sph) && (
                                    <div className="p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Prescription</p>
                                            <button onClick={() => setStep(1)} className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest hover:underline italic">Edit</button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">Right (OD)</span>
                                                <span className="text-xs md:text-sm font-bold text-slate-800">{measurements.od_sph || "0.00"}/{measurements.od_cyl || "0.00"}×{measurements.od_axis || "0"}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">Left (OS)</span>
                                                <span className="text-xs md:text-sm font-bold text-slate-800">{measurements.os_sph || "0.00"}/{measurements.os_cyl || "0.00"}×{measurements.os_axis || "0"}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">PD</span>
                                                <span className="text-xs md:text-sm font-bold text-slate-800">{measurements.pd}mm</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 md:mt-8 bg-slate-900 rounded-xl md:rounded-2xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-500" />
                                    <div className="relative flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] md:text-[12px] text-slate-400 font-bold uppercase tracking-widest italic mb-1">Total (Frame + Lenses)</p>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                                                <p className="text-[9px] md:text-[11px] text-slate-500 font-medium">Free shipping & 30-day lens warranty</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl md:text-3xl font-black italic tracking-tighter">Rs {totalPrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 border-t border-slate-100 ${isStandalone ? 'bg-slate-50/50' : 'bg-white'}`}>
                <Button variant="outline" onClick={handlePrev} className="h-10 md:h-12 px-6 rounded-xl font-black uppercase tracking-widest italic text-[10px] md:text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {step === 1 ? "Cancel" : "Back"}
                </Button>
                <div className="flex-1" />
                {step < 4 ? (
                    <Button onClick={handleNext} disabled={!canProceed()}
                        className="h-10 md:h-12 px-8 rounded-xl font-black uppercase tracking-widest italic text-[10px] md:text-xs bg-primary hover:bg-primary/90 disabled:opacity-40 shadow-xl shadow-primary/10"
                    >
                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleConfirm}
                        className="h-10 md:h-12 px-8 rounded-xl font-black uppercase tracking-widest italic text-[10px] md:text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-200"
                    >
                        Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PrescriptionConfiguratorProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productPrice: number;
    productImage: string;
    onConfirm: (prescriptionData: any) => void;
}

export function PrescriptionConfigurator({ isOpen, onClose, productName, productPrice, productImage, onConfirm }: PrescriptionConfiguratorProps) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[700px] md:max-w-[850px] p-0 gap-0 rounded-2xl border-none overflow-hidden bg-transparent shadow-none">
                <PrescriptionForm
                    productName={productName}
                    productPrice={productPrice}
                    productImage={productImage}
                    onConfirm={onConfirm}
                    onBack={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
