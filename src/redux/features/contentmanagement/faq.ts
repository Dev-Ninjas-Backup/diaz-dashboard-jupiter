import { baseApi } from '@/redux/api/baseApi';
import type { FaqParams, SiteParam } from './types';

export const faqApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFaq: build.query({
      query: (site) => ({
        url: `/faq?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [{ type: 'FAQ', id: site }],
      keepUnusedDataFor: 0,
    }),

    createFaq: build.mutation({
      query: ({ faqContent }: FaqParams) => ({
        url: `/faq`,
        method: 'POST',
        body: faqContent,
      }),
      invalidatesTags: (_result, _error, { faqContent }) => [
        { type: 'FAQ', id: faqContent.site },
      ],
    }),

    updateFaq: build.mutation({
      query: ({ site, faqContent }: FaqParams) => ({
        url: `/faq?site=${site}`,
        method: 'PATCH',
        body: faqContent,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'FAQ', id: site },
      ],
    }),

    deleteFaq: build.mutation({
      query: ({ site }: SiteParam) => ({
        url: `/faq?site=${site}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'FAQ', id: site },
      ],
    }),
  }),
});

export const {
  useGetFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
