"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { SidebarFilters } from "@/components/products/SidebarFilters";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, Product } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function CategoryPage() {
    const { slug } = useParams();
    const searchParams = useSearchParams();
    const subRoute = searchParams.get('sub');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("popular");
    const [activeFilters, setActiveFilters] = useState({
        categories: [] as string[],
        priceRange: [0, 15000] as [number, number],
        coatings: [] as string[],
        features: [] as string[]
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getProducts();
                let filtered = allProducts.filter(p =>
                    p.category.toLowerCase().replace(/\s+/g, '-') === slug
                );

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

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // Apply Price Filter
        result = result.filter(p => p.price <= activeFilters.priceRange[1]);

        // Sorting Logic
        if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
        if (sortBy === "popular") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        return result;
    }, [products, activeFilters, sortBy]);

    const handleFilterChange = (type: string, value: any) => {
        if (type === "price") {
            setActiveFilters(prev => ({ ...prev, priceRange: [0, value] }));
        } else {
            setActiveFilters(prev => {
                const current = (prev as any)[type];
                const updated = current.includes(value)
                    ? current.filter((v: any) => v !== value)
                    : [...current, value];
                return { ...prev, [type]: updated };
            });
        }
    };

    const configFilters = {
        categories: ["Single Vision", "Progressive", "Bifocal", "Zero Power"],
        priceRange: [0, 15000] as [number, number],
        coatings: ["Blue Block", "Anti-Glare", "Photochromic", "Transition"],
        features: ["Ultra-Light", "High-Index", "Flexible Hinge", "Scratch-Proof"]
    };

    const categoryDisplayName = slug ? (slug as string).replace(/-/g, ' ').toUpperCase() : "COLLECTION";

    return (
        <main className="min-h-screen bg-background pt-28 md:pt-36">
            <Navbar />
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pb-20 md:pb-32">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:w-72 shrink-0 border-r border-slate-100 pr-8">
                        <SidebarFilters
                            filters={configFilters}
                            onFilterChange={handleFilterChange}
                            activeFilters={{ ...activeFilters, totalCount: filteredAndSortedProducts.length }}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">{categoryDisplayName}</h1>
                                    <Badge className="bg-primary/5 text-primary border-primary/10 label-tag px-3 py-1">
                                        {filteredAndSortedProducts.length} Items
                                    </Badge>
                                </div>
                                <p className="text-small text-slate-500 font-medium italic">Premium {categoryDisplayName.toLowerCase()} curated for visionaries.</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {/* Mobile Filter Trigger */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="lg" className="lg:hidden flex-1 h-12 rounded-2xl btn-text border-slate-200">
                                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                                            Filter
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                        <div className="py-6">
                                            <SidebarFilters
                                                filters={configFilters}
                                                onFilterChange={handleFilterChange}
                                                activeFilters={{ ...activeFilters, totalCount: filteredAndSortedProducts.length }}
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full md:w-[220px] h-12 rounded-2xl btn-text bg-white border-2 border-slate-100 focus:ring-primary/10">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-slate-400" />
                                            <SelectValue placeholder="Sort By" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        <SelectItem value="popular" className="btn-text">Popular Items</SelectItem>
                                        <SelectItem value="price-low" className="btn-text">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high" className="btn-text">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </header>

                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-[4/5] bg-slate-50 animate-pulse rounded-[2.5rem]" />
                                ))}
                            </div>
                        ) : filteredAndSortedProducts.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredAndSortedProducts.map((product, index) => (
                                        <ProductCard key={product._id} {...product} index={index} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                                <h3 className="text-2xl font-black uppercase italic italic mb-4">No vision found</h3>
                                <p className="text-small text-slate-400 mb-8">Adjust your filters to discover more possibilities.</p>
                                <Button onClick={() => setActiveFilters({ categories: [], priceRange: [0, 15000], coatings: [], features: [] })} variant="link" className="btn-text text-primary">Reset all filters</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold overflow-hidden ${className}`}>
            {children}
        </span>
    );
}

