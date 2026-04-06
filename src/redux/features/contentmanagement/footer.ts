import { baseApi } from '@/redux/api/baseApi';
import type { FooterParams, SiteParam } from './types';

export const footerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFooter: build.query({
      query: ({ site }: SiteParam) => ({
        url: `/footer?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { site }) => [
        { type: 'Footer', id: site },
      ],
      keepUnusedDataFor: 0,
    }),

    createFooter: build.mutation({
      query: ({ site, footerContent }: FooterParams) => ({
        url: `/footer?site=${site}`,
        method: 'POST',
        body: footerContent,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'Footer', id: site },
      ],
    }),

    updateFooter: build.mutation({
      query: ({ site, footerContent }: FooterParams) => ({
        url: `/footer?site=${site}`,
        method: 'PATCH',
        body: footerContent,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'Footer', id: site },
      ],
    }),
  }),
});

export const {
  useGetFooterQuery,
  useCreateFooterMutation,
  useUpdateFooterMutation,
} = footerApi;
