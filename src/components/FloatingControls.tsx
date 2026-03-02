import React from 'react';
import { motion } from 'motion/react';
import { Music, Music2, ChevronDown, ChevronUp } from 'lucide-react';

interface FloatingControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  showScrollTop: boolean;
  scrollToTop: () => void;
  isAdminLayout?: boolean;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPlaying, togglePlay, showScrollTop, scrollToTop, isAdminLayout
}) => {
  const wrapperClassName = isAdminLayout
    ? "fixed bottom-10 right-6 z-40 flex flex-col items-end gap-4"
    : "fixed bottom-10 right-10 z-40 flex flex-col items-end gap-4 md:right-[calc(50%-185px)]";

  const handleScrollClick = () => {
    if (showScrollTop) {
      scrollToTop();
    } else {
      const pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      window.scrollTo({ top: pageHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className={wrapperClassName}>
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={togglePlay}
        className="w-12 h-12 bg-wedding-red-dark text-wedding-gold rounded-full shadow-2xl flex items-center justify-center hover:bg-wedding-red/90 transition-all border border-wedding-gold/50"
        title={isPlaying ? "Stop music" : "Play music"}
      >
        {isPlaying ? <Music className="w-6 h-6" /> : <Music2 className="w-6 h-6" />}
      </motion.button>

      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={handleScrollClick}
        className="w-12 h-12 bg-wedding-gold text-wedding-red-dark rounded-full shadow-2xl flex items-center justify-center hover:bg-wedding-gold/90 transition-all border border-wedding-gold/50"
        title={showScrollTop ? "Scroll to top" : "Scroll to bottom"}
      >
        {showScrollTop ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};
