import { baseApi } from '@/redux/api/baseApi';

export const aiSearchBannerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAiSearchBanner: build.query({
      query: () => ({
        url: '/ai-search-banner',
        method: 'GET',
      }),
      providesTags: () => [{ type: 'AiSearchBanner', id: 'JUPITER' }],
      keepUnusedDataFor: 0,
    }),

    createAiSearchBanner: build.mutation({
      query: (formData) => ({
        url: '/ai-search-banner',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: () => [{ type: 'AiSearchBanner', id: 'JUPITER' }],
    }),

    updateAiSearchBanner: build.mutation({
      query: ({ id, formData }) => ({
        url: `/ai-search-banner/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: () => [{ type: 'AiSearchBanner', id: 'JUPITER' }],
    }),

    deleteAiSearchBanner: build.mutation({
      query: (id) => ({
        url: `/ai-search-banner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: 'AiSearchBanner', id: 'JUPITER' }],
    }),
  }),
});

export const {
  useGetAiSearchBannerQuery,
  useCreateAiSearchBannerMutation,
  useUpdateAiSearchBannerMutation,
  useDeleteAiSearchBannerMutation,
} = aiSearchBannerApi;
