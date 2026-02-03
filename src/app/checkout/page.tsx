"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

export default function CheckoutPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = () => {
        setIsProcessing(true);
        setTimeout(() => {
            toast.success("Purchase successful! Thank you for choosing Lensvik.");
            clearCart();
            setIsProcessing(false);
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-background pt-32">
                <Navbar />
                <div className="container mx-auto px-6 text-center py-24">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <ShoppingCart className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/collections">
                        <Button className="rounded-full h-14 px-8 font-bold text-lg">Start Shopping</Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-24">
            <Navbar />
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-black tracking-tighter mb-12">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="glass p-6 rounded-[2rem] border border-white/20 flex gap-6 items-center"
                                >
                                    <div className="w-32 h-32 relative rounded-2xl overflow-hidden glass border border-white/10 shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                        <p className="text-primary font-black text-lg mb-4">Rs {item.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-full"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 rounded-full"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10 rounded-full"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-widest font-bold">Subtotal</p>
                                        <p className="text-2xl font-black font-sans">Rs {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <Card className="p-8 glass border-white/20 rounded-[2.5rem] sticky top-32">
                            <h2 className="text-2xl font-black tracking-tight mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-muted-foreground font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-foreground">Rs {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground font-medium">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold uppercase tracking-widest text-xs mt-1">Free</span>
                                </div>
                                <div className="h-[1px] bg-white/10 my-4" />
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-4xl font-black text-primary">Rs {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full h-16 rounded-full font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 mb-6"
                            >
                                {isProcessing ? "Processing..." : "Purchase with 1-Click"}
                            </Button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    Encrypted Transaction
                                </div>
                                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    Secure Apple Pay & Stripe
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
