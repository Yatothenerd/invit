import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ChevronUp } from 'lucide-react';

interface FloatingControlsProps {
  isMuted: boolean;
  toggleMute: () => void;
  showScrollTop: boolean;
  scrollToTop: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isMuted, toggleMute, showScrollTop, scrollToTop
}) => {
  return (
    <div className="fixed bottom-10 right-10 z-40 flex flex-col items-end gap-4 md:right-[calc(50%-185px)]">
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMute}
        className="w-12 h-12 bg-wedding-red-dark text-wedding-gold rounded-full shadow-2xl flex items-center justify-center hover:bg-wedding-red/90 transition-all border border-wedding-gold/50"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </motion.button>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-wedding-gold text-wedding-red-dark rounded-full shadow-2xl flex items-center justify-center hover:bg-wedding-gold/90 transition-all border border-wedding-gold/50"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
