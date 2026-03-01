import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../common/Common';

interface GallerySectionProps {
  setSelectedImage: (img: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ setSelectedImage }) => {
  return (
    <Section className="bg-wedding-cream/50" ornate>
      <h3 className="section-title gold-gradient-text">រូបភាពអនុស្សាវរីយ៍</h3>
      
      <div className="mt-8 space-y-4">
        {/* Row 1: a.jpg (Landscape) */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedImage("/image/Photo/a.jpg")}
          className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10"
        >
          <img src="/image/Photo/a.jpg" alt="Gallery a" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
        </motion.div>

        {/* Row 2: b.jpg, c.jpg (Portrait pair) */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage("/image/Photo/b.jpg")}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10"
          >
            <img src="/image/Photo/b.jpg" alt="Gallery b" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage("/image/Photo/c.jpg")}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10"
          >
            <img src="/image/Photo/c.jpg" alt="Gallery c" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
        </div>

        {/* Row 3: e.jpg (Landscape) */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedImage("/image/Photo/e.jpg")}
          className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10"
        >
          <img src="/image/Photo/e.jpg" alt="Gallery e" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
        </motion.div>

        {/* Row 4: f.jpg, g.jpg (Portrait pair) */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage("/image/Photo/f.jpg")}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10"
          >
            <img src="/image/Photo/f.jpg" alt="Gallery f" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage("/image/Photo/g.jpg")}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10"
          >
            <img src="/image/Photo/g.jpg" alt="Gallery g" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
        </div>

        {/* Row 5: d.jpg (Landscape) */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedImage("/image/Photo/d.jpg")}
          className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10"
        >
          <img src="/image/Photo/d.jpg" alt="Gallery d" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
        </motion.div>
      </div>
    </Section>
  );
};
