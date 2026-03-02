"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getProductById, Product } from "@/lib/api";
import { PrescriptionForm } from "@/components/products/PrescriptionConfigurator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PrescriptionPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id as string);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product", err);
                toast.error("Product not found");
                router.push("/collections");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);

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
            router.push("/cart");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/30">
                <Navbar />
                <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 max-w-5xl">
                    <Skeleton className="h-[600px] w-full rounded-3xl" />
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <main className="min-h-screen bg-slate-50/30 pb-16">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 pt-20 md:pt-24 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-5 md:mb-8 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase text-slate-900 mb-1">Configure Your Lenses</h1>
                        <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">Premium Optical Precision for {product.name}</p>
                    </div>

                    <PrescriptionForm
                        productName={product.name}
                        productPrice={product.price}
                        productImage={product.image}
                        onConfirm={handleConfirmPrescription}
                        isStandalone={true}
                        onBack={() => router.back()}
                    />
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
