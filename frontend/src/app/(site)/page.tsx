"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Header from "@/sections/Header";
import Features from "@/sections/Features";
import Faq from "@/sections/Faq";

export default function Home() {
  return (
    <main>
      <div className="bg-[#0D121F] text-white">
        <Navbar />
        <Header />
      </div>
      <Features />
      <Faq />
      <Footer />
    </main>
  );
}
