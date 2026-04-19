"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    size?: string;
    rating?: number;
    image: string;
    category: string;
    index: number;
}

export function ProductCard({ _id, name, price, originalPrice, size, rating = 5, image, category, index }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            className="group"
        >
            <Card className="overflow-hidden border border-border/50 shadow-sm bg-white hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col h-full">
                <Link href={`/products/${_id}`} className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </Link>

                <CardContent className="p-3 md:p-4 flex flex-col flex-1">
                    <Link href={`/products/${_id}`}>
                        <h3 className="group-hover:text-primary transition-colors line-clamp-2 min-h-[34px] md:min-h-[40px] uppercase italic">
                            {name}
                        </h3>
                    </Link>

                    <div className="flex gap-0.5 mb-1.5 md:mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < (rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                        {originalPrice && (
                            <span className="text-small text-muted-foreground line-through">Rs {originalPrice.toLocaleString()}</span>
                        )}
                        <span className="price-tag text-[#e67e22]">Rs {price.toLocaleString()}</span>
                    </div>

                    {size && (
                        <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3">
                            Size: <span className="text-foreground font-medium">{size}</span>
                        </p>
                    )}

                    <div className="mt-auto grid grid-cols-2 gap-2 md:gap-3">
                        <Link href={`/products/${_id}?tryon=true`} className="w-full">
                            <Button variant="secondary" className="w-full bg-[#f0f0f0] hover:bg-[#e0e0e0] text-foreground btn-text rounded-xl h-10 md:h-11 border-none tracking-widest">
                                Try On
                            </Button>
                        </Link>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({ productId: _id, name, price, image });
                                toast.success("Added to cart!");
                            }}
                            className="w-full bg-primary text-white btn-text rounded-xl h-10 md:h-11 shadow-lg shadow-primary/20 tracking-widest"
                        >
                            <ShoppingCart className="w-4 h-4 mr-1 md:mr-1.5" />
                            Add
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
