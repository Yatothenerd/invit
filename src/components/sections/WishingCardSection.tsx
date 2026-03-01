import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Section } from '../common/Common';
import { Wish } from '../../types';

interface WishingCardSectionProps {
  name: string;
  setName: (name: string) => void;
  message: string;
  setMessage: (message: string) => void;
  isSubmitting: boolean;
  handleSubmitWish: (e: React.FormEvent) => void;
  wishes: Wish[];
}

export const WishingCardSection: React.FC<WishingCardSectionProps> = ({
  name, setName, message, setMessage, isSubmitting, handleSubmitWish, wishes
}) => {
  return (
    <Section className="bg-wedding-red" ornate>
      <div className="mb-20">
        <h3 className="section-title gold-gradient-text">សៀវភៅជូនពរ</h3>
        
        <form onSubmit={handleSubmitWish} className="bg-wedding-red-dark p-8 rounded-sm shadow-xl border border-wedding-gold/20 mb-10 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wedding-red-dark px-4">
            <Heart className="w-6 h-6 text-wedding-gold fill-wedding-red" />
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[14px] font-bold text-wedding-gold uppercase  mb-1.5 font-sans">ឈ្មោះរបស់អ្នក</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-wedding-red border border-wedding-gold/10 rounded-sm focus:outline-none focus:border-wedding-gold font-sans text-wedding-cream placeholder:text-wedding-cream/30"
                placeholder="សូមបញ្ចូលឈ្មោះរបស់អ្នក"
                required
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-wedding-gold uppercase  mb-1.5 font-sans">សារជូនពរ</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-wedding-red border border-wedding-gold/10 rounded-sm focus:outline-none focus:border-wedding-gold min-h-[120px] font-sans text-wedding-cream placeholder:text-wedding-cream/30"
                placeholder="សូមសរសេរសារជូនពរនៅទីនេះ..."
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-wedding-gold text-wedding-red-dark rounded-sm font-sans  uppercase text-xs shadow-lg hover:bg-wedding-gold/90 transition-all disabled:opacity-50 border border-wedding-gold/30 font-bold"
            >
              {isSubmitting ? 'កំពុងផ្ញើ...' : 'ផ្ញើសារជូនពរ'}
            </button>
          </div>
        </form>

        <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 no-scrollbar">
          {wishes.map((wish) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              key={wish.id} 
              className="bg-wedding-red-dark/50 backdrop-blur-sm p-6 rounded-sm border-l-4 border-wedding-gold shadow-sm"
            >
              <p className="font-sans font-bold text-wedding-gold text-sm">{wish.name}</p>
              <p className="text-wedding-cream/80 text-sm mt-2 italic font-sans leading-relaxed">"{wish.message}"</p>
              <div className="flex justify-end mt-3">
                <p className="text-[9px] text-wedding-gold uppercase  font-bold font-sans">{new Date(wish.created_at).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
          {wishes.length === 0 && (
            <p className="text-center text-wedding-gold/40 text-sm italic font-sans">សូមក្លាយជាអ្នកដំបូងដែលផ្ញើសារជូនពរ!</p>
          )}
        </div>
      </div>
    </Section>
  );
};
