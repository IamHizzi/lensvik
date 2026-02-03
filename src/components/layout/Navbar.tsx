"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function Navbar() {
    const { cartCount } = useCart();

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
            {/* Top Bar - Mini Nav */}
            <div className="bg-primary text-white py-2 px-6 hidden md:block text-[11px] font-bold uppercase tracking-widest text-center">
                Free Shipping on All Orders Over Rs 15,000 | Use Code LENSVIK10 for 10% OFF
            </div>

            {/* Main Navbar */}
            <nav className="glass border-b border-white/20 px-6 py-4 flex flex-col gap-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold text-primary tracking-tighter">
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

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <User className="w-5 h-5" />
                        </Button>
                        <Link href="/checkout">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Navigation Menu */}
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
        </header>
    );
}
