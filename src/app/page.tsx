"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductStrip } from "@/components/home/ProductStrip";
import { motion } from "framer-motion";
import Link from "next/link";
import { SAMPLE_PRODUCTS } from "@/data/products";

export default function Home() {
  const FEATURED_PRODUCTS = SAMPLE_PRODUCTS.slice(0, 4);
  const TRENDING_PRODUCTS = [...SAMPLE_PRODUCTS].reverse().slice(0, 4);
  const NEW_ARRIVALS = SAMPLE_PRODUCTS.slice(-4).reverse();

  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <TrustBadges />
      <CategoryGrid />

      <ProductStrip
        title="Featured Selection"
        subtitle="Handpicked eyewear for the modern visionary. Discover our most loved styles."
        products={FEATURED_PRODUCTS}
        viewAllHref="/collections/featured"
      />

      {/* Mid-Page Banner (Call to Action) */}
      <section className="container mx-auto px-6 py-12">
        <div className="rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl h-[400px] flex flex-col items-center justify-center">
          <img
            src="/images/WhatsApp-Image-2026-01-24-at-2.52.35-PM.jpeg"
            alt="Fit Guarantee"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-white">Find Your Perfect Fit <br /> in Seconds.</h2>
            <p className="text-lg text-white/80 mb-12 max-w-xl mx-auto font-medium">
              Stop guessing your size. Use our AI-powered biometric scanner to find the frame that actually fits your face.
            </p>
            <Link href="/products/1">
              <button className="h-16 px-12 rounded-full bg-white text-primary font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                Launch Size Finder
              </button>
            </Link>
          </div>
        </div>
      </section>

      <ProductStrip
        title="Trending Collections"
        subtitle="Stay ahead of the curve with our latest designer-inspired frames."
        products={TRENDING_PRODUCTS}
        viewAllHref="/collections/trending"
        lightBg
      />

      <ProductStrip
        title="New Arrivals"
        subtitle="Fresh from the workshop. Explore our newest materials and color palettes."
        products={NEW_ARRIVALS}
        viewAllHref="/collections/new-arrivals"
      />

      {/* Newsletter Section */}
      <section className="container mx-auto px-6 py-24 mb-12 border-t border-border">
        <div className="glass rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-primary/10">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Join the Lensvik Vision</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            Get 10% off your first order and stay updated with our latest drops.
          </p>
          <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-16 px-8 rounded-full bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 min-w-[300px]"
            />
            <button className="h-16 px-12 rounded-full bg-primary text-white font-bold hover:opacity-90 transition-opacity shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
