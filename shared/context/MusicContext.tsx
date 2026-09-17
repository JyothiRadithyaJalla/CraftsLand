import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

export interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  url: string;
  license: string;
}

export const AMBIENT_TRACKS: TrackInfo[] = [
  {
    id: 'gymnopedie',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie (arr. Kevin MacLeod)',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3',
    license: 'Creative Commons CC-BY 3.0',
  },
  {
    id: 'eastern-thought',
    title: 'Eastern Thought',
    artist: 'Kevin MacLeod',
    url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Eastern%20Thought.mp3',
    license: 'Creative Commons CC-BY 3.0',
  },
];

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: TrackInfo;
  volume: number;
  toggleSound: () => void;
  nextTrack: () => void;
  setVolume: (vol: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const TARGET_VOLUME = 0.18; // Delicate ambient volume (~18%)
const STORAGE_KEY = 'craftsland_sound_preference';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(TARGET_VOLUME);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = AMBIENT_TRACKS[currentTrackIndex];

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.src = currentTrack.url;
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'none';
    audioRef.current = audio;

    // Check persistent storage
    try {
      const savedPref = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (savedPref === 'true') {
        audio.preload = 'auto';
      }
    } catch {
      // Ignore storage errors
    }

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update track src when currentTrack changes while keeping play state
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const wasPlaying = isPlaying;

    audio.src = currentTrack.url;
    audio.load();

    if (wasPlaying) {
      audio.volume = volume;
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const fadeIn = useCallback((targetVol = TARGET_VOLUME) => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();
    audio.volume = 0;
    const stepTime = 50; // ms
    const totalSteps = 1500 / stepTime; // 1.5s fade-in
    const stepDelta = targetVol / totalSteps;

    audio.play().then(() => {
      setIsPlaying(true);
      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current) return;
        const nextVol = Math.min(targetVol, audioRef.current.volume + stepDelta);
        audioRef.current.volume = nextVol;
        if (nextVol >= targetVol) {
          clearFade();
        }
      }, stepTime);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const fadeOut = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFade();
    const stepTime = 50; // ms
    const totalSteps = 800 / stepTime; // 0.8s fade-out
    const stepDelta = (audio.volume || TARGET_VOLUME) / totalSteps;

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const nextVol = Math.max(0, audioRef.current.volume - stepDelta);
      audioRef.current.volume = nextVol;
      if (nextVol <= 0) {
        clearFade();
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }, stepTime);
  }, []);

  const toggleSound = useCallback(() => {
    if (isPlaying) {
      fadeOut();
      try {
        localStorage.setItem(STORAGE_KEY, 'false');
        sessionStorage.setItem(STORAGE_KEY, 'false');
      } catch {}
    } else {
      fadeIn(volume);
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {}
    }
  }, [isPlaying, volume, fadeIn, fadeOut]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % AMBIENT_TRACKS.length);
  }, []);

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (audioRef.current && isPlaying) {
      audioRef.current.volume = clamped;
    }
  }, [isPlaying]);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted: !isPlaying,
        currentTrack,
        volume,
        toggleSound,
        nextTrack,
        setVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
