"use client";

import React, { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/api";
import { ProductStrip } from "@/components/home/ProductStrip";

interface RelatedProductsProps {
    currentProductId: string;
    category: string;
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const all = await getProducts();
                // Filter by category and exclude current
                const filtered = all
                    .filter(p => p.category === category && p._id !== currentProductId)
                    .slice(0, 4);
                
                setRelatedProducts(filtered);
            } catch (error) {
                console.error("Failed to fetch related products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentProductId, category]);

    if (!loading && relatedProducts.length === 0) return null;

    return (
        <div className="mt-16 md:mt-24 border-t border-slate-100">
            <ProductStrip 
                title="Similar Styles" 
                subtitle="Designed with the same architectural precision."
                products={relatedProducts} 
                viewAllHref={`/category/${category.toLowerCase()}`}
                loading={loading}
            />
        </div>
    );
}
