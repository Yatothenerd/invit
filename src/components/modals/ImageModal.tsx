import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2 } from 'lucide-react';

interface ImageModalProps {
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
  handleShare: (img: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ selectedImage, setSelectedImage, handleShare }) => {
  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-wedding-gold hover:text-wedding-cream z-10 transition-colors"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-10 h-10" />
          </button>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 border-[1px] border-wedding-gold/30 -m-2 pointer-events-none"></div>
            <img 
              src={selectedImage} 
              alt="Full screen" 
              className="max-w-full max-h-[80vh] object-contain shadow-2xl border-4 border-wedding-gold/20"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="absolute bottom-12 flex gap-6">
            <button 
              onClick={(e) => { e.stopPropagation(); handleShare(selectedImage); }}
              className="flex items-center gap-3 px-8 py-4 bg-wedding-gold text-wedding-red-dark rounded-sm font-sans  uppercase text-xs shadow-xl hover:bg-wedding-gold/90 transition-all border border-wedding-gold/30 font-bold"
            >
              <Share2 className="w-4 h-4" />
              ចែករំលែករូបភាពនេះ
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
