import { baseApi } from '@/redux/api/baseApi';

export const aboutUsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategoryLists: build.query({
      query: () => ({
        url: `/category`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }: { _id: string }) => ({
                type: 'Category' as const,
                id: _id,
              })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
      keepUnusedDataFor: 0,
    }),

    createCategory: build.mutation({
      query: (categoryContent) => ({
        url: `/category`,
        method: 'POST',
        body: categoryContent,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    getSingleCategory: build.query({
      query: (categoryId) => ({
        url: `/category/${categoryId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, categoryId) => [
        { type: 'Category', id: categoryId },
      ],
      keepUnusedDataFor: 0,
    }),

    updateCategory: build.mutation({
      query: ({ categoryId, categoryContent }) => ({
        url: `/category/${categoryId}`,
        method: 'PATCH',
        body: categoryContent,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: build.mutation({
      query: (categoryId) => ({
        url: `/category/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCategoryListsQuery,
  useCreateCategoryMutation,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = aboutUsApi;
