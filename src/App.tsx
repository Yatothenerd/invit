/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useWeddingApp } from './hooks/useWeddingApp';
import { LandingSection } from './components/sections/LandingSection';
import { FormalInvitationSection } from './components/sections/FormalInvitationSection';
import { AgendaSection } from './components/sections/AgendaSection';
import { GallerySection } from './components/sections/GallerySection';
import { SupportSection } from './components/sections/SupportSection';
import { LocationSection } from './components/sections/LocationSection';
import { WishingCardSection } from './components/sections/WishingCardSection';
import { Footer } from './components/sections/Footer';
import { ImageModal } from './components/modals/ImageModal';
import { AdminModal } from './components/modals/AdminModal';
import { FloatingControls } from './components/FloatingControls';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./components/admin/AdminPage";

export default function App() {
  const {
    showScrollTop,
    selectedImage,
    setSelectedImage,
    wishes,
    name,
    setName,
    message,
    setMessage,
    isSubmitting,
    guestName,
    isAdmin,
    setIsAdmin,
    guests,
    isMuted,
    mainRef,
    secondSectionRef,
    handleSubmitWish,
    scrollToTop,
    scrollToContent,
    toggleMute,
    handleShare,
    handleGetLocation
  } = useWeddingApp();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppContent
              showScrollTop={showScrollTop}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              wishes={wishes}
              name={name}
              setName={setName}
              message={message}
              setMessage={setMessage}
              isSubmitting={isSubmitting}
              guestName={guestName}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              guests={guests}
              isMuted={isMuted}
              mainRef={mainRef}
              secondSectionRef={secondSectionRef}
              handleSubmitWish={handleSubmitWish}
              scrollToTop={scrollToTop}
              scrollToContent={scrollToContent}
              toggleMute={toggleMute}
              handleShare={handleShare}
              handleGetLocation={handleGetLocation}
            />
          }
        />
        {/* Admin panel */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Handle short code URLs like /AbCDe0 by rendering the same content */}
        <Route
          path="/:code"
          element={
            <AppContent
              showScrollTop={showScrollTop}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              wishes={wishes}
              name={name}
              setName={setName}
              message={message}
              setMessage={setMessage}
              isSubmitting={isSubmitting}
              guestName={guestName}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              guests={guests}
              isMuted={isMuted}
              mainRef={mainRef}
              secondSectionRef={secondSectionRef}
              handleSubmitWish={handleSubmitWish}
              scrollToTop={scrollToTop}
              scrollToContent={scrollToContent}
              toggleMute={toggleMute}
              handleShare={handleShare}
              handleGetLocation={handleGetLocation}
            />
          }
        />
      </Routes>
    </Router>
  );
}

type AppContentProps = {
  showScrollTop: boolean;
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
  wishes: any[];
  name: string;
  setName: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  isSubmitting: boolean;
  guestName: string;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  guests: any[];
  isMuted: boolean;
  mainRef: React.RefObject<HTMLDivElement>;
  secondSectionRef: React.RefObject<HTMLDivElement>;
  handleSubmitWish: (e: React.FormEvent) => void;
  scrollToTop: () => void;
  scrollToContent: () => void;
  toggleMute: () => void;
  handleShare: (imageUrl: string) => void;
  handleGetLocation: () => void;
};

function AppContent({
  showScrollTop,
  selectedImage,
  setSelectedImage,
  wishes,
  name,
  setName,
  message,
  setMessage,
  isSubmitting,
  guestName,
  isAdmin,
  setIsAdmin,
  guests,
  isMuted,
  mainRef,
  secondSectionRef,
  handleSubmitWish,
  scrollToTop,
  scrollToContent,
  toggleMute,
  handleShare,
  handleGetLocation,
}: AppContentProps) {
  return (
    <div className="bg-stone-200 min-h-screen">
      <div className="phone-container no-scrollbar" ref={mainRef}>
        <LandingSection 
          guestName={guestName} 
          scrollToContent={scrollToContent} 
        />

        <div ref={secondSectionRef}>
          <FormalInvitationSection />
          <AgendaSection />
          <GallerySection setSelectedImage={setSelectedImage} />
          <SupportSection />
          <LocationSection handleGetLocation={handleGetLocation} />
          <WishingCardSection 
            name={name}
            setName={setName}
            message={message}
            setMessage={setMessage}
            isSubmitting={isSubmitting}
            handleSubmitWish={handleSubmitWish}
            wishes={wishes}
          />
          <Footer />
          
          <FloatingControls 
            isMuted={isMuted}
            toggleMute={toggleMute}
            showScrollTop={showScrollTop}
            scrollToTop={scrollToTop}
          />
        </div>
      </div>

      <ImageModal 
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
      />

      <AdminModal 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        guests={guests}
      />
    </div>
  );
}
