import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../common/Common';
import { GALLERY_IMAGES } from '../../galleryImages';

interface GallerySectionProps {
  setSelectedImage: (img: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ setSelectedImage }) => {
  return (
    <Section className="bg-wedding-cream/50" ornate>
      <h3 className="section-title gold-gradient-text">រូបភាពអនុស្សាវរីយ៍</h3>
      <p className="mt-2 text-sm font-sans text-wedding-brown/80 text-center uppercase tracking-wide">Memories Gallery</p>
      
      <motion.div
        className="mt-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Row 1: a.jpg (Landscape) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedImage(GALLERY_IMAGES[0])}
          className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10 card-pattern"
        >
          <img src="/image/Photo/a.jpg" alt="Gallery a" loading="lazy" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
        </motion.div>

        {/* Row 2: b.jpg, c.jpg (Portrait pair) */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(GALLERY_IMAGES[1])}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10 card-pattern"
          >
            <img src="/image/Photo/b.jpg" alt="Gallery b" loading="lazy" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(GALLERY_IMAGES[2])}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10 card-pattern"
          >
            <img src="/image/Photo/c.jpg" alt="Gallery c" loading="lazy" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
        </div>

        {/* Row 3: e.jpg (Landscape) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedImage(GALLERY_IMAGES[3])}
          className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10 card-pattern"
        >
          <img src="/image/Photo/e.jpg" alt="Gallery e" loading="lazy" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
        </motion.div>

        {/* Row 4: f.jpg, g.jpg (Portrait pair) */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(GALLERY_IMAGES[4])}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10 card-pattern"
          >
            <img src="/image/Photo/f.jpg" alt="Gallery f" loading="lazy" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedImage(GALLERY_IMAGES[5])}
            className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10 card-pattern"
          >
            <img src="/image/Photo/g.jpg" alt="Gallery g" loading="lazy" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
          </motion.div>
        </div>

        {/* Row 5: d.jpg (Landscape) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedImage(GALLERY_IMAGES[6])}
          className="cursor-pointer overflow-hidden shadow-xl bg-white/5 ring-1 ring-wedding-gold/10 card-pattern"
        >
          <img src="/image/Photo/d.jpg" alt="Gallery d" loading="lazy" className="w-full h-auto block transition-transform duration-700 hover:scale-105" referrerPolicy="no-referrer" />
        </motion.div>
      </motion.div>
    </Section>
  );
};
