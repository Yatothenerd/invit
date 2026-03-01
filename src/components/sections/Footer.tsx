import React from 'react';
import { Flourish, CornerDecor } from '../common/Common';

export const Footer: React.FC = () => {
  return (
    <footer className="py-24 bg-wedding-red-dark text-wedding-cream text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-16 floral-border-top opacity-30"></div>
      <CornerDecor />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full floral-pattern"></div>
      </div>
      <div className="relative z-10">
        <Flourish className="mx-auto mb-8" />
        <p className="font-serif text-4xl gold-gradient-text">សូមអរគុណ</p>
        <p className="text-[14px] opacity-40 mt-4  uppercase font-bold text-wedding-gold font-sans">ស៊ុន សុក្រឹតវីរៈ & ផៃ ណាវ៉េត • ២០២៦</p>
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-1 h-1 rounded-full bg-wedding-gold"></div>
          <div className="w-1 h-1 rounded-full bg-wedding-gold"></div>
          <div className="w-1 h-1 rounded-full bg-wedding-gold"></div>
        </div>
      </div>
    </footer>
  );
};
