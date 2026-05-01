"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("ceo");
  const [loading, setLoading] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const typeText = async (text: string) => {
    let i = 0;
    setResult("");

    const interval = setInterval(() => {
      setResult((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 10);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleSubmit = async () => {
    if (!input) return;

    setLoading(true);
    setResult("");

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input, mode }),
    });

    const data = await res.json();

    await typeText(data.result);

    setLoading(false);
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute w-[600px] h-[600px] bg-red-500 opacity-20 blur-[200px] rounded-full top-[-200px] left-[-200px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-red-700 opacity-20 blur-[180px] rounded-full bottom-[-200px] right-[-200px] animate-pulse"></div>

      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 flex justify-between items-center px-10 py-6 border-b border-zinc-800 transition-all ${scrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-transparent"
          }`}
      >

        {/* LOGO */}
        <Image
          src="/7.png"
          alt="Jen AI Logo"
          width={200}
          height={40}
          className="object-contain"
        />

        <div className="flex gap-6 text-sm text-zinc-400">
          {/* <a href="#about" className="hover:text-red-400 font-[ZenSerif]">About</a> */}
          <a href="https://github.com/naylamutiara03" target="_blank" className="hover:text-red-400 font-[ZenSerif]">
            GitHub
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 px-10 py-20 items-center relative z-10">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl leading-tight font-[ZenSerif]">
            You don’t need more noise.
            <span className="text-red-500 block mt-2">
              You need precision.
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 max-w-md">
            Jen refines your thinking, sharpens decisions, and elevates strategy.
          </p>

          {/* MODE */}
          <div className="mt-6 flex gap-3">
            {["savage", "ceo", "soft"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg border transition ${mode === m
                  ? "bg-red-600 border-red-600"
                  : "border-zinc-700 text-zinc-400"
                  }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div className="mt-8 relative">

            {/* TEXTAREA */}
            <textarea
              className="w-full p-4 pr-12 bg-zinc-900 border border-red-500 rounded-xl"
              placeholder="Tell Jen your situation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* CLEAR INPUT BUTTON */}
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute top-3 right-3 text-zinc-400 hover:text-red-500"
              >
                ✕
              </button>
            )}

            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          style={{
            transform: `translate(${mouse.x}px, ${mouse.y}px)`,
          }}
          className="relative flex justify-center"
        >
          <div className="absolute w-80 h-80 bg-red-500 blur-[140px] opacity-30 rounded-full"></div>

          <Image
            src="/jennie3.jpg"
            alt="Jen AI"
            width={400}
            height={500}
            className="rounded-2xl shadow-2xl relative z-10"
          />
        </motion.div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="px-10 animate-pulse space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-800 rounded w-2/4"></div>
          <div className="h-4 bg-zinc-800 rounded w-full"></div>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-10 pb-20"
        >
          <div className="p-8 bg-zinc-900 rounded-2xl border border-red-500">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-red-400">
                Jen’s Insight
              </h2>

              <button
                onClick={handleClear}
                className="text-zinc-400 hover:text-red-500 text-sm"
              >
                ✕ Clear
              </button>
            </div>

            {/* 🔥 INI YANG KAMU KURANG */}
            <div className="whitespace-pre-line text-zinc-300 leading-relaxed">
              {result}
            </div>

          </div>
        </motion.section>
      )}

      {/* ABOUT */}
      <section id="about" className="px-10 pb-20">
        <h2 className="text-3xl font-bold text-red-500 mb-4 font-[ZenSerif]">About Jen</h2>
        <p className="text-zinc-400 max-w-xl">
          Jen is a refined AI strategist built for clarity and precision.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 px-10 py-10 text-zinc-400">

        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* LEFT - CONTACT */}
          <div className="space-y-3 text-sm font-[ZenSerif]">

            <div className="flex items-center gap-3">
              <span>📧</span>
              <p>naylamsb03@gmail.com</p>
            </div>

            <div className="flex items-center gap-3">
              <span>📱</span>
              <p>+6285930247131</p>
            </div>

            <div className="flex items-center gap-3">
              <span>📸</span>
              <p>@naylamsb</p>
            </div>

          </div>

          {/* RIGHT - LOGO */}
          <div className="flex justify-start md:justify-end">
            <Image
              src="/8.png"
              alt="Jen AI Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-10 border-t border-zinc-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">

          <p>© 2026 Jen AI</p>

          <p className="italic">
            Inspired by Jennie Blackpink
          </p>

        </div>

      </footer>

    </main>
  );
}