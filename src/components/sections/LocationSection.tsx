import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Section } from '../common/Common';

interface LocationSectionProps {
  handleGetLocation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ handleGetLocation }) => {
  return (
    <Section className="bg-wedding-cream" ornate>
      <div className="text-center">
        <h3 className="section-title gold-gradient-text">ទីតាំងកម្មវិធី</h3>
        <div className="bg-white p-8 rounded-sm shadow-xl border border-wedding-gold/20 relative mt-8">
          <div className="p-4 absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4">
            <MapPin className="w-6 h-6 text-wedding-gold" />
          </div>
          <div 
            className="mb-6 overflow-hidden rounded-sm border border-wedding-gold/20 h-[200px] cursor-pointer"
            onClick={handleGetLocation}
          >
            <img 
              src="/image/Asset/venue.png" 
              alt="Map Location Reference" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="font-sans text-2xl text-wedding-gold mb-2">ទីតាំងមង្គលការ</p>
          <p className="text-lg text-wedding-brown/60 mb-8 leading-relaxed font-sans px-4">ក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ ភោជនីយដ្ឋាន សំណាង ប៉ោយប៉ែត</p>
          <button 
            onClick={handleGetLocation}
            className="flex items-center justify-center gap-3 w-full py-4 border border-wedding-gold text-wedding-gold rounded-sm font-sans uppercase text-xs hover:bg-wedding-gold/10 transition-all font-bold"
          >
            <Navigation className="w-4 h-4" />
            មើលលើផែនទី
          </button>
        </div>
      </div>
    </Section>
  );
};
