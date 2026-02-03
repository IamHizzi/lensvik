"use client";

import { Truck, ShieldCheck, RefreshCcw, Headset } from "lucide-react";
import { motion } from "framer-motion";

export function TrustBadges() {
    const badges = [
        {
            icon: Truck,
            title: "Free Shipping",
            description: "On all orders over Rs 15,000"
        },
        {
            icon: ShieldCheck,
            title: "Secure Checkout",
            description: "100% protected payments"
        },
        {
            icon: RefreshCcw,
            title: "Easy Returns",
            description: "30-day hassle-free policy"
        },
        {
            icon: Headset,
            title: "24/7 Support",
            description: "Dedicated expert help"
        }
    ];

    return (
        <section className="bg-primary/5 py-16 border-y border-primary/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 bg-white/50 p-6 rounded-2xl glass border border-white/40"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <badge.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-wider">{badge.title}</h4>
                                <p className="text-xs text-muted-foreground italic">{badge.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
