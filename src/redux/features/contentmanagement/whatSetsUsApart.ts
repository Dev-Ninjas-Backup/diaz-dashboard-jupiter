import { baseApi } from '@/redux/api/baseApi';

export const whatSetsUsApartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWhatSetsUsApart: build.query({
      query: (site) => ({
        url: `/aboutus/what-sets-us-apart?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [
        { type: 'WhatSetsUsApart', id: site },
      ],
      keepUnusedDataFor: 0,
    }),

    createWhatSetsUsApart: build.mutation({
      query: ({ site, formData }) => ({
        url: `/aboutus/what-sets-us-apart?site=${site}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'WhatSetsUsApart', id: site },
      ],
    }),

    updateWhatSetsUsApart: build.mutation({
      query: ({ site, formData }) => ({
        url: `/aboutus/what-sets-us-apart?site=${site}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'WhatSetsUsApart', id: site },
      ],
    }),
  }),
});

export const {
  useGetWhatSetsUsApartQuery,
  useCreateWhatSetsUsApartMutation,
  useUpdateWhatSetsUsApartMutation,
} = whatSetsUsApartApi;
