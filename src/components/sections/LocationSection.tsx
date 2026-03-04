import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Section } from '../common/Common';
import {motion} from 'motion/react';

interface LocationSectionProps {
  handleGetLocation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ handleGetLocation }) => {
  return (
    <Section className="bg-wedding-cream" ornate>
      <div id="map-section" className="text-center">
        <h3 className="section-title gold-gradient-text">ទីតាំងកម្មវិធី</h3>
        <p className="mt-2 text-sm font-sans text-wedding-brown/80 text-center uppercase tracking-wide">Wedding's Venue</p>
        <div className="bg-white p-8 rounded-sm shadow-xl border border-wedding-gold/20 relative mt-8 card-pattern">
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
          <p className="text-lg text-wedding-brown/60 leading-relaxed font-sans px-4">ក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ ភោជនីយដ្ឋាន សំណាង ប៉ោយប៉ែត</p>
          <p className="text-sm text-wedding-brown/80 mb-8 leading-relaxed font-sans px-4 mt-1">
            Somnang Restaurant, Poipet City, Banteay Meanchey Province, Cambodia
          </p>
          <motion.div>
           <motion.button 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            // transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
            onClick={handleGetLocation}
            className="box flex items-center animate-bounce justify-center gap-3 w-full py-4 border border-wedding-gold text-wedding-gold rounded-sm font-sans uppercase text-xs hover:bg-wedding-gold/30 transition-all font-bold"
          >
            <Navigation className="w-4 h-4" />
            <span className="flex flex-col items-start">
              <span className="text-[16px] normal-case text-wedding-gold/80">មើលលើផែនទី</span>
              <span className="text-[16px] normal-case text-wedding-gold/80">View on Map</span>
            </span>
            </motion.button>
          </motion.div>
         
        </div>
      </div>
    </Section>
  );
};
