"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import { getProducts, Product } from "@/lib/api";

export default function CategoryPage() {
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const subRoute = searchParams.get('sub');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getProducts();
                // Filter by category slug (case-insensitive)
                let filtered = allProducts.filter(p =>
                    p.category.toLowerCase().replace(/\s+/g, '-') === slug
                );

                // Further filter by subcategory if exists
                if (subRoute && subRoute !== 'sale') {
                    filtered = filtered.filter(p =>
                        p.subcategory && p.subcategory.toLowerCase() === subRoute.toLowerCase()
                    );
                } else if (subRoute === 'sale') {
                    filtered = filtered.filter(p => (p.originalPrice || 0) > p.price);
                }

                setProducts(filtered);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [slug, subRoute]);

    const categoryName = slug ? (slug as string).split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : "";

    const subName = subRoute ? subRoute.charAt(0).toUpperCase() + subRoute.slice(1) : "";
    const displayName = subRoute ? `${categoryName} - ${subName}` : categoryName;

    return (
        <main className="min-h-screen bg-background pt-20 md:pt-24 pb-16">
            <Navbar />
            <div className="container mx-auto px-6">
                <header className="mb-6 md:mb-10 text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-4xl font-black tracking-tighter mb-1 md:mb-2 uppercase italic"
                    >
                        {displayName}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs md:text-sm text-muted-foreground font-medium"
                    >
                        Explore our premium collection of {displayName.toLowerCase()} curated for visionaries.
                    </motion.p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
                    >
                        {products.map((product, index) => (
                            <ProductCard key={product._id} {...product} index={index} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-24">
                        <h3 className="text-2xl font-bold mb-4">No products found</h3>
                        <p className="text-muted-foreground">Try exploring our other categories.</p>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
