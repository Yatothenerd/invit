import React from 'react';

export const Flourish = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 40" className={`w-48 h-auto ${className}`} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flourishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bf953f" />
        <stop offset="20%" stopColor="#fcf6ba" />
        <stop offset="40%" stopColor="#b38728" />
        <stop offset="60%" stopColor="#fbf5b7" />
        <stop offset="80%" stopColor="#aa771c" />
        <stop offset="100%" stopColor="#bf953f" />
      </linearGradient>
    </defs>
    <path 
      d="M10,20 C15,5 35,5 50,20 C65,5 85,5 90,20 C85,35 65,35 50,20 C35,35 15,35 10,20 Z" 
      fill="none" 
      stroke="url(#flourishGradient)" 
      strokeWidth="0.5" 
    />
    <path 
      d="M5,20 Q25,0 50,20 T95,20" 
      fill="none" 
      stroke="url(#flourishGradient)" 
      strokeWidth="0.3" 
      opacity="0.6"
    />
    <path 
      d="M5,20 Q25,40 50,20 T95,20" 
      fill="none" 
      stroke="url(#flourishGradient)" 
      strokeWidth="0.3" 
      opacity="0.6"
    />
    <path d="M30,20 C25,10 20,15 25,20 S35,25 30,20" fill="none" stroke="url(#flourishGradient)" strokeWidth="0.2" />
    <path d="M70,20 C75,10 80,15 75,20 S65,25 70,20" fill="none" stroke="url(#flourishGradient)" strokeWidth="0.2" />
    <path d="M40,15 Q45,10 50,15 T60,15" fill="none" stroke="url(#flourishGradient)" strokeWidth="0.2" />
    <path d="M40,25 Q45,30 50,25 T60,25" fill="none" stroke="url(#flourishGradient)" strokeWidth="0.2" />
    <circle cx="50" cy="20" r="1.5" fill="url(#flourishGradient)" />
    <circle cx="20" cy="20" r="0.8" fill="url(#flourishGradient)" opacity="0.8" />
    <circle cx="80" cy="20" r="0.8" fill="url(#flourishGradient)" opacity="0.8" />
    <circle cx="35" cy="20" r="0.5" fill="url(#flourishGradient)" opacity="0.5" />
    <circle cx="65" cy="20" r="0.5" fill="url(#flourishGradient)" opacity="0.5" />
  </svg>
);

export const CornerDecor = () => (
  <>
    <div className="absolute top-0 left-0 w-20 h-20 ornate-corner ornate-corner-tl z-10"></div>
    <div className="absolute top-0 right-0 w-20 h-20 ornate-corner ornate-corner-tr z-10"></div>
    <div className="absolute bottom-0 left-0 w-20 h-20 ornate-corner ornate-corner-bl z-10"></div>
    <div className="absolute bottom-0 right-0 w-20 h-20 ornate-corner ornate-corner-br z-10"></div>
  </>
);

export const Section = ({ children, className = "", ornate = false }: { children: React.ReactNode, className?: string, ornate?: boolean }) => (
  <section className={`min-h-screen py-24 px-8 flex flex-col justify-center relative floral-pattern ${className}`}>
    {ornate && (
      <>
        <div className="absolute top-0 left-0 right-0 h-16 floral-border-top"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 floral-border-bottom"></div>
        <div className="absolute inset-4 border border-wedding-gold/20 pointer-events-none"></div>
        <div className="absolute inset-6 border border-wedding-gold/10 pointer-events-none"></div>
        <CornerDecor />
      </>
    )}
    <div className="relative z-10">
      {children}
    </div>
  </section>
);
