import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DailyLeadsResponse, Lead } from '@/types/daily-leads-types';

const AI_API_URL =
  import.meta.env.VITE_AI_API_URL || 'https://ai.jupitermarinesales.com/api/v1';

// Create separate API for AI endpoints (no auth needed)
export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: AI_API_URL,
  }),
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  tagTypes: ['DailyLeads'],
  endpoints: (builder) => ({
    getDailyLeads: builder.query<DailyLeadsResponse, void>({
      query: () => '/leads',
      providesTags: ['DailyLeads'],
    }),
    generateDailyLeads: builder.mutation<DailyLeadsResponse, void>({
      query: () => '/generate_daily_leads',
      invalidatesTags: ['DailyLeads'],
    }),
    updateLeadStatus: builder.mutation<
      { status: string; message: string; lead: Lead },
      { leadId: number; status: 'not contacted' | 'contacted' }
    >({
      query: ({ leadId, status }) => ({
        url: `/leads/${leadId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['DailyLeads'],
    }),
  }),
});

export const {
  useGetDailyLeadsQuery,
  useGenerateDailyLeadsMutation,
  useUpdateLeadStatusMutation,
} = aiApi;
