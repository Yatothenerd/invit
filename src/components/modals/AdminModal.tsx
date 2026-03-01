import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2 } from 'lucide-react';
import { Guest } from '../../types';

interface AdminModalProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  guests: Guest[];
}

export const AdminModal: React.FC<AdminModalProps> = ({ isAdmin, setIsAdmin, guests }) => {
  return (
    <AnimatePresence>
      {isAdmin && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-wedding-red/95 flex flex-col items-center justify-center p-4"
        >
          <div className="bg-wedding-cream w-full max-w-md h-[80vh] rounded-sm shadow-2xl flex flex-col overflow-hidden border-2 border-wedding-gold">
            <div className="p-4 bg-wedding-red text-wedding-gold flex justify-between items-center border-b border-wedding-gold/30">
              <h2 className="font-koulen text-xl">បញ្ជីឈ្មោះភ្ញៀវកិត្តិយស</h2>
              <button onClick={() => setIsAdmin(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {guests.map((guest, idx) => {
                const name = guest.Name || guest.name || Object.values(guest)[0];
                const url = `${window.location.origin}${window.location.pathname}?guest=${encodeURIComponent(name as string)}`;
                return (
                  <div key={idx} className="p-3 bg-white border border-wedding-tan/20 rounded-sm flex justify-between items-center shadow-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-wedding-brown truncate">{name as string}</p>
                      <p className="text-[10px] text-wedding-tan truncate">{url}</p>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        alert(`Copied link for ${name}`);
                      }}
                      className="ml-2 p-2 bg-wedding-gold/10 text-wedding-gold rounded-full hover:bg-wedding-gold/20 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {guests.length === 0 && (
                <p className="text-center text-wedding-tan italic py-10">មិនមានឈ្មោះភ្ញៀវក្នុងបញ្ជី</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
