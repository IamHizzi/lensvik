import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    const banners = [
        {
            image: "/images/hero_intelligent_screen_1769588125097.png",
            title: "Intelligent",
            subtitle: "Screen Glasses",
            tag: "Digital Protection & Style"
        },
        {
            image: "/images/hero_intelligent_transition_1769588260811.png",
            title: "Intelligent",
            subtitle: "Transition Lenses",
            tag: "Adaptive Clarity Anywhere"
        },
        {
            image: "/images/Gemini_Generated_Image_z6ihpmz6ihpmz6ih-2-1536x560.jpg",
            title: "Intelligent",
            subtitle: "Drive Safe",
            tag: "Ultimate Visibility & Safety"
        }
    ];

    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[240px] md:h-[400px] flex items-end overflow-hidden mt-[56px] md:mt-[76px] bg-[#f8f9fa]">
            {/* Slider Banners */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={banners[current].image}
                            alt="Hero Banner"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/5" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 pb-6 md:pb-12">
                <div className="max-w-3xl">
                    <motion.div
                        key={`content-${current}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Professional Small Buttons */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <Link href="/collections">
                                <Button size="default" className="h-9 md:h-11 px-5 md:px-8 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg font-bold text-xs md:text-sm">
                                    Shop Now
                                </Button>
                            </Link>
                            <Link href="/products/1">
                                <Button size="default" variant="outline" className="h-9 md:h-11 px-5 md:px-8 rounded-full border border-primary/20 text-primary hover:bg-white/80 transition-all backdrop-blur-md bg-white/40 font-bold text-xs md:text-sm">
                                    Virtual Try-On
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Progress Dots - Smaller and subtle */}
                    <div className="flex gap-1.5 mt-4 md:mt-8">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-1 md:h-1.5 rounded-full transition-all ${i === current ? 'w-6 md:w-8 bg-primary' : 'w-1.5 md:w-2 bg-primary/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
