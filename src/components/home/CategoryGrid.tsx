"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const CATEGORIES = [
    {
        name: "Sunglasses",
        image: "/images/front-banner-images-1.jpg",
        href: "/category/sunglasses",
        count: "120+ Styles"
    },
    {
        name: "Prescription",
        image: "/images/front-banner-images-2.jpg",
        href: "/category/prescription",
        count: "80+ Styles"
    },
    {
        name: "Blue Light",
        image: "/images/front-banner-images-3.jpg",
        href: "/category/blue-light",
        count: "45+ Styles"
    },
    {
        name: "Kids",
        image: "/images/front-banner-images-4.jpg",
        href: "/category/kids",
        count: "30+ Styles"
    },
    {
        name: "Accessories",
        image: "/images/front-banner-images-5.jpg",
        href: "/category/accessories",
        count: "15+ Items"
    }
];

export function CategoryGrid() {
    return (
        <section className="py-16 md:py-24 container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center mb-10 md:mb-16 text-center">
                <h2 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-3 md:mb-4">Explore our world</h2>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tighter">Shop by Category</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {CATEGORIES.map((cat, index) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link href={cat.href} className="group block relative overflow-hidden rounded-3xl aspect-[4/5] glass border border-white/40">
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute bottom-6 left-6 text-white text-left">
                                <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">{cat.count}</p>
                                <h4 className="text-xl font-bold tracking-tight">{cat.name}</h4>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
