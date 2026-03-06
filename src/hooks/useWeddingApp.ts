import React, { useState, useEffect, useRef } from 'react';
import { Wish, Guest } from '../types';
import { GALLERY_IMAGES } from '../galleryImages';

const CODE_LENGTH = 6;

export const useWeddingApp = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState('Guest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

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
            if (entry.name) {
              setGuestName(entry.name);
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
      setGuests(data.guests || []);
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
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const threshold = 50;
      setShowScrollTop(scrollPosition >= pageHeight - threshold);
    };
    window.addEventListener('scroll', handleScroll);
    // Initialize on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Do not load or play music on the admin page
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    if (isAdminRoute) {
      setIsPlaying(false);
      return;
    }

    const audio = new Audio('/audio/bg-music.mp3');
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0.5;
    audioRef.current = audio;

    // Try to autoplay on normal pages; if the browser blocks it,
    // music will start later when the user interacts (e.g. Open Invitation button).
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked – wait for explicit user interaction.
      });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const stopAudio = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAudio();
      }
    };

    const handlePageHide = () => {
      stopAudio();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

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
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const selectedImage =
    selectedImageIndex !== null ? GALLERY_IMAGES[selectedImageIndex] ?? null : null;

  const setSelectedImage = (img: string | null) => {
    if (img === null) {
      setSelectedImageIndex(null);
      return;
    }
    const idx = GALLERY_IMAGES.indexOf(img);
    setSelectedImageIndex(idx === -1 ? null : idx);
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % GALLERY_IMAGES.length;
    });
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    });
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
    goToNextImage,
    goToPrevImage,
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
    isPlaying,
    mainRef,
    secondSectionRef,
    handleSubmitWish,
    scrollToTop,
    scrollToContent,
    togglePlay,
    handleShare,
    handleGetLocation
  };
};
