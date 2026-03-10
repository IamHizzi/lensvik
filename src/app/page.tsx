"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductStrip } from "@/components/home/ProductStrip";
import { motion } from "framer-motion";
import Link from "next/link";
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

      <TrustBadges />

      {/* Mid-Page Banner (Call to Action) */}
      <section className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="rounded-xl md:rounded-2xl p-5 md:p-10 text-center relative overflow-hidden shadow-xl h-[240px] md:h-[280px] flex flex-col items-center justify-center">
          <img
            src="/images/WhatsApp-Image-2026-01-24-at-2.52.35-PM.jpeg"
            alt="Fit Guarantee"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

          <div className="relative z-10 px-4">
            <h2 className="text-xl md:text-3xl font-bold tracking-tighter mb-3 md:mb-4 text-white">Find Your Perfect Fit <br /> in Seconds.</h2>
            <p className="text-xs md:text-sm text-white/80 mb-5 md:mb-8 max-w-xl mx-auto font-medium">
              Stop guessing your size. Use our AI-powered biometric scanner to find the frame that actually fits your face.
            </p>
            <Link href="/products/1">
              <button className="h-11 md:h-12 px-6 md:px-10 rounded-full bg-white text-primary font-bold text-sm hover:scale-105 transition-transform shadow-xl">
                Launch Size Finder
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-10 mb-4 md:mb-6 border-t border-border">
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
