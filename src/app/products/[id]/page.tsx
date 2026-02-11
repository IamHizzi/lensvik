"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVTOModalOpen, setIsVTOModalOpen] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
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

    const handleConfirmPrescription = (prescriptionData: any) => {
        if (product) {
            const totalPrice = product.price + (prescriptionData.lensCategory.price || 0) + (prescriptionData.lensType.price || 0);
            addToCart({
                productId: product._id,
                name: `${product.name} (Custom Lenses)`,
                price: totalPrice,
                image: product.image,
                prescription: prescriptionData
            });
            toast.success("Added to cart with custom lenses!");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
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

    const isPrescriptionProduct = product.category.toLowerCase() === "prescription";

    return (
        <main className="min-h-screen bg-background pb-24">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
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
                        <header className="mb-6 md:mb-8">
                            <Badge variant="outline" className="mb-3 md:mb-4 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[9px] md:text-[10px] py-1 px-2 md:px-3 font-black">
                                {isPrescriptionProduct ? "Customizable Frame" : "Premium Collection"}
                            </Badge>
                            <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-3 md:mb-4 italic">{product.name}</h1>
                            <div className="flex items-center gap-3 md:gap-4">
                                <div>
                                    {product.originalPrice && (
                                        <p className="text-lg md:text-xl text-muted-foreground line-through">Rs {product.originalPrice.toLocaleString()}</p>
                                    )}
                                    <p className="text-3xl md:text-5xl font-black text-primary font-sans italic">Rs {product.price.toLocaleString()}</p>
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

                        <div className="space-y-6 md:space-y-8 mb-10 md:mb-12">
                            <section>
                                <h3 className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-muted-foreground mb-2 md:mb-3">The Architectural Vision</h3>
                                <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-medium">
                                    {product.description || "Experimental architecture meets optical precision. Hand-assembled from surgical-grade titanium for a weightless experience."}
                                </p>
                            </section>

                            <div className="flex flex-col gap-4">
                                {isPrescriptionProduct && (
                                    <Button
                                        onClick={() => setIsPrescriptionModalOpen(true)}
                                        size="lg"
                                        className="h-16 md:h-20 rounded-[2rem] font-black text-lg md:text-xl bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/20 group relative overflow-hidden italic"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        Buy with Lenses
                                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </Button>
                                )}
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <Button
                                        onClick={() => setIsVTOModalOpen(true)}
                                        size="lg"
                                        variant="outline"
                                        className="h-14 md:h-16 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg border-2 hover:bg-primary/5 transition-all group italic"
                                    >
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="inline-block w-2.5 h-2.5 rounded-full bg-primary mr-2"
                                        />
                                        Virtual Try-On
                                    </Button>
                                    <Button
                                        onClick={handleAddToCart}
                                        size="lg"
                                        variant="outline"
                                        className="h-14 md:h-16 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg border-2 hover:bg-primary/5 transition-all group italic"
                                    >
                                        <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 mr-2 group-hover:scale-110 transition-transform" />
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:gap-6 py-6 md:py-8 border-y border-border/50 mb-10 md:mb-12">
                            <div className="flex flex-col items-center text-center">
                                <Truck className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2" />
                                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-tighter">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2" />
                                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-tighter">2-Year Warranty</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Ruler className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2" />
                                <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-tighter">Perfect Fit</span>
                            </div>
                        </div>

                        <SizeFinder />
                    </motion.div>
                </div>
            </div>

            <VirtualTryOn
                isOpen={isVTOModalOpen}
                onClose={() => setIsVTOModalOpen(false)}
                productImage={product.vtoImage || product.image}
                productName={product.name}
            />

            <PrescriptionConfigurator
                isOpen={isPrescriptionModalOpen}
                onClose={() => setIsPrescriptionModalOpen(false)}
                productName={product.name}
                productPrice={product.price}
                productImage={product.image}
                onConfirm={handleConfirmPrescription}
            />
        </main>
    );
}
