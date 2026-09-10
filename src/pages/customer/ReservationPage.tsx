import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Clock, MapPin, CheckCircle, ArrowLeft, ArrowRight,
  User, Mail, Phone, MessageSquare, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { MetaTags } from '../../components/common/MetaTags';
import { SEATING_SECTIONS } from '../../config/constants';
import { useAuth } from '../../hooks/useAuth';
import { ReservationService } from '../../services/reservationService';
import type { SeatingSection, Reservation } from '../../types/reservation';

export const ReservationPage: React.FC = () => {
  const { user } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [reservationDate, setReservationDate] = useState<string>(todayStr);
  const [partySize, setPartySize] = useState<number>(2);
  const [seatingSection, setSeatingSection] = useState<SeatingSection>('MAIN_DINING');
  const [reservationTime, setReservationTime] = useState<string>('19:00');
  const [guestName, setGuestName] = useState<string>(user?.fullName || '');
  const [guestEmail, setGuestEmail] = useState<string>(user?.email || '');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Availability & Loading States
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success State
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Fetch available slots whenever date, partySize, or seatingSection changes
  useEffect(() => {
    let isMounted = true;
    const fetchSlots = async () => {
      setIsCheckingSlots(true);
      setErrorMsg(null);
      try {
        const slots = await ReservationService.checkAvailability(
          reservationDate,
          partySize,
          seatingSection
        );
        if (isMounted) {
          setAvailableSlots(slots);
          if (slots.length > 0 && !slots.includes(reservationTime)) {
            setReservationTime(slots[0]);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg('Failed to check table availability. Please try another date or section.');
        }
      } finally {
        if (isMounted) setIsCheckingSlots(false);
      }
    };

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [reservationDate, partySize, seatingSection]);

  const validateStep3 = (): boolean => {
    setErrorMsg(null);
    if (!guestName.trim()) {
      setErrorMsg('Please enter your full name for the booking ticket.');
      return false;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 6) {
      setErrorMsg('Please enter a valid phone number for SMS confirmation.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!reservationDate) {
        setErrorMsg('Please select a reservation date.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!reservationTime) {
        setErrorMsg('Please select an available time slot.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (validateStep3()) {
        setStep(4);
      }
    }
  };

  const handleConfirmReservation = async () => {
    if (!validateStep3()) {
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await ReservationService.createReservation({
        reservationDate,
        reservationTime,
        partySize,
        seatingSection,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests: specialRequests.trim() || undefined,
        customerId: user?.id,
      });

      setConfirmedReservation(res);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit table reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSectionInfo = SEATING_SECTIONS.find((s) => s.id === seatingSection);

  // SUCCESS CONFIRMATION VIEW
  if (confirmedReservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-[#F4F1EA]">
        <MetaTags title="Reservation Confirmed | L'Étoile Noir" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-3xl text-center space-y-6 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl -z-10" />

          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Reservation Successfully Booked
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold-gradient">
              Welcome to L'Étoile Noir
            </h1>
            <p className="text-xs sm:text-sm text-gray-300">
              A dining table has been reserved under your name. A confirmation email has been dispatched to{' '}
              <span className="text-[#D4AF37] font-semibold">{confirmedReservation.guestEmail}</span>.
            </p>
          </div>

          {/* Booking Reference Box */}
          <div className="bg-[#12141C] border border-[#D4AF37]/40 p-4 rounded-2xl space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-gray-400">Booking Reference</span>
            <p className="font-mono text-2xl font-bold text-[#D4AF37] tracking-widest">
              {confirmedReservation.bookingReference}
            </p>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-white/10 pt-6">
            <div className="glass-card p-3 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase">Date</span>
              <span className="font-bold text-[#F4F1EA]">{confirmedReservation.reservationDate}</span>
            </div>
            <div className="glass-card p-3 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase">Time</span>
              <span className="font-bold text-[#D4AF37]">{confirmedReservation.reservationTime}</span>
            </div>
            <div className="glass-card p-3 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase">Party</span>
              <span className="font-bold text-[#F4F1EA]">{confirmedReservation.partySize} Guests</span>
            </div>
            <div className="glass-card p-3 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase">Section</span>
              <span className="font-bold text-[#F4F1EA] truncate block">
                {SEATING_SECTIONS.find((s) => s.id === confirmedReservation.seatingSection)?.name || confirmedReservation.seatingSection}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              to="/account"
              className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-90"
            >
              View My Reservations <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="py-3.5 px-6 rounded-full border border-white/15 text-gray-300 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // MULTI-STEP WIZARD VIEW
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-[#F4F1EA]">
      <MetaTags title="Table Reservations | L'Étoile Noir" />

      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold-gradient">
          Reserve Your Table
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm tracking-wide max-w-lg mx-auto">
          Immerse in an unforgettable sensory dining experience. Select your preferred date, seating, and party size.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto border-b border-white/10 pb-4 text-xs font-semibold">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 1 ? 'text-[#D4AF37]' : step > 1 ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#D4AF37] text-[#0B0C10] font-bold' : 'bg-white/10'}`}>1</span>
          <span>Date & Guests</span>
        </button>
        <div className="w-6 h-px bg-white/10" />
        <button
          onClick={() => { if (step > 1) setStep(2); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 2 ? 'text-[#D4AF37]' : step > 2 ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#D4AF37] text-[#0B0C10] font-bold' : 'bg-white/10'}`}>2</span>
          <span>Time & Seating</span>
        </button>
        <div className="w-6 h-px bg-white/10" />
        <button
          onClick={() => { if (step > 2) setStep(3); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 3 ? 'text-[#D4AF37]' : step > 3 ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-[#D4AF37] text-[#0B0C10] font-bold' : 'bg-white/10'}`}>3</span>
          <span>Guest Details</span>
        </button>
        <div className="w-6 h-px bg-white/10" />
        <button
          onClick={() => { if (validateStep3()) setStep(4); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 4 ? 'text-[#D4AF37]' : 'text-gray-500'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 4 ? 'bg-[#D4AF37] text-[#0B0C10] font-bold' : 'bg-white/10'}`}>4</span>
          <span>Confirm</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="glass-card p-4 rounded-xl border border-red-500/40 bg-red-950/20 text-red-300 flex items-center gap-3 text-xs max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Wizard Content */}
      <AnimatePresence mode="wait">
        {/* STEP 1: DATE & PARTY SIZE */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto"
          >
            <h3 className="font-serif text-xl font-bold text-[#F4F1EA] border-b border-white/10 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#D4AF37]" /> Select Date & Guests
            </h3>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Reservation Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="w-full bg-[#12141C] border border-white/15 rounded-xl px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37] font-mono cursor-pointer"
              />
            </div>

            {/* Party Size Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> Number of Guests (1 – 12) <span className="text-red-400">*</span>
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[1, 2, 4, 6, 8, 12].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPartySize(size)}
                    className={`py-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                      partySize === size
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-bold ring-1 ring-[#D4AF37]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {size} {size === 1 ? 'Guest' : 'Guests'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-gray-400">Custom Party Size:</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={partySize}
                  onChange={(e) => setPartySize(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                  className="w-24 bg-[#12141C] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F4F1EA] font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg hover:opacity-90"
              >
                Choose Time & Section <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: TIME & SEATING SECTION */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 max-w-3xl mx-auto"
          >
            <h3 className="font-serif text-xl font-bold text-[#F4F1EA] border-b border-white/10 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" /> Seating Section & Time Slot
            </h3>

            {/* Seating Section Visual Cards */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
                Select Dining Ambience & Section
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SEATING_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSeatingSection(sec.id as SeatingSection)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                      seatingSection === sec.id
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#F4F1EA] ring-1 ring-[#D4AF37]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-sm text-[#F4F1EA]">{sec.name}</span>
                      {seatingSection === sec.id && <Sparkles className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <p className="text-xs text-gray-400">{sec.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Time Slots Grid */}
            <div className="space-y-3 pt-2">
              <label className="text-xs uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Available Time Slots
              </label>

              {isCheckingSlots ? (
                <div className="text-center py-6 text-xs text-gray-400 animate-pulse">
                  Checking table availability for {reservationDate}...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="glass-card p-4 rounded-xl text-center space-y-1 bg-red-950/10 border border-red-500/20 text-red-300 text-xs">
                  <p className="font-semibold">No Table Slots Available</p>
                  <p className="text-gray-400">All tables in this section are fully committed for the selected date. Please try another section or date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setReservationTime(slot)}
                      className={`py-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                        reservationTime === slot
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0B0C10] font-bold shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Date & Guests
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={availableSlots.length === 0}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg hover:opacity-90 disabled:opacity-40"
              >
                Guest Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: GUEST DETAILS */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto"
          >
            <h3 className="font-serif text-xl font-bold text-[#F4F1EA] border-b border-white/10 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-[#D4AF37]" /> Guest Contact Details
            </h3>

            {user && (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl text-xs text-[#D4AF37] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Logged in as <strong>{user.fullName}</strong>. Profile information pre-filled below.</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Lord Sterling Vance"
                  className="w-full bg-[#12141C] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="sterling@vance-holdings.com"
                    className="w-full bg-[#12141C] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#12141C] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" /> Special Requests or Occasion Notes (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Anniversary celebration, quiet corner table, champagne toast request..."
                  rows={3}
                  className="w-full bg-[#12141C] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Time & Section
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg hover:opacity-90"
              >
                Review Booking <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: CONFIRMATION & SUMMARY */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto"
          >
            <h3 className="font-serif text-xl font-bold text-[#F4F1EA] border-b border-white/10 pb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> Confirm Table Booking
            </h3>

            {/* Summary Breakdown Card */}
            <div className="glass-card p-6 rounded-2xl space-y-4 text-xs bg-[#12141C]/90">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="font-serif text-lg font-bold text-gold-gradient">Reservation Overview</span>
                <span className="text-[10px] uppercase font-mono bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full font-bold">
                  Status: Pending Confirmation
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-gray-300">
                <div>
                  <span className="text-gray-400 block text-[10px]">Date:</span>
                  <span className="text-[#F4F1EA] font-bold">{reservationDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Time Slot:</span>
                  <span className="text-[#D4AF37] font-bold">{reservationTime}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Party Size:</span>
                  <span className="text-[#F4F1EA] font-bold">{partySize} Guests</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Seating Section:</span>
                  <span className="text-[#F4F1EA] font-bold">{selectedSectionInfo?.name}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-1">
                <div className="flex justify-between text-gray-300">
                  <span>Guest Name:</span>
                  <span className="text-[#F4F1EA] font-bold">{guestName}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Email:</span>
                  <span className="text-[#F4F1EA] font-bold">{guestEmail}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Phone:</span>
                  <span className="text-[#F4F1EA] font-bold">{guestPhone}</span>
                </div>
                {specialRequests && (
                  <div className="pt-2 text-gray-300">
                    <span className="text-gray-400 block text-[10px]">Special Requests:</span>
                    <p className="text-xs italic text-[#F4F1EA] bg-white/5 p-2.5 rounded-lg mt-1">{specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={isSubmitting}
                className="text-xs text-gray-400 hover:text-[#D4AF37] flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Edit Guest Details
              </button>
              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F4F1EA] to-[#D4AF37] text-[#0B0C10] font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-xl hover:opacity-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Confirming Reservation...
                  </span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Confirm Reservation
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
