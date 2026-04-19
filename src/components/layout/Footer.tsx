"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
    Facebook, Instagram, Twitter, Mail, Phone,
    MapPin, MessageCircle, ArrowRight, CheckCircle2
} from "lucide-react";

const FOOTER_NAV = {
    Shop: [
        { name: "All Eyewear", href: "/collections" },
        { name: "Eyeglasses",  href: "/category/eyeglasses" },
        { name: "Sunglasses",  href: "/category/sunglasses" },
        { name: "Blue Light",  href: "/category/eyeglasses" },
        { name: "NextGen Collection", href: "/category/nextgen" },
    ],
    Support: [
        { name: "Track My Order",  href: "/track-order" },
        { name: "Return Policy",   href: "/return-policy" },
        { name: "FAQs",            href: "/faqs" },
        { name: "About Lensvik",   href: "/about" },
        { name: "Contact Us",      href: "/contact" },
    ],
};

const SOCIALS = [
    { icon: Facebook,       href: "#",                          label: "Facebook",  ring: "hover:bg-[#1877F2]" },
    { icon: Instagram,      href: "#",                          label: "Instagram", ring: "hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600" },
    { icon: Twitter,        href: "#",                          label: "Twitter",   ring: "hover:bg-[#1DA1F2]" },
    { icon: MessageCircle,  href: "https://wa.me/923709573005", label: "WhatsApp",  ring: "hover:bg-[#25D366]", external: true },
];

const CERTS = ["UV400 Verified", "ISO Certified", "CE Compliant"];

export function Footer() {
    const [email, setEmail]       = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="bg-white border-t border-slate-100 relative z-10">

            {/* ── Newsletter Banner ── */}
            <div className="border-b border-slate-100 bg-white">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                        <div className="text-center md:text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">
                                Exclusive Access
                            </p>
                            <h3 className="text-lg md:text-2xl font-black italic uppercase tracking-tight text-slate-900 leading-tight">
                                Get 10% off your first order
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 font-medium hidden md:block">
                                Join 12,000+ Lensvik subscribers for drops, offers and lens tips.
                            </p>
                        </div>

                        {subscribed ? (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                                    You're subscribed!
                                </span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto max-w-sm">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary/50 transition-all min-w-0"
                                />
                                <button
                                    type="submit"
                                    className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95"
                                >
                                    Join <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-14">

                    {/* Brand column — spans full width on mobile */}
                    <div className="col-span-2 md:col-span-1 space-y-5">
                        <Link href="/">
                            <Image
                                src="/logo-1.png"
                                alt="Lensvik"
                                width={300}
                                height={100}
                                className="h-20 md:h-28 w-auto object-contain opacity-100"
                            />
                        </Link>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-[220px]">
                            Redefining eyewear with AI precision — from prescription to doorstep.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-2">
                            {SOCIALS.map(({ icon: Icon, href, label, ring, external }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    className={`w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-white ${ring} hover:border-transparent transition-all hover:scale-110`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </Link>
                            ))}
                        </div>

                        {/* Certs */}
                        <div className="flex flex-wrap gap-2">
                            {CERTS.map(c => (
                                <span key={c} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-primary/60" />{c}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Nav columns */}
                    {Object.entries(FOOTER_NAV).map(([heading, links]) => (
                        <div key={heading}>
                            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-primary mb-4 md:mb-5">
                                {heading}
                            </h4>
                            <ul className="space-y-2.5 md:space-y-3">
                                {links.map(link => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-xs text-slate-500 hover:text-primary transition-colors font-medium leading-none"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact column */}
                    <div>
                        <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-primary mb-4 md:mb-5">
                            Contact
                        </h4>
                        <div className="space-y-3">
                            <a href="tel:+923709573005" className="flex items-start gap-2.5 group">
                                <Phone className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                <span className="text-xs text-slate-500 group-hover:text-primary transition-colors font-medium">0370 9573005</span>
                            </a>
                            <a href="mailto:Lensvikoptics@gmail.com" className="flex items-start gap-2.5 group">
                                <Mail className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                <span className="text-xs text-slate-500 group-hover:text-primary transition-colors font-medium break-all">Lensvikoptics@gmail.com</span>
                            </a>
                            <Link
                                href="https://wa.me/923709573005"
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-start gap-2.5 group"
                            >
                                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] mt-0.5 shrink-0" />
                                <span className="text-xs text-[#25D366]/70 group-hover:text-[#25D366] transition-colors font-medium">WhatsApp Us</span>
                            </Link>
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                                <span className="text-xs text-slate-400 font-medium leading-relaxed">
                                    Shop 1, Ground Floor,<br />Umar Centre, F-8 Markaz,<br />Islamabad
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Bar ── */}
                <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-slate-400 font-medium order-2 sm:order-1">
                        © {new Date().getFullYear()} LENSVIK Eyewear · All rights reserved.
                    </p>

                    {/* Payment icons */}
                    <div className="flex items-center gap-4 order-1 sm:order-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
                        {[
                            { src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",         alt: "Visa",       h: "h-3.5" },
                            { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",        alt: "Mastercard", h: "h-5" },
                            { src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",                 alt: "PayPal",     h: "h-4" },
                            { src: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Apple_Pay_logo.svg",         alt: "Apple Pay",  h: "h-5" },
                        ].map(p => (
                            <img key={p.alt} src={p.src} alt={p.alt} className={`${p.h}`} />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
