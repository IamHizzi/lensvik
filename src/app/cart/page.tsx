"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart, Trash2, Plus, Minus, ShieldCheck,
    MapPin, Phone, User, Truck, ArrowRight, Package, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";

const PAKISTANI_CITIES = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
    "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
    "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur",
];

const inputClass = "w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all font-medium text-slate-800 placeholder:text-slate-400";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "", phone: "", email: "", city: "", address: "",
    });

    const handleField = (key: string, val: string) =>
        setFormData((f) => ({ ...f, [key]: val }));

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
            toast.error("Please fill in all shipping details"); return;
        }
        if (!/^((\+92)|(0092)|(0))3\d{9}$/.test(formData.phone)) {
            toast.error("Please enter a valid Pakistani phone number"); return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            toast.success("Order Placed! We'll call you to confirm.");
            clearCart();
            setIsProcessing(false);
        }, 2000);
    };

    /* ── Empty state ── */
    if (cart.length === 0) {
        return (
            <main className="min-h-screen bg-background pt-36 md:pt-44">
                <Navbar />
                <div className="container mx-auto px-4 flex flex-col items-center text-center py-24">
                    <div className="w-20 h-20 bg-primary/8 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/10">
                        <ShoppingCart className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter mb-2 italic uppercase">Your cart is empty</h1>
                    <p className="text-sm text-slate-400 mb-8 font-medium">Add some eyewear to get started.</p>
                    <Link href="/collections">
                        <Button className="rounded-full h-11 px-8 font-bold text-sm bg-primary hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fafafa] pt-36 md:pt-44">
            <Navbar />

            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
                {/* Page header */}
                <div className="mb-6 md:mb-10">
                    <h1 className="text-2xl md:text-4xl font-black tracking-tighter italic uppercase text-slate-900">Checkout</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-10 h-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {cart.length} item{cart.length !== 1 ? "s" : ""} · Cash on Delivery
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 md:gap-8 items-start">

                    {/* ── LEFT: Shipping Form ── */}
                    <form onSubmit={handleCheckout}>
                        <section className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm p-5 md:p-8">
                            <h2 className="font-black text-base md:text-lg uppercase tracking-tight italic text-slate-900 mb-5 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-primary" /> Shipping Details
                            </h2>

                            <div className="space-y-4">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className={`${inputClass} pl-10`}
                                            value={formData.fullName}
                                            onChange={(e) => handleField("fullName", e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Phone + City */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                type="tel"
                                                placeholder="03XX XXXXXXX"
                                                required
                                                className={`${inputClass} pl-10`}
                                                value={formData.phone}
                                                onChange={(e) => handleField("phone", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                list="pk-cities"
                                                placeholder="Select City"
                                                required
                                                className={`${inputClass} pl-10`}
                                                value={formData.city}
                                                onChange={(e) => handleField("city", e.target.value)}
                                            />
                                            <datalist id="pk-cities">
                                                {PAKISTANI_CITIES.map((c) => <option key={c} value={c} />)}
                                            </datalist>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Full Address</label>
                                    <textarea
                                        placeholder="House no., Street, Area..."
                                        required
                                        rows={3}
                                        className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 transition-all font-medium text-slate-800 resize-none placeholder:text-slate-400"
                                        value={formData.address}
                                        onChange={(e) => handleField("address", e.target.value)}
                                    />
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2.5">Payment Method</p>
                                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                                            <Package className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black italic text-slate-800">Cash on Delivery (COD)</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Pay when you receive your package</p>
                                        </div>
                                        <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop submit */}
                            <div className="mt-6 hidden md:block">
                                <Button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full h-13 rounded-2xl font-black uppercase tracking-widest text-sm bg-gradient-to-r from-primary to-slate-900 hover:from-primary/90 hover:to-slate-900/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isProcessing ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Place Order (COD)
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </Button>

                                <div className="flex items-center justify-center gap-5 mt-4">
                                    {[
                                        { icon: ShieldCheck, label: "100% Authentic" },
                                        { icon: Truck, label: "Free Delivery" },
                                        { icon: ShieldCheck, label: "Easy Returns" },
                                    ].map(({ icon: Icon, label }) => (
                                        <div key={label} className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-widest text-slate-400">
                                            <Icon className="w-3.5 h-3.5 text-emerald-500" />{label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </form>

                    {/* ── RIGHT: Order Summary ── */}
                    <div className="space-y-4">
                        <section className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm p-5 md:p-7">
                            <h2 className="font-black text-base md:text-lg uppercase tracking-tight italic text-slate-900 mb-5">
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-0.5 mb-5 custom-scrollbar">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -40, height: 0 }}
                                            className="flex gap-3 items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 group"
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-14 h-14 md:w-16 md:h-16 relative rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" sizes="64px" />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black uppercase tracking-tight text-slate-800 truncate">{item.name}</p>
                                                {item.prescription && (
                                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                                        <span className="text-[7px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase">{item.prescription.lensCategory.name}</span>
                                                        <span className="text-[7px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full font-black uppercase">{item.prescription.lensType.name}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mt-1.5 gap-2">
                                                    <p className="text-xs font-black text-primary">Rs {item.price.toLocaleString()}</p>

                                                    {/* Qty controls */}
                                                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Totals */}
                            <div className="pt-4 border-t border-slate-100 space-y-2.5">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-slate-800">Rs {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Shipping (Nationwide)</span>
                                    <span className="text-emerald-600">FREE</span>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-sm font-black italic tracking-tight text-slate-900">Total</span>
                                    <div className="text-right">
                                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Pay on Delivery</p>
                                        <p className="text-xl md:text-2xl font-black text-primary">Rs {cartTotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* WhatsApp order option */}
                        <a
                            href={`https://wa.me/923709573005?text=Hi, I'd like to order: ${cart.map(i => `${i.name} x${i.quantity}`).join(", ")}. Total: Rs ${cartTotal.toLocaleString()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl px-5 py-4 hover:bg-[#25D366]/15 transition-colors group"
                        >
                            <div className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
                                <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-black uppercase tracking-wide text-slate-800">Order via WhatsApp</p>
                                <p className="text-[10px] text-slate-400 font-medium">Prefer chatting? We'll help you place the order.</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </a>
                    </div>
                </div>
            </div>

            {/* ── Mobile Sticky Checkout Bar ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
                        <p className="text-lg font-black text-primary leading-tight">Rs {cartTotal.toLocaleString()}</p>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="h-12 px-6 rounded-2xl bg-gradient-to-r from-primary to-slate-900 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 shrink-0"
                    >
                        {isProcessing ? (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Place Order <ArrowRight className="w-3.5 h-3.5 ml-1" /></>
                        )}
                    </Button>
                </div>
            </div>
            {/* Mobile spacing for sticky bar */}
            <div className="h-28 md:hidden" />
            <Footer />
        </main>
    );
}
