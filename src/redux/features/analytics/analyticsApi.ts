import { baseApi } from '@/redux/api/baseApi';

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAnalyticsStats: build.query({
      query: () => ({
        url: `/visitor/analytics/overview`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAnalyticsStatsQuery } = analyticsApi;
