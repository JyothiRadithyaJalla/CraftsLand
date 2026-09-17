import type { Reservation, CreateReservationPayload, SeatingSection, ReservationStatus } from '../types/reservation';
import { env } from '../config/env';
import { supabase } from './supabaseClient';
import { MOCK_RESERVATIONS } from './mockData';

export const ALL_TIME_SLOTS = [
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
];

export class ReservationService {
  /**
   * Fetch all reservations (for Admin / KDS or fallback list).
   */
  static async getReservations(): Promise<Reservation[]> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      return MOCK_RESERVATIONS;
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: true });

    if (error || !data) return [];

    return data.map((r) => this.mapSupabaseReservation(r));
  }

  /**
   * Fetch a single reservation by ID or booking reference.
   */
  static async getReservationById(idOrRef: string): Promise<Reservation | null> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const res = MOCK_RESERVATIONS.find(
        (r) => r.id === idOrRef || r.bookingReference.toLowerCase() === idOrRef.toLowerCase()
      );
      return res || null;
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .or(`id.eq.${idOrRef},booking_reference.eq.${idOrRef}`)
      .single();

    if (error || !data) return null;

    return this.mapSupabaseReservation(data);
  }

  /**
   * Fetch reservations for a specific customer or guest email.
   */
  static async getCustomerReservations(customerId?: string, email?: string): Promise<Reservation[]> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      return MOCK_RESERVATIONS.filter(
        (r) => (customerId && r.customerId === customerId) || (email && r.guestEmail === email)
      );
    }

    let query = supabase.from('reservations').select('*').order('reservation_date', { ascending: false });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    } else if (email) {
      query = query.eq('guest_email', email);
    } else {
      return [];
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r) => this.mapSupabaseReservation(r));
  }

  /**
   * Check available time slots for a given date, party size, and seating section.
   */
  static async checkAvailability(
    date: string,
    partySize: number,
    seatingSection: SeatingSection
  ): Promise<string[]> {
    if (partySize < 1 || partySize > 12) return [];

    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      // Filter out slots already taken for this section on this date
      const bookedSlots = MOCK_RESERVATIONS
        .filter(
          (r) =>
            r.reservationDate === date &&
            r.seatingSection === seatingSection &&
            r.status !== 'CANCELLED'
        )
        .map((r) => r.reservationTime);

      return ALL_TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
    }

    const { data, error } = await supabase
      .from('reservations')
      .select('reservation_time')
      .eq('reservation_date', date)
      .eq('seating_section', seatingSection)
      .in('status', ['CONFIRMED', 'SEATED']);

    if (error || !data) return ALL_TIME_SLOTS;

    const bookedSlots = data.map((r) => r.reservation_time);
    return ALL_TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
  }

  /**
   * Create a new table reservation.
   */
  static async createReservation(payload: CreateReservationPayload): Promise<Reservation> {
    // Generate unique booking reference format: LN-XXXXX (5 random alphanumeric uppercase)
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingReference = `LN-${randomChars}`;

    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        bookingReference,
        customerId: payload.customerId,
        guestName: payload.guestName,
        guestEmail: payload.guestEmail,
        guestPhone: payload.guestPhone,
        partySize: payload.partySize,
        reservationDate: payload.reservationDate,
        reservationTime: payload.reservationTime,
        seatingSection: payload.seatingSection,
        specialRequests: payload.specialRequests || undefined,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      MOCK_RESERVATIONS.unshift(newReservation);
      return newReservation;
    }

    // Production Supabase Persistence via Concurrency-Safe RPC
    const rpcPayload = {
      party_size: payload.partySize,
      reservation_date: payload.reservationDate,
      reservation_time: payload.reservationTime,
      seating_section: payload.seatingSection,
      guest_name: payload.guestName,
      guest_email: payload.guestEmail,
      guest_phone: payload.guestPhone,
      special_requests: payload.specialRequests || null,
    };

    const { data: rpcData, error: rpcError } = await supabase.rpc('create_verified_reservation', {
      p_payload: rpcPayload,
    });

    if (rpcError || !rpcData) {
      // If RPC failed due to capacity error, propagate clear error
      console.error('Reservation creation RPC failed:', rpcError);
      throw new Error(rpcError?.message || 'Failed to create table reservation with concierge registry.');
    }

    const createdRes = await this.getReservationById(rpcData.id || rpcData.booking_reference);
    if (!createdRes) {
      return {
        id: rpcData.id,
        bookingReference: rpcData.booking_reference,
        customerId: payload.customerId,
        guestName: payload.guestName,
        guestEmail: payload.guestEmail,
        guestPhone: payload.guestPhone,
        partySize: payload.partySize,
        reservationDate: payload.reservationDate,
        reservationTime: payload.reservationTime,
        seatingSection: payload.seatingSection,
        specialRequests: payload.specialRequests,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };
    }

    return createdRes;
  }

  /**
   * Cancel an existing reservation.
   */
  static async cancelReservation(id: string): Promise<boolean> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const res = MOCK_RESERVATIONS.find((r) => r.id === id || r.bookingReference === id);
      if (res) {
        res.status = 'CANCELLED';
        return true;
      }
      return false;
    }

    const { error } = await supabase
      .from('reservations')
      .update({ status: 'CANCELLED' })
      .or(`id.eq.${id},booking_reference.eq.${id}`);

    return !error;
  }

  /**
   * Update status of an existing reservation (Admin / Staff).
   */
  static async updateReservationStatus(id: string, status: ReservationStatus): Promise<boolean> {
    if (env.isDevelopment && !env.supabaseUrl.includes('.supabase.co')) {
      const res = MOCK_RESERVATIONS.find((r) => r.id === id || r.bookingReference === id);
      if (res) {
        res.status = status;
        return true;
      }
      return false;
    }

    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .or(`id.eq.${id},booking_reference.eq.${id}`);

    return !error;
  }

  private static mapSupabaseReservation(r: any): Reservation {
    return {
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
    };
  }
}
