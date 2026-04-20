import { baseApi } from '@/redux/api/baseApi';

export interface TopViewedBoat {
  id: string;
  name: string;
  price: number;
  buildYear: number;
  make: string;
  model: string;
  city: string;
  state: string;
  status: string;
  pageViewCount: number;
  images: { file: { url: string } }[];
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
