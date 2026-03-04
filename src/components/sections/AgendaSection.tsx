import React from 'react';
import { motion } from 'motion/react';
import { Section } from '../common/Common';

const agendaItems = [
  {
    time: "០៦:៣០ ព្រឹក",
    timeEn: "06:30 AM",
    title: "ជួបជុំភ្ញៀវកិត្តិយស និងរៀបចំពិធីហែជំនូន",
    titleEn: "Gathering of honored guests and preparation for the procession",
    icon: "/image/Asset/1.png",
  },
  {
    time: "០៧:០០ ព្រឹក",
    timeEn: "07:00 AM",
    title: "ពិធីហែជំនូន (កំណត់) ចូលរោងជ័យ",
    titleEn: "Procession (Kamnott) entering the wedding hall",
    icon: "/image/Asset/2.png",
  },
  {
    time: "០៧:៣០ ព្រឹក",
    timeEn: "07:30 AM",
    title: "ពិធីពិសាស្លាកំណត់ និយាយជើងការ និងរៀបរាប់ផ្លែឈើ",
    titleEn: "Traditional offering ceremony and explanation of fruits and gifts",
    icon: "/image/Asset/3.png",
  },
  {
    time: "០៨:៣០ ព្រឹក",
    timeEn: "08:30 AM",
    title: "ពិធីបំពាក់ចិញ្ចៀន",
    titleEn: "Ring exchange ceremony",
    icon: "/image/Asset/4.png",
  },
  {
    time: "០៩:០០ ព្រឹក",
    timeEn: "09:00 AM",
    title: "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត",
    titleEn: "Monk blessing ceremony (Sot Mun)",
    icon: "/image/Asset/5.png",
  },
  {
    time: "១០:០០ ព្រឹក",
    timeEn: "10:00 AM",
    title: "ពិធីកាត់សក់បង្កក់សិរី ចម្រើនកេសា កូនប្រុស-ស្រី",
    titleEn: "Hair-cut and blessing ritual for the bride and groom",
    icon: "/image/Asset/6.png",
  },
  {
    time: "១១:០០ ព្រឹក",
    timeEn: "11:00 AM",
    title: "ពិធីបង្វិលពពិល សំពះផ្ទឹម សែនចងដៃ បាចផ្កាស្លា ព្រះថោងតោងស្បៃនាងនាគ",
    titleEn: "Traditional blessing rituals and tying of the couple's wrists",
    icon: "/image/Asset/7.png",
  },
  {
    time: "១២:០០ ថ្ងៃត្រង់",
    timeEn: "12:00 PM",
    title: "អញ្ជើញភ្ញៀវកិត្តិយសពិសាភោជនាហារថ្ងៃត្រង់",
    titleEn: "Luncheon for honored guests",
    icon: "/image/Asset/8.png",
  },
  {
    time: "០៥:០០ រសៀល",
    timeEn: "05:00 PM",
    title: "ទទួលបដិសណ្ឋារកិច្ចភ្ញៀវកិត្តិយស ពិសាភោជនាហារពេលល្ងាច",
    titleEn: "Evening reception and dinner for honored guests",
    icon: "/image/Asset/9.png",
  },
];

export const AgendaSection: React.FC = () => {
  return (
    <Section className="bg-wedding-cream" ornate>
      <h3 className="section-title font-koulen gold-gradient-text">ពិធីមង្គលការ</h3>
      <p className="mt-2 text-sm font-sans text-wedding-brown/80 text-center uppercase tracking-wide">
        Agenda
      </p>
      <div className="space-y-8 relative mt-8">
        {agendaItems.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-[60px_1fr] gap-6 items-center bg-wedding-cream rounded-sm border border-wedding-gold/20 px-4 py-3 card-pattern"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-wedding-tan/10 rounded-full border border-wedding-tan/20 shadow-sm">
              <img src={item.icon} alt="icon" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <p className="text-wedding-main font-bold text-[12px] uppercase mb-1 font-sans">
                {item.time}
                <span className="block text-[11px] font-normal text-wedding-brown/70 normal-case">{item.timeEn}</span>
              </p>
              <h4 className="font-sans font-bold text-md text-wedding-gold leading-snug">{item.title}</h4>
              <p className="font-sans text-[12px] text-wedding-brown/80 mt-1">{item.titleEn}</p>
            </div>
          </motion.div>
        ))}
        <p className="text-[12px] text-center center"> សូមអភ័យទោសប្រសិនពិធីខាងលើនេះអាចនឹងមានការរប្រែប្រួល</p>
        <p className="text-[11px] text-center text-wedding-brown/80 mt-1 italic">
          Kindly note that the above schedule may be subject to change.
        </p>
      </div>
    </Section>
  );
};
