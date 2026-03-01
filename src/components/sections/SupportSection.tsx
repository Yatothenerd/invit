import React from 'react';
import { Heart } from 'lucide-react';
import { Section } from '../common/Common';

export const SupportSection: React.FC = () => {
  return (
    <Section className="bg-wedding-cream" ornate>
      <div className="text-center">
        <h5 className="section-title text-wedding-main flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 fill-wedding-tan/20" /> 
          Support us building our small family
          <Heart className="w-5 h-5 fill-wedding-tan/20" />  
        </h5>
        <div className="relative mt-8 max-w-sm mx-auto">
          <img 
            src="/image/Photo/QRedit.png" 
            alt="QR Code for Support" 
            className="w-full h-auto block transition-transform duration-700 hover:scale-105" 
            referrerPolicy="no-referrer" 
          />
        </div>
      </div>
    </Section>
  );
};
