"use client";

import { useState, useRef } from "react";

export function PromoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden glass">
      <video
        ref={videoRef}
        className="w-full aspect-[9/16] object-cover"
        playsInline
        muted
        loop
        preload="metadata"
        onClick={togglePlay}
      >
        <source src="/promo-reel.mp4" type="video/mp4" />
      </video>

      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/20"
          aria-label="Play video"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/90 flex items-center justify-center backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-7 h-7 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
