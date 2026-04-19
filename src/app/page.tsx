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



      <Footer />
    </main>
  );
}
