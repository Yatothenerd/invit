import React, { useState, useEffect, useRef } from 'react';
import { Wish, Guest } from '../types';

const CODE_LENGTH = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// No longer used: codes are now random and come from the backend

export const useWeddingApp = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState('Guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('guest') || params.get('name');

    // New style: /AbCDe0 (first path segment is the code)
    const pathSegment = window.location.pathname.replace(/^\/+/, '').split('/')[0];
    const pathCode = pathSegment && pathSegment.length === CODE_LENGTH ? pathSegment : null;

    // Old style: ?code=... (still supported)
    const queryCode = params.get('code');
    const effectiveCode = pathCode || (queryCode && queryCode.length === CODE_LENGTH ? queryCode : null);

    if (effectiveCode) {
      const loadGuestFromCode = async () => {
        try {
          const res = await fetch('/api/guests');
          const data = await res.json();
          const guests: Guest[] = data.guests || [];
          const codes: Record<string, number> = data.codes || {};
          const idx = codes[effectiveCode];
          if (typeof idx === 'number' && guests[idx]) {
            const entry = guests[idx];
            const nameFromEntry =
              entry.name ||
              (entry as any).Name ||
              (entry as any).Guestname ||
              (Object.values(entry).find(
                (v) => typeof v === 'string' && v.trim().length > 0
              ) as string | undefined);
            if (nameFromEntry) {
              setGuestName(nameFromEntry);
            }
          }
        } catch (err) {
          console.error('Failed to resolve guest from code', err);
        }
      };
      loadGuestFromCode();
    } else if (guestParam) {
      setGuestName(guestParam);
    }
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
      fetchGuests();
    }
    fetchWishes();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/guests');
      const data = await response.json();
      // API returns { guests, codes }; fall back to array for
      // backward compatibility when running against older servers.
      setGuests(Array.isArray(data) ? data : (data.guests || []));
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      const data = await res.json();
      setWishes(data);
    } catch (error) {
      console.error("Failed to fetch wishes", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const audio = new Audio('/audio/bg-music.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;
    audioRef.current = audio;

    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };

    const handleFirstInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });
      if (res.ok) {
        setName('');
        setMessage('');
        fetchWishes();
      }
    } catch (error) {
      console.error("Failed to submit wish", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContent = () => {
    secondSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleShare = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Wedding Photo',
          text: 'Check out this beautiful wedding photo!',
          url: imageUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(imageUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleGetLocation = () => {
    const url = `https://maps.app.goo.gl/fQmcW4u8Sxrj2wtF7`;
    window.open(url, '_blank');
  };

  return {
    showScrollTop,
    selectedImage,
    setSelectedImage,
    wishes,
    name,
    setName,
    message,
    setMessage,
    isSubmitting,
    guestName,
    isAdmin,
    setIsAdmin,
    guests,
    isMuted,
    mainRef,
    secondSectionRef,
    handleSubmitWish,
    scrollToTop,
    scrollToContent,
    toggleMute,
    handleShare,
    handleGetLocation
  };
};
