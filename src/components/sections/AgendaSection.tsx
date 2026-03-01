import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../common/Common';

const agendaItems = [
  { time: "០៦:៣០ ព្រឹក", title: "ជួបជុំភ្ញៀវកិត្តិយស និងរៀបចំពិធីហែជំនូន", icon: "/image/Asset/1.png" },
  { time: "០៧:០០ ព្រឹក", title: "ពិធីហែជំនូន (កំណត់) ចូលរោងជ័យ", icon: "/image/Asset/2.png" },
  { time: "០៧:៣០ ព្រឹក", title: "ពិធីពិសាស្លាកំណត់ និយាយជើងការ និងរៀបរាប់ផ្លែឈើ", icon: "/image/Asset/3.png" },
  { time: "០៨:៣០ ព្រឹក", title: "ពិធីបំពាក់ចិញ្ចៀន", icon: "/image/Asset/4.png" },
  { time: "០៩:០០ ព្រឹក", title: "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត", icon: "/image/Asset/5.png" },
  { time: "១០:០០ ព្រឹក", title: "ពិធីកាត់សក់បង្កក់សិរី ចម្រើនកេសា កូនប្រុស-ស្រី", icon: "/image/Asset/6.png" },
  { time: "១១:០០ ព្រឹក", title: "ពិធីបង្វិលពពិល សំពះផ្ទឹម សែនចងដៃ បាចផ្កាស្លា ព្រះថោងតោងស្បៃនាងនាគ", icon: "/image/Asset/7.png" },
  { time: "១២:០០ ថ្ងៃត្រង់", title: "អញ្ជើញភ្ញៀវកិត្តិយសពិសាភោជនាហារថ្ងៃត្រង់", icon: "/image/Asset/8.png" },
  { time: "០៥:០០ រសៀល", title: "ទទួលបដិសណ្ឋារកិច្ចភ្ញៀវកិត្តិយស ពិសាភោជនាហារពេលល្ងាច", icon: "/image/Asset/9.png" }
];

export const AgendaSection: React.FC = () => {
  return (
    <Section className="bg-wedding-cream" ornate>
      <h3 className="section-title font-koulen gold-gradient-text">ពិធីមង្គលការ</h3>
      <div className="space-y-8 relative mt-8">
        {agendaItems.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-[60px_1fr] gap-6 items-center"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-wedding-tan/10 rounded-full border border-wedding-tan/20 shadow-sm">
              <img src={item.icon} alt="icon" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="text-wedding-tan font-bold text-[13px] uppercase mb-1 font-sans">{item.time}</p>
              <h4 className="font-sans font-bold text-md text-wedding-brown leading-snug">{item.title}</h4>
            </div>
          </motion.div>
        ))}
        <p className="text-[12px] text-center center"> សូមអភ័យទោសប្រសិនពិធីខាងលើនេះអាចនឹងមានការរប្រែប្រួល</p>
      </div>
    </Section>
  );
};
