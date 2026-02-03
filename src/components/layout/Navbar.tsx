"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function Navbar() {
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/collections" },
        { name: "Sunglasses", href: "/category/sunglasses" },
        { name: "Prescription", href: "/category/prescription" },
        { name: "Blue Light", href: "/category/blue-light" },
        { name: "Kids", href: "/category/kids" },
        { name: "Accessories", href: "/category/accessories" },
    ];

    const secondaryItems = [
        { name: "About Us", href: "/about" },
        { name: "Track Order", href: "/track-order" },
        { name: "Returns", href: "/return-policy" },
    ];

    return (
        <header className="fixed top-0 w-full z-50">
            {/* Top Bar - Mini Nav (Hidden on small screens) */}
            <div className="bg-primary text-white py-2 px-6 hidden md:block text-[11px] font-bold uppercase tracking-widest text-center">
                Free Shipping on All Orders Over Rs 15,000 | Use Code LENSVIK10 for 10% OFF
            </div>

            {/* Main Navbar */}
            <nav className="glass border-b border-white/20 px-4 md:px-6 py-3 md:py-4 flex flex-col gap-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-xl md:text-2xl font-bold text-primary tracking-tighter">
                            LENSVIK
                        </Link>

                        {/* Secondary Links (Hidden on small screens) */}
                        <div className="hidden lg:flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 border-l border-border pl-4">
                            {secondaryItems.map((item) => (
                                <Link key={item.name} href={item.href} className="hover:text-primary transition-colors italic">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="icon" className="w-9 h-9 md:w-10 md:h-10">
                            <User className="w-5 h-5" />
                        </Button>
                        <Link href="/checkout">
                            <Button variant="ghost" size="icon" className="relative w-9 h-9 md:w-10 md:h-10">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] md:text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden w-9 h-9"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Navigation Menu (Desktop) */}
                <div className="hidden md:flex items-center justify-center gap-8 py-1 border-t border-white/10">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-[12px] font-bold uppercase tracking-widest hover:text-primary transition-all relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-xl transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="text-xl font-bold text-primary tracking-tighter" onClick={() => setIsMenuOpen(false)}>
                            LENSVIK
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="flex flex-col gap-6 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-black uppercase tracking-widest text-primary border-b border-primary/5 pb-4"
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="mt-8 pt-8 border-t border-border space-y-4">
                            {secondaryItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-sm font-bold uppercase tracking-widest text-muted-foreground italic"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Support</p>
                            <p className="text-sm font-black text-primary">Need help? 24/7 Hotline</p>
                            <p className="text-lg font-black text-primary/80">+92 300 0000000</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
