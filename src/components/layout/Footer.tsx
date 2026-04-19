"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
    const footerLinks = {
        shop: [
            { name: "New Arrivals", href: "/collections/new-arrivals" },
            { name: "Best Sellers", href: "/collections/best-sellers" },
            { name: "Sunglasses", href: "/category/sunglasses" },
            { name: "Blue Light", href: "/category/blue-light" },
        ],
        support: [
            { name: "Track Order", href: "/track-order" },
            { name: "Shipping Policy", href: "/shipping" },
            { name: "Return Policy", href: "/return-policy" },
            { name: "FAQs", href: "/faqs" },
            { name: "Contact Us", href: "/contact" },
        ],
    };

    return (
        <footer className="bg-background border-t border-border pt-8 md:pt-14 pb-6 md:pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10">
                    {/* Brand Info */}
                    <div className="flex flex-col gap-3 md:gap-4 items-center md:items-start text-center md:text-left">
                        <Link href="/" className="flex items-center">
                            <Image src="/logo-1.png" alt="Lensvik" width={180} height={85} className="h-10 md:h-12 w-auto object-contain" />
                        </Link>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                            Redefining eyewear with AI-powered precision. Find your perfect fit effortlessly with our advanced virtual try-on technology.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://wa.me/923709573005"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-green-200 bg-green-50 flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all text-green-600"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4 uppercase tracking-widest text-primary">Shop</h4>
                        <ul className="flex flex-col gap-2 md:gap-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4 uppercase tracking-widest text-primary">Customer Care</h4>
                        <ul className="flex flex-col gap-2 md:gap-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="flex flex-col gap-4 md:gap-5">
                        <div>
                            <h4 className="font-bold text-sm md:text-base mb-3 md:mb-4 uppercase tracking-widest text-primary">Join the Vision</h4>
                            <p className="text-xs md:text-sm text-muted-foreground mb-3">Subscribe for exclusive updates and early access to new collections.</p>
                             <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-3 md:py-2 text-sm rounded-xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <Button className="px-6 h-11 md:h-10 text-sm font-black uppercase italic rounded-xl">Join</Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <a href="tel:+923709573005" className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>0370 9573005</span>
                            </a>
                            <a href="mailto:Lensvikoptics@gmail.com" className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span>Lensvikoptics@gmail.com</span>
                            </a>
                            <Link
                                href="https://wa.me/923709573005"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-xs md:text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
                            >
                                <MessageCircle className="w-4 h-4 shrink-0" />
                                <span>WhatsApp: 0370 9573005</span>
                            </Link>
                            <div className="flex items-start gap-3 text-xs md:text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>Shop 1, Ground Floor, Umar Centre,<br />F-8 Markaz, Islamabad</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LENSVIK Eyewear. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
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
