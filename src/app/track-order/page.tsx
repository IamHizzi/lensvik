"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Search, Package, MapPin, CheckCircle2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrackOrderPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <section className="pt-28 md:pt-36 pb-8 container mx-auto px-6">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10 md:mb-16"
                    >
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 italic uppercase">Track Your Order</h1>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">
                            Enter your order details below to see the current status of your shipment.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-primary/5 glass relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[80px]" />

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Order ID / Tracking Number</label>
                                <div className="relative">
                                    <Package className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                                    <input
                                        type="text"
                                        placeholder="e.g. LV-12345678"
                                        className="w-full h-12 pl-14 pr-6 rounded-xl bg-primary/5 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-primary ml-1">Email Address</label>
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full h-12 pl-14 pr-6 rounded-xl bg-primary/5 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                                Track My Shipment
                            </Button>
                        </div>
                    </motion.div>

                    {/* Features/Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold mb-2">Order Processed</h4>
                            <p className="text-sm text-muted-foreground">Expertly crafted and quality checked.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold mb-2">In Transit</h4>
                            <p className="text-sm text-muted-foreground">On its way to your doorstep.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold mb-2">Delivered</h4>
                            <p className="text-sm text-muted-foreground">Seeing the world in high definition.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
