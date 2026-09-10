import type { Reservation } from '../types/reservation';
import { env } from '../config/env';
import { supabase } from './supabaseClient';
import { MOCK_RESERVATIONS } from './mockData';

export class ReservationService {
  static async getReservations(): Promise<Reservation[]> {
    if (env.isDevelopment) {
      return MOCK_RESERVATIONS;
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: true });

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      bookingReference: r.booking_reference,
      customerId: r.customer_id,
      guestName: r.guest_name,
      guestEmail: r.guest_email,
      guestPhone: r.guest_phone,
      partySize: r.party_size,
      reservationDate: r.reservation_date,
      reservationTime: r.reservation_time,
      seatingSection: r.seating_section,
      specialRequests: r.special_requests,
      status: r.status,
      createdAt: r.created_at,
    }));
  }
}
