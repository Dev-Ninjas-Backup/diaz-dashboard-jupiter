import { baseApi } from '@/redux/api/baseApi';
import type { ContactInfoParams } from './types';

export const contactInfoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getContactInfo: build.query({
      query: (site) => ({
        url: `/contact/contact-info?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [
        { type: 'ContactInfo', id: site },
      ],
      keepUnusedDataFor: 0,
    }),

    createContactInfo: build.mutation({
      query: ({ site, contactInfo }: ContactInfoParams) => ({
        url: `/contact/contact-info?site=${site}`,
        method: 'POST',
        body: contactInfo,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'ContactInfo', id: site },
      ],
    }),

    updateContactInfo: build.mutation({
      query: ({ site, contactInfo }: ContactInfoParams) => ({
        url: `/contact/contact-info?site=${site}`,
        method: 'PATCH',
        body: contactInfo,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'ContactInfo', id: site },
      ],
    }),
  }),
});

export const {
  useGetContactInfoQuery,
  useCreateContactInfoMutation,
  useUpdateContactInfoMutation,
} = contactInfoApi;
