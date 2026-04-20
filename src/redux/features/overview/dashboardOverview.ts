import { baseApi } from '@/redux/api/baseApi';

export interface TopViewedBoat {
  listingId: string;
  source: 'boats-com' | 'yachtbroker';
  name: string;
  make: string | null;
  model: string | null;
  buildYear: number | null;
  price: number | null;
  city: string | null;
  state: string | null;
  imageUrl: string | null;
  viewCount: number;
}

const dashboardOverviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboardOverview: build.query({
      query: () => ({
        url: `/admin/dashboard/summary`,
        method: 'GET',
      }),
    }),

    getRecentActivity: build.query({
      query: () => ({
        url: `/admin/dashboard/recent-activity`,
        method: 'GET',
      }),
    }),

    getPerformanceOverview: build.query({
      query: () => ({
        url: `/admin/dashboard/performance-overview`,
        method: 'GET',
      }),
    }),

    getTopViewedBoats: build.query<TopViewedBoat[], void>({
      query: () => ({
        url: `/boats/top-viewed`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetRecentActivityQuery,
  useGetPerformanceOverviewQuery,
  useGetTopViewedBoatsQuery,
} = dashboardOverviewApi;
