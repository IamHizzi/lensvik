"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ShieldCheck, MapPin, Phone, User, Truck, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

const PAKISTANI_CITIES = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur"
];

export default function CheckoutPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        address: ""
    });

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
            toast.error("Please fill in all shipping details");
            return;
        }

        if (!/^((\+92)|(0092)|(0))3\d{9}$/.test(formData.phone)) {
            toast.error("Please enter a valid Pakistani phone number");
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            toast.success("Order Placed Successfully! We will call you for verification.");
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
                    <h1 className="text-4xl font-black tracking-tighter mb-4 italic">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8 font-medium">Looks like you haven't added anything to your cart yet.</p>
                    <Link href="/collections">
                        <Button className="rounded-full h-14 px-10 font-black text-lg bg-primary hover:scale-105 transition-transform italic">Start Shopping</Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-24">
            <Navbar />
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col mb-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Checkout</h1>
                    <div className="w-24 h-2 bg-primary mt-4 rounded-full" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* LEFT: Shipping Details Form */}
                    <div className="space-y-10">
                        <section className="glass p-8 md:p-12 rounded-[3.5rem] border border-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Truck className="w-32 h-32 text-primary" />
                            </div>

                            <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3 italic">
                                <MapPin className="text-primary w-8 h-8" />
                                Shipping Details
                            </h2>

                            <form className="space-y-6" onSubmit={handleCheckout}>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className="w-full h-14 rounded-2xl bg-white border border-border pl-12 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                type="tel"
                                                placeholder="03XX XXXXXXX"
                                                required
                                                className="w-full h-14 rounded-2xl bg-white border border-border pl-12 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                list="pk-cities"
                                                placeholder="Select City"
                                                required
                                                className="w-full h-14 rounded-2xl bg-white border border-border pl-12 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            />
                                            <datalist id="pk-cities">
                                                {PAKISTANI_CITIES.map(city => <option key={city} value={city} />)}
                                            </datalist>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-2">Full Shipping Address</label>
                                    <textarea
                                        placeholder="House number, Street, Area..."
                                        required
                                        rows={4}
                                        className="w-full rounded-2xl bg-white border border-border p-6 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium resize-none"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="pt-6">
                                    <h3 className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground mb-4">Payment Method</h3>
                                    <div className="p-6 rounded-[2rem] border-2 border-primary bg-primary/5 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg italic">Cash on Delivery (COD)</p>
                                                <p className="text-xs text-muted-foreground font-medium">Pay when you receive your package</p>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="space-y-8">
                        <section className="bg-slate-50 p-8 md:p-12 rounded-[3.5rem] border border-border relative">
                            <h2 className="text-3xl font-black tracking-tight mb-8 italic">Order Summary</h2>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="flex gap-4 items-center p-4 bg-white rounded-3xl border border-border shadow-sm group"
                                        >
                                            <div className="w-20 h-20 relative rounded-2xl overflow-hidden bg-slate-100 border border-border shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{item.name}</h3>
                                                {item.prescription && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase">{item.prescription.lensCategory.name}</span>
                                                        <span className="text-[8px] bg-slate-100 text-muted-foreground px-1.5 py-0.5 rounded font-black uppercase">{item.prescription.lensType.name}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-xs font-black text-primary italic">Rs {item.price.toLocaleString()}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost" size="icon" className="w-6 h-6 rounded-full"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost" size="icon" className="w-6 h-6 rounded-full"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost" size="icon"
                                                className="text-destructive hover:bg-destructive/10 rounded-full shrink-0"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-4 pt-8 border-t border-border">
                                <div className="flex justify-between text-muted-foreground font-bold text-xs uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-foreground">Rs {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground font-bold text-xs uppercase tracking-widest">
                                    <span>Shipping (Nationwide)</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <div className="h-[2px] bg-primary/10 my-6" />
                                <div className="flex justify-between items-end">
                                    <span className="text-xl font-black italic tracking-tighter">Net Total</span>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Pay on Delivery</p>
                                        <p className="text-5xl font-black text-primary font-sans italic tracking-tighter">Rs {cartTotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full h-20 rounded-full font-black text-xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 mt-10 hover:scale-[1.02] transition-all italic active:scale-95 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                {isProcessing ? "Processing..." : "Place Order (COD)"}
                                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Button>

                            <div className="mt-8 flex items-center justify-center gap-6 p-4 bg-white/50 rounded-2xl border border-white/50">
                                <div className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-widest text-muted-foreground">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    100% Authentic
                                </div>
                                <div className="w-[1px] h-4 bg-border" />
                                <div className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-widest text-muted-foreground">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    Easy Returns
                                </div>
                                <div className="w-[1px] h-4 bg-border" />
                                <div className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-widest text-muted-foreground">
                                    <Truck className="w-4 h-4 text-green-500" />
                                    Fast Delivery
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
