"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import { getProductById, Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Share2, Ruler, ShieldCheck, Truck, CheckCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import Image from "next/image";
import { LensConfigurator } from "@/components/products/LensConfigurator";
import { VariationSelector } from "@/components/products/VariationSelector";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { RelatedProducts } from "@/components/products/RelatedProducts";

// Dynamic imports for heavy VTO/Size components
const VirtualTryOn = dynamic(() => import("@/components/vto/VirtualTryOn").then(mod => mod.VirtualTryOn), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-full rounded-3xl" />
});

const SizeFinder = dynamic(() => import("@/components/size-finder/SizeFinder").then(mod => mod.SizeFinder), {
    ssr: false
});

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVTOModalOpen, setIsVTOModalOpen] = useState(false);
    const [isLensModalOpen, setIsLensModalOpen] = useState(false);
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

            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pt-28 md:pt-36">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                    {/* Left: Gallery Section */}
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
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
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

                        <div className="grid grid-cols-4 md:grid-cols-4 gap-3 md:gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square rounded-xl md:rounded-2xl glass border border-white/10 overflow-hidden opacity-60 hover:opacity-100 cursor-pointer transition-opacity relative">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-2 md:p-3"
                                        sizes="(max-width: 768px) 25vw, 100px"
                                    />
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
                                        <p className="text-small text-muted-foreground line-through decoration-primary/20">Rs {product.originalPrice.toLocaleString()}</p>
                                    )}
                                    <p className="price-tag text-primary">Rs {product.price.toLocaleString()}</p>
                                </div>
                                <div className="h-10 md:h-12 w-[1px] bg-border mx-2 md:mx-4" />
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-primary/5 text-primary border-primary/20 label-tag px-3 py-1 animate-pulse">
                                        High-Index Available
                                    </Badge>
                                    <Badge className="bg-slate-50 text-slate-400 border-slate-200 label-tag px-3 py-1">
                                        RX Ready
                                    </Badge>
                                </div>
                            </div>
                        </header>

                        <div className="space-y-3 md:space-y-5 mb-5 md:mb-8">
                            <section>
                                <p className="text-sm md:text-lg leading-relaxed text-muted-foreground font-medium italic mb-6">
                                    {product.description || "Experimental architecture meets optical precision. Hand-assembled from surgical-grade titanium for a weightless experience."}
                                </p>

                                {/* Technical Features Checklist */}
                                <div className="grid grid-cols-2 gap-y-3 mb-8 bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200">
                                    {[
                                        "Anti-Reflective Coating",
                                        "Ultra-Light Frame (18g)",
                                        "Impact Resistant",
                                        "100% UV400 Filter"
                                    ].map(feature => (
                                        <div key={feature} className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-tighter italic text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-primary" />
                                            </div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <VariationSelector />

                            <div className="space-y-3 pt-6">
                                {isPrescriptionProduct && (
                                    <Button
                                        onClick={() => setIsLensModalOpen(true)}
                                        size="lg"
                                        className="w-full h-16 rounded-2xl font-black bg-primary text-white hover:bg-primary/90 transition-all flex flex-col items-center justify-center gap-0 border-none shadow-xl shadow-primary/10 italic animate-pulse-subtle"
                                    >
                                        <span className="text-sm md:text-xl uppercase tracking-tighter">Select Lenses</span>
                                    </Button>
                                )}

                                <Button
                                    onClick={handleAddToCart}
                                    size="lg"
                                    className="w-full h-16 rounded-2xl btn-text bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all flex flex-col items-center justify-center gap-0 border border-slate-200 shadow-sm"
                                >
                                    <span className="text-sm md:text-lg uppercase tracking-tighter font-bold">Add to Cart</span>
                                </Button>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => setIsVTOModalOpen(true)}
                                        size="lg"
                                        variant="outline"
                                        className="h-16 rounded-2xl btn-text border-2 border-primary/20 hover:bg-primary/5 transition-all group tracking-tighter"
                                    >
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="inline-block w-2 md:w-3 h-2 md:h-3 rounded-full bg-primary mr-2"
                                        />
                                        Try on
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/cart")}
                                        size="lg"
                                        variant="outline"
                                        className="h-16 rounded-2xl btn-text border-2 border-primary/20 hover:bg-primary/5 transition-all group tracking-tighter"
                                    >
                                        <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 mr-2 group-hover:scale-110 transition-transform" />
                                        Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Move ProductSpecs here for full width */}
                <ProductSpecs
                    measurements={product.measurements}
                    description={product.description}
                />

                <RelatedProducts
                    currentProductId={product._id}
                    category={product.category}
                />
            </div>

            <VirtualTryOn
                isOpen={isVTOModalOpen}
                onClose={() => setIsVTOModalOpen(false)}
                productImage={product.vtoImage || product.image}
                productName={product.name}
            />
            <LensConfigurator
                isOpen={isLensModalOpen}
                onClose={() => setIsLensModalOpen(false)}
                product={product}
            />
        </main>
    );
}
