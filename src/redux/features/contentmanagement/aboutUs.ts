import { baseApi } from '@/redux/api/baseApi';
import type { AboutUsParams } from './types';

export const aboutUsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAboutUs: build.query({
      query: (site) => ({
        url: `/aboutus?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [{ type: 'AboutUs', id: site }],
      keepUnusedDataFor: 0,
    }),

    createAboutUs: build.mutation({
      query: ({ site, aboutUsContent }: AboutUsParams) => ({
        url: `/aboutus/create?site=${site}`,
        method: 'POST',
        body: aboutUsContent,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'AboutUs', id: site },
      ],
    }),

    updateAboutUs: build.mutation({
      query: ({ site, aboutUsContent }: AboutUsParams) => ({
        url: `/aboutus?site=${site}`,
        method: 'PATCH',
        body: aboutUsContent,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'AboutUs', id: site },
      ],
    }),

    getAboutUsOurStory: build.query({
      query: (site) => ({
        url: `/aboutus/our-story?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [
        { type: 'AboutUs', id: `story-${site}` },
      ],
      keepUnusedDataFor: 0,
    }),

    createAboutUsOurStory: build.mutation({
      query: ({ site, aboutUsOurStory }) => ({
        url: `/aboutus/our-story?site=${site}`,
        method: 'POST',
        body: aboutUsOurStory,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'AboutUs', id: `story-${site}` },
      ],
    }),

    updateAboutUsOurStory: build.mutation({
      query: ({ site, aboutUsOurStory }) => ({
        url: `/aboutus/our-story?site=${site}`,
        method: 'PATCH',
        body: aboutUsOurStory,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'AboutUs', id: `story-${site}` },
      ],
    }),
  }),
});

export const {
  useGetAboutUsQuery,
  useCreateAboutUsMutation,
  useUpdateAboutUsMutation,

  useGetAboutUsOurStoryQuery,
  useCreateAboutUsOurStoryMutation,
  useUpdateAboutUsOurStoryMutation,
} = aboutUsApi;

export { useGetAboutUsQuery as useGetAboutUsContentQuery };
