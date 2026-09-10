export interface AnalyticsSummary {
  dailyRevenue: number;
  activeOrdersCount: number;
  reservationsTodayCount: number;
  averageOrderValue: number;
}

export class AnalyticsService {
  static async getSummary(): Promise<AnalyticsSummary> {
    return {
      dailyRevenue: 4890.00,
      activeOrdersCount: 8,
      reservationsTodayCount: 14,
      averageOrderValue: 185.50,
    };
  }
}
