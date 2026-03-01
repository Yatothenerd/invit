import React from 'react';
import { motion } from 'motion/react';
import { CornerDecor } from '../common/Common';

interface LandingSectionProps {
  guestName: string;
  scrollToContent: () => void;
}

export const LandingSection: React.FC<LandingSectionProps> = ({ guestName, scrollToContent }) => {
  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-between text-wedding-gold p-8 text-center relative overflow-hidden pt-10 pb-10"
      style={{
        backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 30%, rgba(0, 0, 0, 0) 60%), url("/image/Photo/Cover.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-4 border border-wedding-gold/30 pointer-events-none z-20"></div>
      <div className="absolute inset-6 border-2 border-wedding-gold/20 pointer-events-none z-20"></div>
      <CornerDecor />
      
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <img src="/image/Asset/abbreviationname.png" alt="frame" className="w-full max-w-[150px]" />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center mb-2"
      >
        <p className="font-sans uppercase text-[16px] text-wedding-landbody mb-2">សូមគោរពអញ្ជើញ</p>
        <div className="mb-2">
          <div className="relative flex items-center justify-center mb-4 min-h-[80px]">
            <img 
              src="/image/Asset/name_placeholder.png" 
              alt="name placeholder" 
              className="absolute w-full max-w-[620px] opacity-60 pointer-events-none" 
            />
            <h2 className="guest-name font-serif text-2xl text-wedding-white italic relative z-10 px-4">{guestName}</h2>
          </div>
          <div className="h-[1px] w-12 bg-wedding-gold/30 mx-auto mb-2"></div>
          <p className="font-sans text-[16px] text-wedding-landbody uppercase">ចូលរួមជាអធិបតីក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(220, 178, 135, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContent}
            className="text-wedding-landbody animate-bounce font-koulen border-wedding-landbody/30 px-8 py-3 rounded-full text-sm tracking-widest transition-all duration-300"
          >
           បើកសំបុត្រអញ្ជើញ
          </motion.button>
         </div>
      </motion.div>
    </section>
  );
};
