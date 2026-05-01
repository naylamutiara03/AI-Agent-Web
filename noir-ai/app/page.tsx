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

  // PARALLAX MOUSE
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

  // TYPING EFFECT
  const typeText = async (text: string) => {
    let i = 0;
    setResult("");

    const interval = setInterval(() => {
      setResult((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 10);
  };

  // VOICE AI
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    speechSynthesis.speak(utterance);
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
    speak(data.result);

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-red-500 opacity-20 blur-[200px] rounded-full top-[-200px] left-[-200px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-red-700 opacity-20 blur-[180px] rounded-full bottom-[-200px] right-[-200px] animate-pulse"></div>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-zinc-800 relative z-10">
        <h1 className="text-2xl font-bold text-red-500 tracking-widest">
          NOIR.AI
        </h1>

        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="#about" className="hover:text-red-400">About</a>
          <a href="https://github.com/naylamutiara03" target="_blank" className="hover:text-red-400">
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
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Most people ask AI for answers.
            <span className="text-red-500 block mt-2">
              You came here for judgment.
            </span>
          </h1>

          <p className="mt-6 text-zinc-400 max-w-md">
            Noir doesn’t assist you. She challenges you.
          </p>

          {/* MODE */}
          <div className="mt-6 flex gap-3">
            {["savage", "ceo", "soft"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg border ${
                  mode === m
                    ? "bg-red-600 border-red-600"
                    : "border-zinc-700 text-zinc-400"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div className="mt-8">
            <textarea
              className="w-full p-4 bg-zinc-900 border border-red-500 rounded-xl"
              placeholder="Tell Noir your situation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE (PARALLAX) */}
        <motion.div
          style={{
            transform: `translate(${mouse.x}px, ${mouse.y}px)`,
          }}
          className="relative flex justify-center"
        >
          <div className="absolute w-80 h-80 bg-red-500 blur-[140px] opacity-30 rounded-full"></div>

          <Image
            src="/like-jennie.jpg"
            alt="Noir AI"
            width={400}
            height={500}
            className="rounded-2xl shadow-2xl relative z-10"
          />
        </motion.div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="px-10 animate-pulse space-y-3 relative z-10">
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
          className="px-10 pb-20 relative z-10"
        >
          <div className="p-8 bg-zinc-900 rounded-2xl border border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
            <h2 className="text-xl font-semibold mb-4 text-red-400">
              Noir’s Judgment
            </h2>

            <div className="whitespace-pre-line text-zinc-300">
              {result}
            </div>
          </div>
        </motion.section>
      )}

      {/* ABOUT */}
      <section id="about" className="px-10 pb-20 relative z-10">
        <h2 className="text-3xl font-bold text-red-500 mb-4">About Noir</h2>
        <p className="text-zinc-400 max-w-xl">
          Noir is a strategic AI designed to challenge your thinking — not comfort it.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 px-10 py-10 text-zinc-400 relative z-10">
        <div className="flex justify-between">
          <h2 className="text-red-500 font-bold">NOIR.AI</h2>

          <div className="flex gap-6">
            <a href="#about">About</a>
            <a href="https://github.com/naylamutiara03" target="_blank">
              GitHub
            </a>
          </div>
        </div>

        <p className="text-xs mt-6 text-zinc-600">
          © 2026 Noir AI
        </p>
      </footer>

    </main>
  );
}