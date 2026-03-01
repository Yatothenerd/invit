import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Section } from '../common/Common';

export const SupportSection: React.FC = () => {
  const [currency, setCurrency] = useState<'KHR' | 'USD'>('USD');

  const isKHR = currency === 'KHR';
  const qrSrc = isKHR ? '/image/Photo/QReditKH.png' : '/image/Photo/QRedit.png';
  const qrAlt = isKHR ? 'QR Code KH (៛)' : 'QR Code USD ($)';

  return (
    <Section className="bg-wedding-cream" ornate>
      <div className="text-center">
        <h5 className="section-title text-wedding-main flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 fill-wedding-tan/20" /> 
          Support us building our small family
          <Heart className="w-5 h-5 fill-wedding-tan/20" />  
        </h5>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => setCurrency('KHR')}
            className={`px-3 py-1 rounded-full border text-xs tracking-wide transition-colors ${
              isKHR
                ? 'bg-wedding-main text-white border-wedding-main'
                : 'bg-white text-wedding-brown border-wedding-tan/60'
            }`}
          >
            QR KH (៛)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-full border text-xs tracking-wide transition-colors ${
              !isKHR
                ? 'bg-wedding-main text-white border-wedding-main'
                : 'bg-white text-wedding-brown border-wedding-tan/60'
            }`}
          >
            QR USD ($)
          </button>
        </div>

        <div className="relative mt-6 max-w-sm mx-auto">
          <img 
            src={qrSrc}
            alt={qrAlt}
            loading="lazy"
            className="w-full h-auto block transition-transform duration-700 hover:scale-105" 
            referrerPolicy="no-referrer" 
          />
        </div>
      </div>
    </Section>
  );
};
