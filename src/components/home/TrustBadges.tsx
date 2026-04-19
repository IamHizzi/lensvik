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
        <section className="bg-primary/5 py-8 md:py-10 border-y border-primary/10">
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-3 bg-white/50 p-3 md:p-4 rounded-xl glass border border-white/40"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <badge.icon className="w-5 h-5" />
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
