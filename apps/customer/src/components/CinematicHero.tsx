import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const HERO_VIDEO_URL = 'https://raw.githubusercontent.com/adrianhajdin/project_modern_ui_ux_restaurant/main/src/assets/meal.mp4';
const HERO_POSTER_URL = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920&auto=format&fit=crop';

export const CinematicHero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (reducedMotion || !videoRef.current) return;
    const vid = videoRef.current;
    const tryPlay = () => {
      vid.play().catch(() => {
        // Autoplay blocked — poster image will show instead
      });
    };
    if (vid.readyState >= 3) {
      tryPlay();
    } else {
      vid.addEventListener('canplay', tryPlay, { once: true });
      return () => vid.removeEventListener('canplay', tryPlay);
    }
  }, [reducedMotion]);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Video / Poster Fallback */}
      {!reducedMotion ? (
        <video
          ref={videoRef}
          src={HERO_VIDEO_URL}
          poster={HERO_POSTER_URL}
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? 'opacity-70' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* Poster fallback (also shows while video loads) */}
      <img
        src={HERO_POSTER_URL}
        alt="Craftsland culinary experience"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoReady && !reducedMotion ? 'opacity-0' : 'opacity-60'
        }`}
        loading="eager"
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F7F4EC] via-[#F7F4EC]/60 to-transparent z-[2]" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
        {/* Brand badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-[11px] font-sans font-bold tracking-[0.25em] uppercase">
            Artisanal Dining & Hearth
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight"
        >
          Crafted With Fire,
          <br />
          <span className="text-[#78956A]">Served With Passion</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-sans text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed"
        >
          Experience fresh botanical ingredients, wood-fired craftsmanship,
          and unforgettable culinary moments.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/menu"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#31543A] hover:bg-[#26432E] text-white font-sans font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg border border-[#26432E] flex items-center justify-center gap-2 group cursor-pointer min-h-[48px]"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/reservation"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-sans font-bold text-xs uppercase tracking-[0.2em] border border-white/25 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer min-h-[48px]"
          >
            <Calendar className="w-4 h-4" />
            <span>Reserve a Table</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
