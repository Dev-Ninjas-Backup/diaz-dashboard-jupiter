import { baseApi } from '@/redux/api/baseApi';
import type { FeaturedBrandsParams, IdParam } from './types';

export const featuredBrandsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFeaturedBrands: build.query({
      query: (site) => ({
        url: `/featured-brands?site=${site}`,
        method: 'GET',
      }),
      providesTags: (result, _error, site) =>
        result
          ? [
              ...result.map(({ _id }: { _id: string }) => ({
                type: 'FeaturedBrands' as const,
                id: _id,
              })),
              { type: 'FeaturedBrands', id: `LIST-${site}` },
            ]
          : [{ type: 'FeaturedBrands', id: `LIST-${site}` }],
      keepUnusedDataFor: 0,
    }),

    createFeaturedBrands: build.mutation({
      query: ({ featuredBrands }: FeaturedBrandsParams) => ({
        url: `/featured-brands`,
        method: 'POST',
        body: featuredBrands,
      }),
      invalidatesTags: (_result, _error, { featuredBrands }) => [
        { type: 'FeaturedBrands', id: `LIST-${featuredBrands.site}` },
      ],
    }),

    updateFeaturedBrands: build.mutation({
      query: ({ id, featuredBrands }: FeaturedBrandsParams) => ({
        url: `/featured-brands/${id}`,
        method: 'PATCH',
        body: featuredBrands,
      }),
      invalidatesTags: (_result, _error, { id, featuredBrands }) => [
        { type: 'FeaturedBrands', id },
        { type: 'FeaturedBrands', id: `LIST-${featuredBrands.site}` },
      ],
    }),

    deleteFeaturedBrands: build.mutation({
      query: ({ id }: IdParam) => ({
        url: `/featured-brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'FeaturedBrands', id: 'LIST-FLORIDA' },
        { type: 'FeaturedBrands', id: 'LIST-JUPITER' },
      ],
    }),
  }),
});

export const {
  useGetFeaturedBrandsQuery,
  useCreateFeaturedBrandsMutation,
  useUpdateFeaturedBrandsMutation,
  useDeleteFeaturedBrandsMutation,
} = featuredBrandsApi;
