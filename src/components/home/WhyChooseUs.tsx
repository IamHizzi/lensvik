"use client";

import React from "react";
import { ShieldCheck, Sparkles, Droplets, Monitor, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
    {
        icon: ShieldCheck,
        title: "UV Protection",
        label: "Blocks 100% UVA/UVB",
        description: "Industrial grade UV400 filters integrated into every lens set."
    },
    {
        icon: Sparkles,
        title: "Scratch Resistant",
        label: "Diamond Hard-Coat",
        description: "Multi-layer protective coating that withstands daily wear and tear."
    },
    {
        icon: Droplets,
        title: "Hydrophilic Coating",
        label: "Water & Oil Repellent",
        description: "Fog-resistant and easy-to-clean surfaces for a crystal clear view."
    },
    {
        icon: Monitor,
        title: "Screen Protection",
        label: "Blu-Block Technology",
        description: "Filters harmful blue light to reduce eyestrain from digital devices."
    }
];

export function WhyChooseUs() {
    return (
        <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-slate-100">
            <div className="text-center mb-12 md:mb-16">
                <span className="label-tag text-primary/60 mb-3 block">Superior Engineering</span>
                <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-slate-900 mb-6">
                    Why Choose Lensvik?
                </h2>
                <div className="h-1 w-20 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {FEATURES.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 mb-2">
                            {feature.title}
                        </h3>
                        <p className="label-tag text-primary text-[10px] mb-4">
                            {feature.label}
                        </p>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="flex items-center gap-2 font-black italic uppercase tracking-widest text-[10px]">
                    <CheckCircle2 className="w-4 h-4" /> FDA Approved
                </div>
                <div className="flex items-center gap-2 font-black italic uppercase tracking-widest text-[10px]">
                    <CheckCircle2 className="w-4 h-4" /> ISO Certified
                </div>
                <div className="flex items-center gap-2 font-black italic uppercase tracking-widest text-[10px]">
                    <CheckCircle2 className="w-4 h-4" /> CE Compliant
                </div>
            </div>
        </section>
    );
}
