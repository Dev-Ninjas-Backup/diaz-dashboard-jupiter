import { baseApi } from '@/redux/api/baseApi';

const leadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomerContacted: build.query({
      query: ({ page, limit }) => ({
        url: `/contact/contact-us?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['Leads'],
    }),
  }),
});

export const { useGetCustomerContactedQuery } = leadsApi;
