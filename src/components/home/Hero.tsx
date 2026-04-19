import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    const banners = [
        {
            image: "/images/dfd.png",
            title: "Premium Eyewear",
            subtitle: "Curated for Visionaries",
            tag: "Shop the Latest Collection"
        },
        {
            image: "/images/rt.png",
            title: "Discover Your Style",
            subtitle: "Frames for Every Face",
            tag: "Virtual Try-On Available"
        },
        {
            image: "/images/v.png",
            title: "Discover Your Style",
            subtitle: "Frames for Every Face",
            tag: "Virtual Try-On Available"
        },
    ];

    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[220px] md:h-[450px] lg:h-[550px] flex items-end overflow-hidden mt-[56px] md:mt-[76px] bg-[#f8f9fa]">
            {/* Slider Banners */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={banners[current].image}
                            alt="Hero Banner"
                            fill
                            className="object-cover object-left md:object-center"
                            priority={true}
                        />
                        <div className="absolute inset-0 bg-black/5" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 relative z-10 pb-8 md:pb-16">
                <div className="max-w-full md:max-w-3xl">
                    <motion.div
                        key={`content-${current}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 md:mb-8"
                    >
                        {/* {banners[current].tag && (
                            <span className="inline-block text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-primary mb-2 md:mb-3 bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10 italic">
                                {banners[current].tag}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9] italic uppercase md:mb-2">
                            {banners[current].title}
                        </h1>
                        <p className="text-xl md:text-4xl font-black tracking-tighter text-primary/80 italic uppercase leading-none mb-4 md:mb-6">
                            {banners[current].subtitle}
                        </p> */}

                        {/* Professional Small Buttons */}

                    </motion.div>

                    {/* Progress Dots - Smaller and subtle */}

                </div>
            </div>
        </section>
    );
}
