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
      className={`p-1 rounded-tl-[5px] rounded-tr-[5px] w-15 h-5 rounded-br-[5px] rounded-bl-[5px] bg-white group flex items-center select-none ${className}`}
    >
      <div
        className={`relative flex items-center justify-center transition-colors
         overflow-hidden`}
      >
        {/* Base center line (static) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px" />
        {/* Wave path */}
        <svg
          width={50}
            height={35}
          className="pointer-events-none"
        >
          <path
            ref={pathRef}
            stroke="black"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            style={{
              opacity: 0.5,
              transition: "opacity 0.4s",
              filter: "drop-shadow(0 0 2px rgba(255,255,255,0.6))",
            }}
          />
        </svg>
      </div>
      <span
        className={`text-xs tracking-wider font-medium ${
          playing ? "text-black" : "text-black"
        }`}
      >
        Audio
      </span>
    </button>
  );
}