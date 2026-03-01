import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Section, Flourish } from '../common/Common';

export const FormalInvitationSection: React.FC = () => {
  return (
    <Section className="bg-wedding-cream" ornate>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h3 className="font-serif text-3xl gold-gradient-text mb-10">អាវាហវិវាហមង្គល</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="text-center">
            <p className="font-sans text-[16px] text-wedding-brown uppercase text-bold  mb-2">មាតាបិតាខាងកូនប្រុស</p>
            <p className="font-koulen text-m text-wedding-main ">លោក​ គង់ សុផានី</p>
            <p className="font-koulen text-m text-wedding-main ">លោកស្រី យស់ សារ៉ាន</p>
          </div>
          <div className="text-center">
            <p className="font-sans text-[16px] text-wedding-brown uppercase text-bold mb-2">មាតាបិតាខាងកូនស្រី</p>
            <p className="font-koulen text-m text-wedding-main ">លោក​ ហ៊ុន ហន</p>
            <p className="font-koulen text-m text-wedding-main">លោកស្រី លន់ ចន្ថា (មុំ)</p>
          </div>
        </div>

        <div className="mb-12 px-4">
          <h4 className="font-koulen text-xl text-wedding-main mb-4">យើងក្នុងមានកិត្តិយសសូមគោរពអញ្ជើញ</h4>
          <p className="font-sans text-[16px] leading-relaxed text-wedding-brown opacity-80">
            ឯកឧត្ដម លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា
            អញ្ជើញចូលរួមជាអធិបតី និងជាសាក្សីក្នុងពិធីសិរីសួស្តី ជ័យមង្គលវិវាហមង្គល ភរិយាស្វាមី
            ដែលរៀបចំពិធីតាមគន្លងប្រពៃណីខ្មែរ ក្នុងវល្លិ៍មង្គល សុភមង្គល របស់កូនប្រុស-កូនស្រី របស់យើងខ្ញុំ
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 items-center mb-12">
          <div className="text-center col-start-1">
            <p className="font-sans text-[16px] text-wedding-brown uppercase text-bold mb-2">កូនប្រុសនាម</p>
            <p className="font-koulen text-xl text-wedding-main">ស៊ុន សុក្រឹតវីរៈ</p>
          </div>
          <div className="flex justify-center col-start-2">
            <Heart className="w-6 h-6 text-wedding-tan/40" />
          </div>
          <div className="text-center col-start-3">
            <p className="font-sans text-[16px] text-wedding-brown uppercase text-bold mb-2">កូនស្រីនាម</p>
            <p className="font-koulen text-xl text-wedding-main">ផៃ ណាវ៉េត</p>
          </div>
        </div>

        <div className="px-4 mt-8">
          <div className="inline-block border-y border-wedding-gold/30 py-4 px-8">
            <p className="font-sans text-[14px] leading-relaxed text-wedding-brown opacity-70 mt-6">
              ថ្ងៃ ៩កើត ខែផល្គុន ឆ្នាំរោង ឆស័ក ពុទ្ធសករាជ ២៥៦៩ ត្រូវនឹង
            </p>
            <p className="font-koulen text-xl text-wedding-main mb-1">ថ្ងៃអាទិត្យ ទី១៥ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-sans text-xs text-wedding-brown uppercase tracking-widest opacity-60">Sunday, March 15, 2026</p>
          </div>
          <p className="font-sans text-[14px] leading-relaxed text-wedding-brown opacity-70 mt-6">
            រៀបចំពិធីនៅអាហារដ្ធាន សំណាង នៃសង្កាត់ប៉ោយប៉ែត ក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ !
          </p>
        </div>
        
        <Flourish className="mx-auto mt-10 opacity-30" />
      </motion.div>
    </Section>
  );
};
