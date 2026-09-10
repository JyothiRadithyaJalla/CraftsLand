export type SeatingSection = 'MAIN_DINING' | 'CHEFS_COUNTER' | 'TERRACE' | 'PRIVATE_VAULT';

export type ReservationStatus = 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED';

export interface Reservation {
  id: string;
  bookingReference: string;
  customerId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  seatingSection: SeatingSection;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}
