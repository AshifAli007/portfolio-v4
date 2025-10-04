"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

type AudioToggleProps = {
  audioSrc: string;
  className?: string;
  initialVolume?: number;
};

export default function AudioToggle({
  audioSrc,
  className = "",
  initialVolume = 0.5,
}: AudioToggleProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const pathRef = useRef<SVGPathElement | null>(null);
  const targetAmpRef = useRef(0);
  const currentAmpRef = useRef(0);

  // Init audio once
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = initialVolume;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
      cancelAnimationFrame(rafRef.current);
    };
  }, [audioSrc, initialVolume]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch (e) {
        // autoplay block
        console.warn("Play failed:", e);
      }
    }
  }, [playing]);

  // Wave animation
  useEffect(() => {
    targetAmpRef.current = playing ? 6 : 0; // px amplitude
  }, [playing]);

  // Accent pulled from site theme (#89d3ce); adjust if theme changes
  const accent = "#89d3ce";
  const idleStroke = "rgba(255,255,255,0.55)";
  const activeStroke = accent;

  useEffect(() => {
    const animate = () => {
      phaseRef.current += 0.02;
      // Ease amplitude
      currentAmpRef.current += (targetAmpRef.current - currentAmpRef.current) * 0.08;

      const w = 20;
      const h = 34;
      const midY = h / 2;
      const points = 100; // smoothness
      const amp = currentAmpRef.current;
      let d = `M 0 ${midY}`;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const y =
          midY +
          Math.sin(phaseRef.current + (i / points) * Math.PI * 2 * 1.5) *
            amp *
            Math.sin((i / points) * Math.PI); // taper ends
        d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      if (pathRef.current) pathRef.current.setAttribute("d", d);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <button
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className={[
        "h-6 group flex items-center select-none px-2 py-1",
        "rounded-tl-[6px] rounded-tr-[6px] rounded-br-[6px] rounded-bl-[6px]",
        "bg-[rgba(0,0,0,0.25)] backdrop-blur-sm",
        "border border-white/10 hover:border-[color:var(--accent)]",
        "transition-colors",
        playing ? "shadow-[0_0_0_1px_rgba(137,211,206,0.35),0_0_12px_-2px_rgba(137,211,206,0.45)]" : "shadow-none",
        className,
      ].join(" ")}
      style={{ ["--accent" as string]: accent }}
    >
      <div
        className="relative flex items-center justify-center overflow-hidden
                   rounded-md"
      >
        {/* Base center line */}
        {/* <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/25" /> */}
        {/* Wave path */}
        <svg
          width={30}
          height={34}
          className="pointer-events-none"
        >
          <path
            ref={pathRef}
            stroke={playing ? activeStroke : idleStroke}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            style={{
              opacity: playing ? 0.95 : 0.65,
              transition: "stroke 220ms ease, opacity 300ms ease",
              filter: playing
                ? "drop-shadow(0 0 4px rgba(137,211,206,0.55))"
                : "drop-shadow(0 0 2px rgba(255,255,255,0.25))",
            }}
          />
        </svg>
      </div>
      <span
        className={[
          "text-[0.6rem] tracking-wider font-medium uppercase",
          "transition-colors",
          playing ? "text-[color:var(--accent)]" : "text-white/70 group-hover:text-white/90",
        ].join(" ")}
      >
        {playing ? "On" : "Off"}
      </span>
    </button>
  );
}