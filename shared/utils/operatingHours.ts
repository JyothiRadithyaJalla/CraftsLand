import { RESTAURANT_BRAND } from '../config/constants';

export interface RestaurantLiveStatus {
  isOpen: boolean;
  statusLabel: 'OPEN NOW' | 'CLOSED';
  detailText: string;
}

const DAYS_MAP: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

/**
 * Deterministically parses the restaurant operating hours string (e.g. "Tue - Sun: 16:30 - 23:30")
 * and calculates live open/closed status against the current time.
 */
export function getRestaurantLiveStatus(hoursString: string = RESTAURANT_BRAND.operatingHours): RestaurantLiveStatus {
  try {
    const match = hoursString.match(/([a-zA-Z]+)\s*-\s*([a-zA-Z]+):\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!match) {
      return {
        isOpen: true,
        statusLabel: 'OPEN NOW',
        detailText: hoursString,
      };
    }

    const [, startDayStr, endDayStr, startHourStr, startMinStr, endHourStr, endMinStr] = match;
    const startDay = DAYS_MAP[startDayStr.toLowerCase().slice(0, 3)] ?? 0;
    const endDay = DAYS_MAP[endDayStr.toLowerCase().slice(0, 3)] ?? 6;
    const startHour = parseInt(startHourStr, 10);
    const startMin = parseInt(startMinStr, 10);
    const endHour = parseInt(endHourStr, 10);
    const endMin = parseInt(endMinStr, 10);

    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const openMinutes = startHour * 60 + startMin;
    const closeMinutes = endHour * 60 + endMin;

    const isDayValid =
      startDay <= endDay
        ? currentDay >= startDay && currentDay <= endDay
        : currentDay >= startDay || currentDay <= endDay;

    const isTimeValid = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    if (isDayValid && isTimeValid) {
      return {
        isOpen: true,
        statusLabel: 'OPEN NOW',
        detailText: `Closes at ${endHourStr}:${endMinStr}`,
      };
    }

    return {
      isOpen: false,
      statusLabel: 'CLOSED',
      detailText: `Opens at ${startHourStr}:${startMinStr}`,
    };
  } catch {
    return {
      isOpen: false,
      statusLabel: 'CLOSED',
      detailText: hoursString,
    };
  }
}