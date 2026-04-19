"use client";

import React from "react";
import { Star, Quote, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const REVIEWS = [
    {
        name: "Hammmad Harron",
        role: "Creative Director",
        content: "Best eyewear purchase I’ve ever made. The blue-block lenses actually work, and the frame is incredibly lightweight. The VTO made the choice easy.",
        rating: 5,
        location: "Islamabad, F7"
    },
    {
        name: "Sanya Khan",
        role: "Tech Consultant",
        content: "I was skeptical about buying prescription glasses online. Lensvik's step-by-step configurator was so smooth. Received my glasses in 3 days, perfect fit!",
        rating: 5,
        location: "Lahore, DHA"
    },
    {
        name: "Hira Khan",
        role: "Professional Gamer",
        content: "The Lensvik Blu Pro lenses are a game changer for long sessions. No more headaches. Every detail of the platform screams premium quality.",
        rating: 5,
        location: "Karachi, Clifton"
    }
];

export function Testimonials() {
    return (
        <section className="bg-slate-50 py-16 md:py-24 overflow-hidden">
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
                    <div className="max-w-xl text-left">
                        <span className="label-tag text-primary/60 mb-3 block">Voices of Vision</span>
                        <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
                            Client Perspectives
                        </h2>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-yellow-500 mb-1">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-500" />)}
                        </div>
                        <p className="text-sm font-black italic uppercase tracking-widest text-slate-400">
                            Average 4.9/5 Rating
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {REVIEWS.map((review, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-start relative group"
                        >
                            <div className="absolute top-8 right-8 text-primary/10">
                                <Quote className="w-12 h-12" />
                            </div>

                            <div className="flex gap-0.5 mb-6">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-lg text-slate-600 font-medium leading-relaxed italic mb-8 relative z-10">
                                "{review.content}"
                            </p>

                            <div className="mt-auto flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-primary/20 flex items-center justify-center font-black text-primary">
                                    {review.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black uppercase tracking-tighter italic text-slate-900">{review.name}</h4>
                                        <div className="flex items-center gap-1 text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                                            <CheckCircle className="w-2.5 h-2.5" /> Verified
                                        </div>
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{review.role} • {review.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
