import React, { useEffect, useMemo, useRef, useState } from "react";

interface HackerTimerProps {
  duration?: number; // total time in seconds
  onTimeUp?: () => void; // callback when countdown finishes
  roomName?: string; // display name above timer
  enableBeep?: boolean; // optional subtle beep on the last 3 seconds (default false)
}

// Format seconds into mm:ss
function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

const HackerTimer: React.FC<HackerTimerProps> = ({
  duration = 15,
  onTimeUp,
  roomName,
  enableBeep = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const startedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  // WebAudio beep (subtle) used only if enableBeep = true
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ensureAudio = () =>
    (audioCtxRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)());

  const beep = (freq = 780, dur = 0.05, vol = 0.03) => {
    if (!enableBeep) return;
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  };

  // Drive countdown using rAF for smoother drift-free timing
  useEffect(() => {
    startedAtRef.current = performance.now();
    doneRef.current = false;

    const tick = () => {
      if (!startedAtRef.current) return;
      const elapsed = (performance.now() - startedAtRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(duration - elapsed));
      setTimeLeft((prev) => (prev !== remaining ? remaining : prev));

      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true;
        onTimeUp?.();
      }
      if (!doneRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [duration, onTimeUp]);

  // Subtle beep on last 3 seconds (optional)
  const lastBeepedRef = useRef<number | null>(null);
  useEffect(() => {
    if (!enableBeep) return;
    if (timeLeft > 0 && timeLeft <= 3 && timeLeft !== lastBeepedRef.current) {
      beep();
      lastBeepedRef.current = timeLeft;
    }
  }, [timeLeft, enableBeep]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
    };
  }, []);

  const formatted = useMemo(() => formatTime(timeLeft), [timeLeft]);

  // CSS variables local to this component to avoid relying on global theme specifics
  const styleVars = {
    // HSL values for component-local tokens
    "--hack-bg": "0 0% 0%",
    "--hack-green": "136 100% 55%",
    "--hack-cyan": "184 100% 70%",
    "--hack-grid": "0 0% 100% / 0.04",
  } as React.CSSProperties;

  return (
    <section
      className="hacker-timer relative overflow-hidden rounded-md border bg-background/70 backdrop-blur-sm p-4 md:p-6 animate-fade-in"
      style={styleVars}
      aria-live="polite"
      role="status"
    >
      {/* CRT/scanline overlays */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, rgba(255,255,255,0.02) 1px, transparent 2px)",
        }} />
      </div>

      {/* Glowing rim */}
      <div className="pointer-events-none absolute inset-0 rounded-md" aria-hidden="true" style={{
        boxShadow:
          "0 0 0 1px hsl(var(--hack-green)/0.25), 0 0 24px hsl(var(--hack-green)/0.15), inset 0 0 24px hsl(var(--hack-green)/0.08)",
      }} />

      {/* Header / Room name */}
      {roomName && (
        <header className="mb-3">
          <h2 className="font-mono text-sm md:text-base font-semibold tracking-widest uppercase glitch-text">
            {roomName}
          </h2>
        </header>
      )}

      {/* Timer */}
      <main className="relative flex items-center justify-center">
        <div className="relative">
          <div className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-center hacker-text-shadow hacker-color-shift">
            {formatted}
          </div>
          {/* Glitch shadow layers */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
            <div className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-center glitch-layer glitch-a">
              {formatted}
            </div>
            <div className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-center glitch-layer glitch-b">
              {formatted}
            </div>
          </div>
        </div>
      </main>

      {/* Local styles scoped by .hacker-timer */}
      <style>{`
        .hacker-timer {
          background: radial-gradient(1200px 600px at 10% 0%, hsl(var(--hack-green) / 0.06), transparent 60%),
                      radial-gradient(1200px 600px at 90% 100%, hsl(var(--hack-cyan) / 0.06), transparent 60%),
                      hsl(var(--hack-bg));
          position: relative;
          isolation: isolate;
          animation: hack-flicker 6s infinite steps(100);
        }
        .hacker-text-shadow {
          color: hsl(var(--hack-green));
          text-shadow: 0 0 6px hsl(var(--hack-green) / 0.6), 0 0 18px hsl(var(--hack-green) / 0.25);
        }
        .hacker-color-shift {
          animation: hack-color-shift 5s ease-in-out infinite;
        }
        .glitch-text {
          color: hsl(var(--hack-cyan));
          filter: drop-shadow(0 0 6px hsl(var(--hack-cyan) / 0.4));
          animation: hack-flicker 8s infinite steps(120);
        }
        .glitch-layer {
          mix-blend-mode: screen;
          opacity: 0.12;
          text-shadow: 0 0 10px hsl(var(--hack-cyan) / 0.6);
        }
        .glitch-a { animation: hack-glitch-a 2.2s infinite; }
        .glitch-b { animation: hack-glitch-b 3s infinite; }

        @keyframes hack-color-shift {
          0%, 100% { color: hsl(var(--hack-green)); text-shadow: 0 0 6px hsl(var(--hack-green) / 0.6), 0 0 18px hsl(var(--hack-green) / 0.25); }
          50% { color: hsl(var(--hack-cyan)); text-shadow: 0 0 6px hsl(var(--hack-cyan) / 0.6), 0 0 18px hsl(var(--hack-cyan) / 0.25); }
        }

        @keyframes hack-flicker {
          0% { opacity: 0.98; }
          1% { opacity: 0.96; }
          2% { opacity: 0.99; }
          3% { opacity: 0.97; }
          5% { opacity: 1; }
          8% { opacity: 0.98; }
          13% { opacity: 0.99; }
          21% { opacity: 0.97; }
          34% { opacity: 1; }
          55% { opacity: 0.98; }
          89% { opacity: 1; }
          100% { opacity: 0.99; }
        }

        @keyframes hack-glitch-a {
          0% { transform: translate(0, 0); filter: hue-rotate(0deg); }
          10% { transform: translate(-1px, 0.5px); }
          20% { transform: translate(1.5px, -1px); }
          30% { transform: translate(-0.5px, 1px); }
          40% { transform: translate(1px, -0.5px); }
          50% { transform: translate(0, 0); filter: hue-rotate(10deg); }
          60% { transform: translate(1px, 0.5px); }
          70% { transform: translate(-1.5px, -1px); }
          80% { transform: translate(0.5px, 1px); }
          90% { transform: translate(-1px, -0.5px); }
          100% { transform: translate(0, 0); filter: hue-rotate(0deg); }
        }

        @keyframes hack-glitch-b {
          0% { transform: translate(0, 0); }
          15% { transform: translate(1px, -0.5px); }
          25% { transform: translate(-1px, 0.5px); }
          45% { transform: translate(0.5px, -1px); }
          65% { transform: translate(-0.5px, 1px); }
          85% { transform: translate(1px, 0); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </section>
  );
};

export default HackerTimer;
