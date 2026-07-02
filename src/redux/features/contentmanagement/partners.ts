import { baseApi } from '@/redux/api/baseApi';
import type { PartnersParams, IdParam } from './types';

export const partnersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPartners: build.query({
      query: (site) => ({
        url: `/partners?site=${site}`,
        method: 'GET',
      }),
      providesTags: (result, _error, site) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({
                type: 'Partners' as const,
                id,
              })),
              { type: 'Partners', id: `LIST-${site}` },
            ]
          : [{ type: 'Partners', id: `LIST-${site}` }],
      keepUnusedDataFor: 0,
    }),

    createPartner: build.mutation({
      query: ({ partners }: PartnersParams) => ({
        url: `/partners`,
        method: 'POST',
        body: partners,
      }),
      invalidatesTags: (_result, _error, { partners }) => {
        const site = partners instanceof FormData ? partners.get('site') : partners.site;
        return [
          { type: 'Partners', id: `LIST-${site}` },
        ];
      },
    }),

    updatePartner: build.mutation({
      query: ({ id, partners }: PartnersParams) => ({
        url: `/partners/${id}`,
        method: 'PATCH',
        body: partners,
      }),
      invalidatesTags: (_result, _error, { id, partners }) => {
        const site = partners instanceof FormData ? partners.get('site') : partners.site;
        return [
          { type: 'Partners', id },
          { type: 'Partners', id: `LIST-${site}` },
        ];
      },
    }),

    deletePartner: build.mutation({
      query: ({ id }: IdParam) => ({
        url: `/partners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Partners', id: 'LIST-FLORIDA' },
        { type: 'Partners', id: 'LIST-JUPITER' },
      ],
    }),
  }),
});

export const {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnersApi;
