"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// ── Category sections matching the mobile design ──
const EYEGLASSES = [
    { name: "Men", image: "/images/men.png", href: "/category/eyeglasses?sub=men" },
    { name: "Women", image: "/images/women eye.png", href: "/category/eyeglasses?sub=women" },
    { name: "Kids", image: "/images/kid eye.png", href: "/category/eyeglasses?sub=kids" },
    { name: "On Sale", image: "/images/on sale eye.png", href: "/category/eyeglasses?sub=sale" },
];

const SUNGLASSES = [
    { name: "Men", image: "/images/men sun.png", href: "/category/sunglasses?sub=men" },
    { name: "Women", image: "/images/women sun.png", href: "/category/sunglasses?sub=women" },
    { name: "Kids", image: "/images/kids sun.png", href: "/category/sunglasses?sub=kids" },
    { name: "On Sale", image: "/images/on sale sunglasses.png", href: "/category/sunglasses?sub=sale" },
];

const NEXTGEN = [
    { name: "Digital Glasses", image: "/images/digital glasses.png", href: "/category/nextgen?sub=digital" },
    { name: "Transition Glasses", image: "/images/transition glasses.png", href: "/category/nextgen?sub=transition" },
    { name: "Smart Glasses", image: "/images/smart glasses.jpeg", href: "/category/nextgen?sub=smart" },
    { name: "Sunshade", image: "/images/sunshade.webp", href: "/category/nextgen?sub=sunshade" },
];

const CONTACT_LENSES = [
    { name: "Clear", image: "/images/clear.png", href: "/category/contact-lenses?sub=clear" },
    { name: "Color", image: "/images/color.png", href: "/category/contact-lenses?sub=color" },
    { name: "Solution", image: "/images/front-banner-images-2.jpg", href: "/category/contact-lenses?sub=solution" },
    { name: "Trial Pack", image: "/images/front-banner-images-3.jpg", href: "/category/contact-lenses?sub=trial pack" },
];

interface CategorySection {
    title: string;
    tag?: string;
    items: { name: string; image: string; href: string }[];
}

const SECTIONS: CategorySection[] = [
    { title: "Eyeglasses", tag: "with Power", items: EYEGLASSES },
    { title: "Sunglasses", items: SUNGLASSES },
    { title: "Lensvik NextGen Collection", items: NEXTGEN },
    { title: "Contact Lenses & Accessories", items: CONTACT_LENSES },
];

function CategoryCard({ item, index }: { item: { name: string; image: string; href: string }; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-full md:w-auto"
        >
            <Link href={item.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl aspect-[4/5] md:aspect-[4/5] bg-muted border border-white/30 shadow-sm hover:shadow-lg transition-shadow">
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100px, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                <p className="text-center text-xs md:text-sm font-bold mt-2 text-foreground/80 group-hover:text-primary transition-colors truncate">
                    {item.name}
                </p>
            </Link>
        </motion.div>
    );
}

function SectionBlock({ section }: { section: CategorySection }) {
    return (
        <div className="mb-5 md:mb-10">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-3 md:mb-4">
                <h3 className="text-base md:text-xl font-extrabold tracking-tight text-[#1a1550]">
                    {section.title}
                </h3>
                {section.tag && (
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider bg-[#1a1550] text-white px-2.5 py-0.5 rounded-full">
                        {section.tag}
                    </span>
                )}
            </div>

            {/* Mobile: 4-column grid | Desktop: grid */}
            <div className="grid md:hidden grid-cols-4 gap-2 md:gap-3 mb-2">
                {section.items.map((item, i) => (
                    <CategoryCard key={item.name} item={item} index={i} />
                ))}
            </div>

            <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-4 gap-6">
                {section.items.map((item, i) => (
                    <CategoryCard key={item.name} item={item} index={i} />
                ))}
            </div>
        </div>
    );
}

export function CategoryGrid() {
    return (
        <section className="py-6 md:py-10 w-full max-w-screen-2xl mx-auto px-4 md:px-6">
            {/* Desktop header */}
            <div className="hidden md:flex flex-col items-center mb-8 text-center">
                <h2 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-3">Explore our world</h2>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tighter">Shop by Category</h3>
            </div>

            {/* Render all sections */}
            {SECTIONS.map((section) => (
                <SectionBlock key={section.title} section={section} />
            ))}
        </section>
    );
}
