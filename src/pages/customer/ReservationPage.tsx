import React, { useState } from 'react';
import { MetaTags } from '../../components/common/MetaTags';
import { Calendar, Users, Clock, MapPin, CheckCircle } from 'lucide-react';
import { SEATING_SECTIONS } from '../../config/constants';

export const ReservationPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <MetaTags title="Table Reservations | L'Étoile Noir" />
      <div className="text-center space-y-3">
        <h1 className="font-serif text-4xl font-bold text-gold-gradient">Reserve Your Experience</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Select your desired date, seating section, and party size for an unparalleled dining journey.
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-[#D4AF37] mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#F4F1EA]">Reservation Confirmed</h2>
          <p className="text-gray-400 text-xs font-mono">Reference Code: #RES-4012</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="date" required className="w-full pl-10 pr-4 py-2 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select required className="w-full pl-10 pr-4 py-2 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                  <option value="18:00">18:00 (Dinner)</option>
                  <option value="19:30">19:30 (Dinner)</option>
                  <option value="21:00">21:00 (Late Seat)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Party Size</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select required className="w-full pl-10 pr-4 py-2 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6 Guests</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Seating Section</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select required className="w-full pl-10 pr-4 py-2 bg-[#12141C] border border-[#D4AF37]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#D4AF37]">
                  {SEATING_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8C7853] text-[#0B0C10] font-bold text-xs uppercase tracking-widest cursor-pointer">
            Confirm Booking
          </button>
        </form>
      )}
    </div>
  );
};
