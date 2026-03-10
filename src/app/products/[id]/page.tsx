"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { VirtualTryOn } from "@/components/vto/VirtualTryOn";
import { SizeFinder } from "@/components/size-finder/SizeFinder";
import { getProductById, Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Share2, Ruler, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Image from "next/image";

import { PrescriptionConfigurator } from "@/components/products/PrescriptionConfigurator";

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVTOModalOpen, setIsVTOModalOpen] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id as string);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (searchParams.get('tryon') === 'true') {
            setIsVTOModalOpen(true);
        }
    }, [searchParams]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image
            });
            toast.success(`${product.name} added to cart!`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 md:px-6 pt-20 md:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    <Skeleton className="aspect-square rounded-3xl md:rounded-[3rem]" />
                    <div className="space-y-4 md:space-y-6">
                        <Skeleton className="h-10 md:h-12 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-bold">Product not found</p>
            </div>
        );
    }

    const isPrescriptionProduct = product.category.toLowerCase() === "eyeglasses" || product.category.toLowerCase() === "prescription";

    return (
        <main className="min-h-screen bg-background pb-16">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-20 md:pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    {/* Left: Gallery Section */}
                    {/* ... (keep existing gallery motion.div) ... */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4 md:space-y-6"
                    >
                        <div className="relative aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden glass border border-white/20 group">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-4 md:p-8 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-6 right-6 flex flex-col gap-3">
                                <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                                    <Heart className="w-5 h-5" />
                                </Button>
                                <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square rounded-2xl glass border border-white/10 overflow-hidden opacity-60 hover:opacity-100 cursor-pointer transition-opacity relative">
                                    <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <header className="mb-4 md:mb-6">
                            <Badge variant="outline" className="mb-2 md:mb-3 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[8px] md:text-[9px] py-0.5 px-2 font-black">
                                {isPrescriptionProduct ? "Customizable Frame" : "Premium Collection"}
                            </Badge>
                            <h1 className="text-xl md:text-3xl font-black tracking-tighter mb-1.5 md:mb-2 italic line-clamp-2 md:line-clamp-none uppercase">{product.name}</h1>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div>
                                    {product.originalPrice && (
                                        <p className="text-base md:text-xl text-muted-foreground line-through">Rs {product.originalPrice.toLocaleString()}</p>
                                    )}
                                    <p className="text-xl md:text-2xl font-black text-primary font-sans italic">Rs {product.price.toLocaleString()}</p>
                                </div>
                                <div className="h-10 md:h-12 w-[1px] bg-border mx-2 md:mx-4" />
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                                    </div>
                                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">(48 Reviews)</span>
                                </div>
                            </div>
                        </header>

                        <div className="space-y-3 md:space-y-5 mb-5 md:mb-8">
                            <section>
                                <h3 className="text-[9px] md:text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1 md:mb-3italic">The Architectural Vision</h3>
                                <p className="text-sm md:text-lg leading-relaxed text-muted-foreground font-medium">
                                    {product.description || "Experimental architecture meets optical precision. Hand-assembled from surgical-grade titanium for a weightless experience."}
                                </p>
                            </section>

                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    size="lg"
                                    className="h-auto py-3 md:py-4 rounded-xl font-black bg-[#b22234] text-white hover:bg-[#901c2a] transition-all flex flex-col items-center justify-center gap-0 border-none shadow-lg italic"
                                >
                                    <span className="text-sm md:text-lg uppercase tracking-tighter">Buy Now</span>
                                    <span className="text-[9px] md:text-[11px] opacity-80 font-medium normal-case">frame with box & cloth</span>
                                </Button>

                                <Button
                                    onClick={() => router.push(`/products/${product._id}/prescription`)}
                                    size="lg"
                                    variant="outline"
                                    className="h-auto py-3 md:py-4 rounded-xl font-black border-2 border-[#b22234] text-[#b22234] hover:bg-[#b22234]/5 transition-all flex flex-col items-center justify-center gap-0 italic"
                                >
                                    <span className="text-sm md:text-lg uppercase tracking-tighter">Select Lenses</span>
                                    <span className="text-[9px] md:text-[11px] opacity-80 font-medium normal-case text-center px-4">
                                        with or without eyesight glasses <br className="hidden md:block" /> choose blue light glasses
                                    </span>
                                </Button>

                                <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2">
                                    <Button
                                        onClick={() => setIsVTOModalOpen(true)}
                                        size="lg"
                                        variant="outline"
                                        className="h-11 md:h-12 rounded-xl font-black text-sm md:text-base border-2 border-primary/20 hover:bg-primary/5 transition-all group italic"
                                    >
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="inline-block w-2.5 h-2.5 rounded-full bg-primary mr-2"
                                        />
                                        Try on
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/cart")}
                                        size="lg"
                                        variant="outline"
                                        className="h-11 md:h-12 rounded-xl font-black text-sm md:text-base border-2 border-primary/20 hover:bg-primary/5 transition-all group italic"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Cart
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 md:gap-4 py-3 md:py-5 border-y border-border/50 mb-5 md:mb-8">
                            <div className="flex flex-col items-center text-center">
                                <Truck className="w-4 h-4 md:w-6 md:h-6 text-primary mb-1 md:mb-2" />
                                <span className="text-[7px] md:text-[10px] uppercase font-bold tracking-tighter">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-primary mb-1 md:mb-2" />
                                <span className="text-[7px] md:text-[10px] uppercase font-bold tracking-tighter">2-Year Warranty</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Ruler className="w-4 h-4 md:w-6 md:h-6 text-primary mb-1 md:mb-2" />
                                <span className="text-[7px] md:text-[10px] uppercase font-bold tracking-tighter">Perfect Fit</span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

            <VirtualTryOn
                isOpen={isVTOModalOpen}
                onClose={() => setIsVTOModalOpen(false)}
                productImage={product.vtoImage || product.image}
                productName={product.name}
            />
        </main>
    );
}
