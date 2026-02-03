"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
    const footerLinks = {
        shop: [
            { name: "New Arrivals", href: "/collections/new-arrivals" },
            { name: "Best Sellers", href: "/collections/best-sellers" },
            { name: "Sunglasses", href: "/category/sunglasses" },
            { name: "Prescription", href: "/category/prescription" },
            { name: "Blue Light", href: "/category/blue-light" },
        ],
        support: [
            { name: "Track Order", href: "/track-order" },
            { name: "Shipping Policy", href: "/shipping" },
            { name: "Return Policy", href: "/return-policy" },
            { name: "FAQs", href: "/faqs" },
            { name: "Contact Us", href: "/contact" },
        ],
        about: [
            { name: "Our Story", href: "/about" },
            { name: "Blog", href: "/blog" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
        ]
    };

    return (
        <footer className="bg-background border-t border-border pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="text-3xl font-bold text-primary tracking-tighter">
                            LENSVIK
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            Redefining eyewear with AI-powered precision. Find your perfect fit effortlessly with our advanced virtual try-on technology.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-primary">Shop</h4>
                        <ul className="flex flex-col gap-4">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-primary">Customer Care</h4>
                        <ul className="flex flex-col gap-4">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-primary">Join the Vision</h4>
                            <p className="text-sm text-muted-foreground mb-4">Subscribe for exclusive updates and early access to new collections.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-2 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <Button className="px-6">Join</Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+1 (888) LENSVIK</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>support@lensvik.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>123 Vision Way, Eye City, EC 45678</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LENSVIK Eyewear. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
