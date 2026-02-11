"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductStripProps {
    title: string;
    subtitle?: string;
    products: any[];
    viewAllHref: string;
    lightBg?: boolean;
}

export function ProductStrip({ title, subtitle, products, viewAllHref, lightBg = false }: ProductStripProps) {
    return (
        <section className={`py-16 md:py-24 ${lightBg ? 'bg-primary/5' : 'bg-background'}`}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3 md:mb-4">{title}</h2>
                        {subtitle && <p className="text-sm md:text-base text-muted-foreground max-w-xl">{subtitle}</p>}
                    </div>
                    <Link href={viewAllHref} className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-primary hover:gap-4 transition-all group">
                        View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
                >
                    {products.map((product, index) => (
                        <ProductCard key={product._id || product.id} {...product} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
