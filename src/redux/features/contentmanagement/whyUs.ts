import { baseApi } from '@/redux/api/baseApi';
import type { SiteParam, WhyUsParams } from './types';

export const whyUsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWhyUs: build.query({
      query: (site) => ({
        url: `/why-us?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [{ type: 'WhyUs', id: site }],
      keepUnusedDataFor: 0,
    }),

    createWhyUs: build.mutation({
      query: ({ whyUsContent }: WhyUsParams) => ({
        url: `/why-us`,
        method: 'POST',
        body: whyUsContent,
      }),
      invalidatesTags: (_result, _error, { whyUsContent }) => [
        { type: 'WhyUs', id: whyUsContent.site },
      ],
    }),

    updateWhyUs: build.mutation({
      query: ({ site, whyUsContent }: WhyUsParams) => ({
        url: `/why-us?site=${site}`,
        method: 'PATCH',
        body: whyUsContent,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'WhyUs', id: site },
      ],
    }),

    deleteWhyUs: build.mutation({
      query: ({ site }: SiteParam) => ({
        url: `/why-us?site=${site}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'WhyUs', id: site },
      ],
    }),
  }),
});

export const {
  useGetWhyUsQuery,
  useCreateWhyUsMutation,
  useUpdateWhyUsMutation,
  useDeleteWhyUsMutation,
} = whyUsApi;
