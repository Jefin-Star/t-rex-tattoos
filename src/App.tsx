import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { BookingPrefill, PortfolioSection } from './components/PortfolioSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill | null>(null);

  return (
    <div className="min-h-screen bg-[#060607] text-[#F5F2EB]">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <PortfolioSection onSelectForBooking={setBookingPrefill} />
        <BookingSection prefill={bookingPrefill} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
