/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
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
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

const AdminPage = React.lazy(() => import("./components/admin/AdminPage"));

export default function App() {
  const {
    showScrollTop,
    selectedImage,
    setSelectedImage,
    goToNextImage,
    goToPrevImage,
    wishes,
    name,
    setName,
    message,
    setMessage,
    isSubmitting,
    guestName,
    isLoadingGuest,
    isAdmin,
    setIsAdmin,
    guests,
    isPlaying,
    mainRef,
    secondSectionRef,
    handleSubmitWish,
    scrollToTop,
    scrollToContent,
    togglePlay,
    handleShare,
    handleGetLocation
  } = useWeddingApp();

  return (
    <Router>
      <AppRoutes
        showScrollTop={showScrollTop}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        goToNextImage={goToNextImage}
        goToPrevImage={goToPrevImage}
        wishes={wishes}
        name={name}
        setName={setName}
        message={message}
        setMessage={setMessage}
        isSubmitting={isSubmitting}
        guestName={guestName}
        isLoadingGuest={isLoadingGuest}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        guests={guests}
        isPlaying={isPlaying}
        mainRef={mainRef}
        secondSectionRef={secondSectionRef}
        handleSubmitWish={handleSubmitWish}
        scrollToTop={scrollToTop}
        scrollToContent={scrollToContent}
        togglePlay={togglePlay}
        handleShare={handleShare}
        handleGetLocation={handleGetLocation}
      />
    </Router>
  );
}

type AppContentProps = {
  showScrollTop: boolean;
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
  goToNextImage: () => void;
  goToPrevImage: () => void;
  wishes: any[];
  name: string;
  setName: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  isSubmitting: boolean;
  guestName: string;
  isLoadingGuest: boolean;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  guests: any[];
  isPlaying: boolean;
  mainRef: React.RefObject<HTMLDivElement>;
  secondSectionRef: React.RefObject<HTMLDivElement>;
  handleSubmitWish: (e: React.FormEvent) => void;
  scrollToTop: () => void;
  scrollToContent: () => void;
  togglePlay: () => void;
  handleShare: (imageUrl: string) => void;
  handleGetLocation: () => void;
};

function AppRoutes(props: AppContentProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const {
    showScrollTop,
    selectedImage,
    setSelectedImage,
    goToNextImage,
    goToPrevImage,
    wishes,
    name,
    setName,
    message,
    setMessage,
    isSubmitting,
    guestName,
    isLoadingGuest,
    isAdmin,
    setIsAdmin,
    guests,
    isPlaying,
    mainRef,
    secondSectionRef,
    handleSubmitWish,
    scrollToTop,
    scrollToContent,
    togglePlay,
    handleShare,
    handleGetLocation,
  } = props;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AppContent
              showScrollTop={showScrollTop}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              goToNextImage={goToNextImage}
              goToPrevImage={goToPrevImage}
              wishes={wishes}
              name={name}
              setName={setName}
              message={message}
              setMessage={setMessage}
              isSubmitting={isSubmitting}
              guestName={guestName}
              isLoadingGuest={isLoadingGuest}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              guests={guests}
              isPlaying={isPlaying}
              mainRef={mainRef}
              secondSectionRef={secondSectionRef}
              handleSubmitWish={handleSubmitWish}
              scrollToTop={scrollToTop}
              scrollToContent={scrollToContent}
              togglePlay={togglePlay}
              handleShare={handleShare}
              handleGetLocation={handleGetLocation}
            />
          }
        />
        {/* Admin panel - lazy-loaded to keep main bundle smaller */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div style={{ padding: "1.5rem", textAlign: "center" }}>Loading admin...</div>}>
              <AdminPage />
            </Suspense>
          }
        />

        {/* Handle short code URLs like /AbCDe0 by rendering the same content */}
        <Route
          path="/:code"
          element={
            <AppContent
              showScrollTop={showScrollTop}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              goToNextImage={goToNextImage}
              goToPrevImage={goToPrevImage}
              wishes={wishes}
              name={name}
              setName={setName}
              message={message}
              setMessage={setMessage}
              isSubmitting={isSubmitting}
              guestName={guestName}
              isLoadingGuest={isLoadingGuest}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              guests={guests}
              isPlaying={isPlaying}
              mainRef={mainRef}
              secondSectionRef={secondSectionRef}
              handleSubmitWish={handleSubmitWish}
              scrollToTop={scrollToTop}
              scrollToContent={scrollToContent}
              togglePlay={togglePlay}
              handleShare={handleShare}
              handleGetLocation={handleGetLocation}
            />
          }
        />
      </Routes>
      {!isAdminRoute && (
        <FloatingControls 
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          showScrollTop={showScrollTop}
          scrollToTop={scrollToTop}
        />
      )}
    </>
  );
}

function AppContent({
  showScrollTop,
  selectedImage,
  setSelectedImage,
  goToNextImage,
  goToPrevImage,
  wishes,
  name,
  setName,
  message,
  setMessage,
  isSubmitting,
  guestName,
  isLoadingGuest,
  isAdmin,
  setIsAdmin,
  guests,
  mainRef,
  secondSectionRef,
  handleSubmitWish,
  scrollToContent,
  togglePlay,
  handleShare,
  handleGetLocation,
}: AppContentProps) {
  return (
    <div className="bg-stone-200 min-h-screen">
      <div className="phone-container no-scrollbar" ref={mainRef}>
        <LandingSection 
          guestName={guestName} 
          isLoadingGuest={isLoadingGuest}
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
        </div>
      </div>

      <ImageModal 
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        handleShare={handleShare}
        goToNextImage={goToNextImage}
        goToPrevImage={goToPrevImage}
      />

      <AdminModal 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        guests={guests}
      />
    </div>
  );
}
