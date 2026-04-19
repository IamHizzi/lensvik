"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductStrip } from "@/components/home/ProductStrip";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getProducts, Product } from "@/lib/api";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const FEATURED_PRODUCTS = products.slice(0, 4);
  const TRENDING_PRODUCTS = [...products].reverse().slice(0, 4);
  const NEW_ARRIVALS = products.slice(-4).reverse();

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <CategoryGrid />

      <ProductStrip
        title="Featured Selection"
        subtitle="Handpicked eyewear for the modern visionary. Discover our most loved styles."
        products={FEATURED_PRODUCTS}
        viewAllHref="/collections/featured"
        loading={loading}
      />

      <ProductStrip
        title="Trending Collections"
        subtitle="Stay ahead of the curve with our latest designer-inspired frames."
        products={TRENDING_PRODUCTS}
        viewAllHref="/collections/trending"
        lightBg
        loading={loading}
      />

      <ProductStrip
        title="New Arrivals"
        subtitle="Fresh from the workshop. Explore our newest materials and color palettes."
        products={NEW_ARRIVALS}
        viewAllHref="/collections/new-arrivals"
        loading={loading}
      />

      <WhyChooseUs />

      <TrustBadges />

      <Testimonials />

      {/* Mid-Page Banner (Call to Action) */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="rounded-2xl md:rounded-3xl p-6 md:p-12 text-center relative overflow-hidden shadow-2xl h-[280px] md:h-[350px] flex flex-col items-center justify-center group overflow-hidden">
          <Image
            src="/images/WhatsApp-Image-2026-01-24-at-2.52.35-PM.jpeg"
            alt="Fit Guarantee"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

          <div className="relative z-10 px-2 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-5xl font-black tracking-tighter mb-4 text-white uppercase italic leading-none">
              Find Your <br /> Perfect Fit.
            </h2>
            <p className="text-xs md:text-lg text-white/90 mb-6 md:mb-10 max-w-lg mx-auto font-medium leading-relaxed">
              Stop guessing your size. Use our AI-powered biometric scanner to find the frame that actually fits your face.
            </p>
            <Link href="/products/1">
              <button className="h-12 md:h-14 px-8 md:px-12 rounded-full bg-white text-primary font-black uppercase text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl italic tracking-widest">
                Launch Size Finder
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-10 mb-4 md:mb-6 border-t border-border">
        <div className="glass rounded-xl md:rounded-2xl p-5 md:p-10 text-center relative overflow-hidden border border-primary/10">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
          <h2 className="text-xl md:text-3xl font-bold tracking-tighter mb-2 md:mb-3">Join the Lensvik Vision</h2>
          <p className="text-xs md:text-sm text-muted-foreground mb-5 md:mb-8 max-w-xl mx-auto">
            Get 10% off your first order and stay updated with our latest drops.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-11 md:h-12 px-5 md:px-6 rounded-full bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 w-full text-sm"
            />
            <button className="h-11 md:h-12 px-6 md:px-10 rounded-full bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
