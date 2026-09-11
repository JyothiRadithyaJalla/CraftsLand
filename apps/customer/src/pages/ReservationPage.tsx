import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Clock, MapPin, CheckCircle, ArrowLeft, ArrowRight,
  User, Mail, Phone, MessageSquare, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { MetaTags } from '@shared/components/MetaTags';
import { SEATING_SECTIONS } from '@shared/config/constants';
import { useAuth } from '@shared/hooks/useAuth';
import { ReservationService } from '@shared/services/reservationService';
import type { SeatingSection, Reservation } from '@shared/types/reservation';

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
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 text-[#F5EFE5]">
        <MetaTags title="Reservation Confirmed | Craftsland" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#211B16] p-8 rounded-3xl text-center space-y-6 border border-[#3A3027] shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#B84A32]/10 rounded-full blur-3xl -z-10" />

          <div className="w-16 h-16 rounded-full bg-[#B84A32]/15 border border-[#B84A32] text-[#B84A32] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#B84A32] font-bold">
              Reservation Successfully Booked
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5EFE5]">
              Welcome to Craftsland
            </h1>
            <p className="text-xs sm:text-sm text-[#B8AEA1]">
              A dining table has been reserved under your name. A confirmation email has been dispatched to{' '}
              <span className="text-[#B84A32] font-semibold">{confirmedReservation.guestEmail}</span>.
            </p>
          </div>

          {/* Booking Reference Box */}
          <div className="bg-[#171310] border border-[#B84A32]/40 p-4 rounded-2xl space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#B8AEA1]">Booking Reference</span>
            <p className="font-mono text-2xl font-bold text-[#B84A32] tracking-widest">
              {confirmedReservation.bookingReference}
            </p>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-[#3A3027] pt-6">
            <div className="bg-[#171310] border border-[#3A3027] p-3 rounded-xl">
              <span className="text-[#B8AEA1] block text-[10px] uppercase">Date</span>
              <span className="font-bold text-[#F5EFE5]">{confirmedReservation.reservationDate}</span>
            </div>
            <div className="bg-[#171310] border border-[#3A3027] p-3 rounded-xl">
              <span className="text-[#B8AEA1] block text-[10px] uppercase">Time</span>
              <span className="font-bold text-[#B84A32]">{confirmedReservation.reservationTime}</span>
            </div>
            <div className="bg-[#171310] border border-[#3A3027] p-3 rounded-xl">
              <span className="text-[#B8AEA1] block text-[10px] uppercase">Party</span>
              <span className="font-bold text-[#F5EFE5]">{confirmedReservation.partySize} Guests</span>
            </div>
            <div className="bg-[#171310] border border-[#3A3027] p-3 rounded-xl">
              <span className="text-[#B8AEA1] block text-[10px] uppercase">Section</span>
              <span className="font-bold text-[#F5EFE5] truncate block">
                {SEATING_SECTIONS.find((s) => s.id === confirmedReservation.seatingSection)?.name || confirmedReservation.seatingSection}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              to="/account"
              className="flex-1 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              View My Reservations <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="py-3.5 px-6 rounded-full border border-[#3A3027] bg-[#171310] text-[#F5EFE5] hover:text-[#B84A32] hover:border-[#B84A32] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-[#F5EFE5]">
      <MetaTags title="Table Reservations | Craftsland" />

      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5EFE5]">
          Reserve Your Table
        </h1>
        <p className="text-[#B8AEA1] text-xs sm:text-sm tracking-wide max-w-lg mx-auto">
          Immerse in an unforgettable culinary experience. Select your preferred date, seating, and party size.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto border-b border-[#3A3027] pb-4 text-xs font-semibold">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 1 ? 'text-[#B84A32]' : step > 1 ? 'text-[#F5EFE5]' : 'text-[#B8AEA1]/60'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#B84A32] text-white font-bold' : 'bg-[#211B16] text-[#B8AEA1] border border-[#3A3027]'}`}>1</span>
          <span>Date & Guests</span>
        </button>
        <div className="w-8 h-px bg-[#3A3027]" />
        <button
          onClick={() => { if (step > 1) setStep(2); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 2 ? 'text-[#B84A32]' : step > 2 ? 'text-[#F5EFE5]' : 'text-[#B8AEA1]/60'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#B84A32] text-white font-bold' : 'bg-[#211B16] text-[#B8AEA1] border border-[#3A3027]'}`}>2</span>
          <span>Time & Seating</span>
        </button>
        <div className="w-8 h-px bg-[#3A3027]" />
        <button
          onClick={() => { if (step > 2) setStep(3); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 3 ? 'text-[#B84A32]' : step > 3 ? 'text-[#F5EFE5]' : 'text-[#B8AEA1]/60'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-[#B84A32] text-white font-bold' : 'bg-[#211B16] text-[#B8AEA1] border border-[#3A3027]'}`}>3</span>
          <span>Guest Details</span>
        </button>
        <div className="w-8 h-px bg-[#3A3027]" />
        <button
          onClick={() => { if (validateStep3()) setStep(4); }}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            step === 4 ? 'text-[#B84A32]' : 'text-[#B8AEA1]/60'
          }`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 4 ? 'bg-[#B84A32] text-white font-bold' : 'bg-[#211B16] text-[#B8AEA1] border border-[#3A3027]'}`}>4</span>
          <span>Confirm</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="bg-red-950/40 p-4 rounded-xl border border-red-900/50 text-red-300 flex items-center gap-3 text-xs max-w-2xl mx-auto">
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
            className="bg-[#211B16] border border-[#3A3027] p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto shadow-xl"
          >
            <h3 className="font-serif text-xl font-bold text-[#F5EFE5] border-b border-[#3A3027] pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#B84A32]" /> Select Date & Guests
            </h3>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#F5EFE5] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B84A32]" /> Reservation Date <span className="text-[#B84A32]">*</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-3 text-sm text-[#F5EFE5] focus:outline-none focus:border-[#B84A32] font-mono cursor-pointer"
              />
            </div>

            {/* Party Size Selector */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#F5EFE5] font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#B84A32]" /> Number of Guests (1 – 12) <span className="text-[#B84A32]">*</span>
              </label>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[1, 2, 4, 6, 8, 12].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPartySize(size)}
                    className={`py-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                      partySize === size
                        ? 'bg-[#B84A32] border-[#B84A32] text-white font-bold'
                        : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:text-[#F5EFE5]'
                    }`}
                  >
                    {size} {size === 1 ? 'Guest' : 'Guests'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-[#B8AEA1]">Custom Party Size:</span>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={partySize}
                  onChange={(e) => setPartySize(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                  className="w-24 bg-[#171310] border border-[#3A3027] rounded-lg px-3 py-1.5 text-xs text-[#F5EFE5] font-mono focus:outline-none focus:border-[#B84A32]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#3A3027]">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors"
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
            className="bg-[#211B16] border border-[#3A3027] p-6 sm:p-8 rounded-3xl space-y-6 max-w-3xl mx-auto shadow-xl"
          >
            <h3 className="font-serif text-xl font-bold text-[#F5EFE5] border-b border-[#3A3027] pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#B84A32]" /> Seating Section & Time Slot
            </h3>

            {/* Seating Section Visual Cards */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#F5EFE5] font-semibold">
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
                        ? 'bg-[#B84A32]/15 border-[#B84A32] text-[#F5EFE5] ring-1 ring-[#B84A32]'
                        : 'bg-[#171310] border-[#3A3027] text-[#B8AEA1] hover:border-[#B84A32]/40'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-serif font-bold text-sm text-[#F5EFE5]">{sec.name}</span>
                      {seatingSection === sec.id && <Sparkles className="w-4 h-4 text-[#D29A55]" />}
                    </div>
                    <p className="text-xs text-[#B8AEA1]">{sec.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Time Slots Grid */}
            <div className="space-y-3 pt-2">
              <label className="text-xs uppercase tracking-wider text-[#F5EFE5] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B84A32]" /> Available Time Slots
              </label>

              {isCheckingSlots ? (
                <div className="text-center py-6 text-xs text-[#B8AEA1] animate-pulse">
                  Checking table availability for {reservationDate}...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-red-950/40 p-4 rounded-xl text-center space-y-1 border border-red-900/50 text-red-300 text-xs">
                  <p className="font-semibold">No Table Slots Available</p>
                  <p className="text-[#B8AEA1]">All tables in this section are fully committed for the selected date. Please try another section or date.</p>
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
                          ? 'bg-[#B84A32] border-[#B84A32] text-white font-bold shadow-md'
                          : 'bg-[#171310] border-[#3A3027] text-[#F5EFE5] hover:border-[#B84A32]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#3A3027]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#B8AEA1] hover:text-[#B84A32] flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Date & Guests
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={availableSlots.length === 0}
                className="px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-40"
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
            className="bg-[#211B16] border border-[#3A3027] p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto shadow-xl"
          >
            <h3 className="font-serif text-xl font-bold text-[#F5EFE5] border-b border-[#3A3027] pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-[#B84A32]" /> Guest Contact Details
            </h3>

            {user && (
              <div className="bg-[#B84A32]/10 border border-[#B84A32]/30 p-3 rounded-xl text-xs text-[#B84A32] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Logged in as <strong>{user.fullName}</strong>. Profile information pre-filled below.</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#F5EFE5] font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#B84A32]" /> Full Name <span className="text-[#B84A32]">*</span>
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Sterling Vance"
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#F5EFE5] font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#B84A32]" /> Email Address <span className="text-[#B84A32]">*</span>
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="sterling@example.com"
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#F5EFE5] font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#B84A32]" /> Phone Number <span className="text-[#B84A32]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#F5EFE5] font-semibold flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#B84A32]" /> Special Requests or Occasion Notes (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Anniversary celebration, quiet corner table, champagne toast request..."
                  rows={3}
                  className="w-full bg-[#171310] border border-[#3A3027] rounded-xl px-4 py-2.5 text-sm text-[#F5EFE5] placeholder-[#B8AEA1]/50 focus:outline-none focus:border-[#B84A32]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#3A3027]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-[#B8AEA1] hover:text-[#B84A32] flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Time & Section
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors"
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
            className="bg-[#211B16] border border-[#3A3027] p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto shadow-xl"
          >
            <h3 className="font-serif text-xl font-bold text-[#F5EFE5] border-b border-[#3A3027] pb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#B84A32]" /> Confirm Table Booking
            </h3>

            {/* Summary Breakdown Card */}
            <div className="bg-[#171310] border border-[#3A3027] p-6 rounded-2xl space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-[#3A3027] pb-3">
                <span className="font-serif text-lg font-bold text-[#F5EFE5]">Reservation Overview</span>
                <span className="text-[10px] uppercase font-mono bg-[#B84A32]/20 text-[#B84A32] px-2.5 py-1 rounded-full font-bold">
                  Status: Pending Confirmation
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[#F5EFE5]">
                <div>
                  <span className="text-[#B8AEA1] block text-[10px]">Date:</span>
                  <span className="font-bold">{reservationDate}</span>
                </div>
                <div>
                  <span className="text-[#B8AEA1] block text-[10px]">Time Slot:</span>
                  <span className="text-[#B84A32] font-bold">{reservationTime}</span>
                </div>
                <div>
                  <span className="text-[#B8AEA1] block text-[10px]">Party Size:</span>
                  <span className="font-bold">{partySize} Guests</span>
                </div>
                <div>
                  <span className="text-[#B8AEA1] block text-[10px]">Seating Section:</span>
                  <span className="font-bold">{selectedSectionInfo?.name}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#3A3027] space-y-1">
                <div className="flex justify-between text-[#B8AEA1]">
                  <span>Guest Name:</span>
                  <span className="text-[#F5EFE5] font-bold">{guestName}</span>
                </div>
                <div className="flex justify-between text-[#B8AEA1]">
                  <span>Email:</span>
                  <span className="text-[#F5EFE5] font-bold">{guestEmail}</span>
                </div>
                <div className="flex justify-between text-[#B8AEA1]">
                  <span>Phone:</span>
                  <span className="text-[#F5EFE5] font-bold">{guestPhone}</span>
                </div>
                {specialRequests && (
                  <div className="pt-2 text-[#B8AEA1]">
                    <span className="block text-[10px]">Special Requests:</span>
                    <p className="text-xs italic text-[#F5EFE5] bg-[#211B16] border border-[#3A3027] p-2.5 rounded-lg mt-1">{specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#3A3027]">
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={isSubmitting}
                className="text-xs text-[#B8AEA1] hover:text-[#B84A32] flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Edit Guest Details
              </button>
              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-[#B84A32] hover:bg-[#8B3525] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
