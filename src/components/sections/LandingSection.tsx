import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CornerDecor } from '../common/Common';

interface LandingSectionProps {
  guestName: string;
  scrollToContent: () => void;
}

export const LandingSection: React.FC<LandingSectionProps> = ({ guestName, scrollToContent }) => {
  const guestNameRef = useRef<HTMLHeadingElement | null>(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const el = guestNameRef.current;
    if (!el) return;

    const checkWrapped = () => {
      const style = window.getComputedStyle(el);
      const lineHeight = parseFloat(style.lineHeight || '0');
      if (!lineHeight) {
        setIsWrapped(false);
        return;
      }
      const lines = el.clientHeight / lineHeight;
      setIsWrapped(lines > 1.2);
    };

    checkWrapped();
    window.addEventListener('resize', checkWrapped);
    return () => window.removeEventListener('resize', checkWrapped);
  }, [guestName]);
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
        <p className="font-sans uppercase text-[16px] text-wedding-landbody mb-1">សូមគោរពអញ្ជើញ</p>
        <p className="font-sans text-[13px] text-wedding-cream/80 tracking-wide mb-2">We are honored to invite</p>
        <div className="mb-2">
          <div className="relative flex items-center justify-center mb-4 min-h-[80px]">
            <img 
              src="/image/Asset/name_placeholder.png" 
              alt="name placeholder" 
              className="absolute w-full max-w-[620px] opacity-60 pointer-events-none" 
            />
            <h2
              ref={guestNameRef}
              className={`guest-name font-serif text-wedding-white italic relative z-10 px-4 ${
                isWrapped ? 'text-xl' : 'text-2xl'
              }`}
            >
              {guestName}
            </h2>
          </div>
          <div className="h-[1px] w-12 bg-wedding-gold/30 mx-auto mb-2"></div>
          <p className="font-sans text-[16px] text-wedding-landbody uppercase mb-1">ចូលរួមជាអធិបតីក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ</p>
          <p className="font-sans text-[13px] text-wedding-cream/80 tracking-wide">to grace us with your presence at our wedding ceremony</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(220, 178, 135, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContent}
            className="text-wedding-landbody animate-bounce font-koulen border-wedding-landbody/30 px-8 py-3 rounded-full text-sm tracking-widest transition-all duration-300"
          >
           <span className="block font-koulen">បើកសំបុត្រអញ្ជើញ</span>
           <span className="block font-sans text-[11px] tracking-[0.25em] uppercase text-wedding-landbody/80">Open Invitation</span>
          </motion.button>
         </div>
      </motion.div>
    </section>
  );
};
