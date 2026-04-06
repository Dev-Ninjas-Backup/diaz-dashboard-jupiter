import { baseApi } from '@/redux/api/baseApi';

export const ourStoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOurStory: build.query({
      query: (site) => ({
        url: `/aboutus/our-story?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [{ type: 'OurStory', id: site }],
      keepUnusedDataFor: 0,
    }),

    createOurStory: build.mutation({
      query: ({ site, formData }) => ({
        url: `/aboutus/our-story?site=${site}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'OurStory', id: site },
      ],
    }),

    updateOurStory: build.mutation({
      query: ({ site, formData }) => ({
        url: `/aboutus/our-story?site=${site}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'OurStory', id: site },
      ],
    }),
  }),
});

export const {
  useGetOurStoryQuery,
  useCreateOurStoryMutation,
  useUpdateOurStoryMutation,
} = ourStoryApi;
