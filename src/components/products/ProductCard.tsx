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
                    />
                </Link>

                <CardContent className="p-5 flex flex-col flex-1">
                    <Link href={`/products/${_id}`}>
                        <h3 className="text-[15px] font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">
                            {name}
                        </h3>
                    </Link>

                    <div className="flex gap-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < (rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        {originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">Rs {originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-lg font-black text-[#e67e22]">Rs {price.toLocaleString()}</span>
                    </div>

                    {size && (
                        <p className="text-sm text-muted-foreground mb-4">
                            Size: <span className="text-foreground font-medium">{size}</span>
                        </p>
                    )}

                    <div className="mt-auto grid grid-cols-2 gap-2">
                        <Link href={`/products/${_id}?tryon=true`} className="w-full">
                            <Button variant="secondary" className="w-full bg-[#f0f0f0] hover:bg-[#e0e0e0] text-foreground font-bold rounded-lg h-10 border-none text-xs">
                                Try On
                            </Button>
                        </Link>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({ id: _id, name, price, image });
                                toast.success("Added to cart!");
                            }}
                            className="w-full bg-primary text-white font-bold rounded-lg h-10 shadow-lg shadow-primary/20 text-xs"
                        >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                            Add
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
