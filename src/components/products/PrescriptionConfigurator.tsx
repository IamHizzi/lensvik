"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Eye, Monitor, BookOpen, Glasses, HelpCircle, ShieldCheck, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PrescriptionConfiguratorProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productPrice: number;
    productImage: string;
    onConfirm: (prescriptionData: any) => void;
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

export function PrescriptionConfigurator({ isOpen, onClose, productName, productPrice, productImage, onConfirm }: PrescriptionConfiguratorProps) {
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
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const reset = () => {
        setStep(1);
        setVisionUsage(null);
        setMeasurements({ od_sph: "", od_cyl: "", od_axis: "", os_sph: "", os_cyl: "", os_axis: "", pd: "" });
        setLensCategory(null);
        setLensType(null);
    };

    const handleConfirm = () => {
        onConfirm({
            measurements, visionUsage,
            lensCategory: lensCategories.find(c => c.id === lensCategory),
            lensType: lensTypes.find(t => t.id === lensType)
        });
        onClose();
        reset();
        router.push("/checkout");
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
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); reset(); } }}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] md:max-w-[680px] p-0 gap-0 rounded-2xl border-slate-200/80 overflow-hidden">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:xl bg-slate-100 border border-slate-200 relative overflow-hidden shrink-0">
                            <Image src={productImage} alt={productName} fill className="object-contain p-1" />
                        </div>
                        <div>
                            <DialogHeader className="p-0 space-y-0">
                                <DialogTitle className="text-[13px] md:text-[15px] font-semibold text-slate-900 leading-tight line-clamp-1">{productName}</DialogTitle>
                            </DialogHeader>
                            <p className="text-[10px] md:text-[12px] text-slate-400 font-medium">Lens Configuration</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">Est. Total</p>
                        <p className="text-[13px] md:text-[15px] font-bold text-slate-900 leading-tight">Rs {totalPrice.toLocaleString()}</p>
                    </div>
                </div>

                {/* ── Stepper ── */}
                <div className="flex items-center gap-0.5 px-3 md:px-6 py-2 md:py-3 bg-slate-50/80 border-b border-slate-100 overflow-x-auto no-scrollbar">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <button
                                onClick={() => step > s.id && setStep(s.id)}
                                className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-1 rounded-lg text-[10px] md:text-[11px] font-semibold transition-all shrink-0 ${step === s.id ? 'bg-primary text-white shadow-sm' :
                                    step > s.id ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer' :
                                        'text-slate-400'
                                    }`}
                            >
                                {step > s.id ? <Check className="w-2.5 h-2.5" /> : <span>{s.id}</span>}
                                <span className={step === s.id ? "block" : "hidden sm:block"}>{s.label}</span>
                            </button>
                            {i < steps.length - 1 && <ChevronRight className="w-2.5 h-2.5 text-slate-300 mx-0.5 shrink-0" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* ── Content ── */}
                <div className="flex flex-col">
                    <AnimatePresence mode="wait">

                        {/* ═══ Step 1: Prescription ═══ */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }} className="flex-1 p-6 overflow-hidden"
                            >
                                {/* Vision Usage */}
                                <p className="text-xs md:text-[13px] font-semibold text-slate-800 mb-2 md:mb-3">What do you need glasses for?</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 md:mb-5">
                                    {visionUsages.map(v => {
                                        const Icon = v.icon;
                                        const sel = visionUsage === v.id;
                                        return (
                                            <button key={v.id} onClick={() => setVisionUsage(v.id)}
                                                className={`flex items-center md:flex-col gap-3 md:gap-1.5 p-2.5 md:p-3 rounded-xl border transition-all text-left md:text-center ${sel ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${sel ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'}`}>
                                                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </div>
                                                <span className={`text-[10px] md:text-[10px] font-semibold leading-tight ${sel ? 'text-primary' : 'text-slate-600'}`}>{v.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Prescription */}
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-[13px] font-semibold text-slate-800">Prescription Values</p>
                                    <button onClick={() => setShowHelp(!showHelp)} className="text-[11px] text-primary font-medium flex items-center gap-1 hover:underline">
                                        <HelpCircle className="w-3 h-3" /> Where to find?
                                    </button>
                                </div>

                                {showHelp && (
                                    <div className="mb-3 p-3 bg-blue-50 rounded-lg text-[11px] text-blue-700 leading-relaxed">
                                        <strong>SPH</strong> corrects near/farsightedness · <strong>CYL</strong> corrects astigmatism · <strong>AXIS</strong> is 1–180° · <strong>PD</strong> is typically 58–68mm.
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    {/* Right Eye */}
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1.5 md:mb-2">
                                            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center">R</span>
                                            <span className="text-[10px] md:text-[11px] font-semibold text-slate-600">Right Eye (OD)</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                                            {[{ l: "SPH", k: "od_sph" }, { l: "CYL", k: "od_cyl" }, { l: "AXIS", k: "od_axis" }].map(f => (
                                                <div key={f.k}>
                                                    <label className="text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase block mb-1">{f.l}</label>
                                                    <input type="text" placeholder="0.00"
                                                        className="w-full h-8 md:h-9 rounded-lg bg-slate-50 border border-slate-200 px-1 md:px-2 text-xs md:text-[13px] font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                        value={(measurements as any)[f.k]}
                                                        onChange={e => setMeasurements({ ...measurements, [f.k]: e.target.value })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Left Eye */}
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1.5 md:mb-2">
                                            <span className="w-3.5 h-3.5 rounded-full bg-green-500 text-white text-[8px] font-bold flex items-center justify-center">L</span>
                                            <span className="text-[10px] md:text-[11px] font-semibold text-slate-600">Left Eye (OS)</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                                            {[{ l: "SPH", k: "os_sph" }, { l: "CYL", k: "os_cyl" }, { l: "AXIS", k: "os_axis" }].map(f => (
                                                <div key={f.k}>
                                                    <label className="text-[8px] md:text-[9px] font-semibold text-slate-400 uppercase block mb-1">{f.l}</label>
                                                    <input type="text" placeholder="0.00"
                                                        className="w-full h-8 md:h-9 rounded-lg bg-slate-50 border border-slate-200 px-1 md:px-2 text-xs md:text-[13px] font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                        value={(measurements as any)[f.k]}
                                                        onChange={e => setMeasurements({ ...measurements, [f.k]: e.target.value })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* PD */}
                                <div className="flex items-center gap-3 mt-4 md:mt-3">
                                    <label className="text-xs md:text-[11px] font-semibold text-slate-500">PD (mm)</label>
                                    <input type="text" placeholder="63"
                                        className="w-16 md:w-20 h-8 md:h-9 rounded-lg bg-slate-50 border border-slate-200 px-2 text-xs md:text-[13px] font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        value={measurements.pd}
                                        onChange={e => setMeasurements({ ...measurements, pd: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Step 2: Lens Category ═══ */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }} className="flex-1 p-4 md:p-6 overflow-hidden scrollbar-hide"
                            >
                                <p className="text-xs md:text-[13px] font-semibold text-slate-800 mb-1">Choose Lens Category</p>
                                <p className="text-[10px] md:text-[11px] text-slate-400 mb-3 md:mb-4">Based on your selection, we&apos;ve highlighted a recommendation.</p>

                                <div className="space-y-3">
                                    {lensCategories.map(cat => {
                                        const sel = lensCategory === cat.id;
                                        const rec = visionUsages.find(v => v.id === visionUsage)?.recommend === cat.id;
                                        return (
                                            <button key={cat.id} onClick={() => setLensCategory(cat.id)}
                                                className={`w-full flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2 text-left transition-all ${sel ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${sel ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    {sel ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full border-2 border-slate-300" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className={`text-[13px] font-semibold ${sel ? 'text-primary' : 'text-slate-800'}`}>{cat.name}</span>
                                                        {rec && <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full uppercase">Recommended</span>}
                                                        <span className="text-[10px] text-slate-400">{cat.tag}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 leading-relaxed mb-1">{cat.desc}</p>
                                                    <p className={`text-[13px] font-bold ${sel ? 'text-primary' : 'text-slate-700'}`}>
                                                        {cat.price === 0 ? "Included" : `+ Rs ${cat.price.toLocaleString()}`}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Step 3: Lens Type ═══ */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }} className="flex-1 p-4 md:p-6 overflow-hidden scrollbar-hide"
                            >
                                <p className="text-xs md:text-[13px] font-semibold text-slate-800 mb-1">Choose Lens Coating</p>
                                <p className="text-[10px] md:text-[11px] text-slate-400 mb-3 md:mb-4">Select coating for your {lensCategories.find(c => c.id === lensCategory)?.name} lenses.</p>

                                <div className="space-y-3">
                                    {lensTypes.map(type => {
                                        const sel = lensType === type.id;
                                        return (
                                            <button key={type.id} onClick={() => setLensType(type.id)}
                                                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${sel ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg shrink-0 flex items-center justify-center border border-slate-200" style={{ backgroundColor: type.color }}>
                                                    {sel && <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className={`text-xs md:text-[13px] font-semibold ${sel ? 'text-primary' : 'text-slate-800'}`}>{type.name}</span>
                                                        <span className={`text-xs md:text-[13px] font-bold ${sel ? 'text-primary' : 'text-slate-700'}`}>+ Rs {type.price.toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-[10px] md:text-[11px] text-slate-500 mb-2">{type.desc}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {type.features.map(f => (
                                                            <span key={f} className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${sel ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>{f}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Step 4: Review ═══ */}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }} className="flex-1 p-4 md:p-6 overflow-hidden scrollbar-hide"
                            >
                                <p className="text-xs md:text-[13px] font-semibold text-slate-800 mb-3 md:mb-4">Review Your Configuration</p>

                                <div className="space-y-2.5">
                                    {/* Line items */}
                                    {[
                                        { label: "Frame", value: productName, price: productPrice, editStep: null },
                                        { label: "Vision", value: visionUsages.find(v => v.id === visionUsage)?.label, price: null, editStep: 1 },
                                        { label: "Lens Category", value: lensCategories.find(c => c.id === lensCategory)?.name, price: lensCategories.find(c => c.id === lensCategory)?.price, editStep: 2 },
                                        { label: "Lens Coating", value: lensTypes.find(t => t.id === lensType)?.name, price: lensTypes.find(t => t.id === lensType)?.price, editStep: 3 },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                                            <div className="flex-1">
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{row.label}</p>
                                                <p className="text-[13px] font-medium text-slate-800">{row.value}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {row.price != null && (
                                                    <span className="text-[13px] font-semibold text-slate-700">
                                                        {row.price === 0 ? "Included" : `Rs ${row.price.toLocaleString()}`}
                                                    </span>
                                                )}
                                                {row.editStep && (
                                                    <button onClick={() => setStep(row.editStep!)} className="text-[11px] text-primary font-medium hover:underline">Edit</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Prescription summary */}
                                    {(measurements.od_sph || measurements.os_sph) && (
                                        <div className="py-2.5 border-b border-slate-50">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Prescription</p>
                                                <button onClick={() => setStep(1)} className="text-[11px] text-primary font-medium hover:underline">Edit</button>
                                            </div>
                                            <div className="flex gap-4 text-[11px] text-slate-600">
                                                <span>OD: {measurements.od_sph || "—"}/{measurements.od_cyl || "—"}×{measurements.od_axis || "—"}</span>
                                                <span>OS: {measurements.os_sph || "—"}/{measurements.os_cyl || "—"}×{measurements.os_axis || "—"}</span>
                                                {measurements.pd && <span>PD: {measurements.pd}mm</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="mt-4 bg-slate-900 rounded-xl p-4 flex items-center justify-between text-white">
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-medium">Total (Frame + Lenses)</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Free shipping across Pakistan</p>
                                    </div>
                                    <p className="text-xl font-bold">Rs {totalPrice.toLocaleString()}</p>
                                </div>


                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-slate-100 bg-white">
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack} size="sm" className="h-9 md:h-10 px-3 md:px-4 rounded-lg text-xs md:text-[13px] font-semibold">
                            <ArrowLeft className="w-3 md:w-3.5 h-3 md:h-3.5 mr-1 md:mr-1.5" /> Back
                        </Button>
                    )}
                    <div className="flex-1" />
                    {step < 4 ? (
                        <Button onClick={handleNext} disabled={!canProceed()} size="sm"
                            className="h-9 md:h-10 px-4 md:px-6 rounded-lg text-xs md:text-[13px] font-semibold bg-primary hover:bg-primary/90 disabled:opacity-40"
                        >
                            Continue <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5 ml-1 md:ml-1.5" />
                        </Button>
                    ) : (
                        <Button onClick={handleConfirm} size="sm"
                            className="h-9 md:h-10 px-4 md:px-6 rounded-lg text-xs md:text-[13px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Proceed <span className="hidden sm:inline ml-1">to Checkout</span> <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5 ml-1 md:ml-1.5" />
                        </Button>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
}
