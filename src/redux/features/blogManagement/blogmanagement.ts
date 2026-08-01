import { baseApi } from '@/redux/api/baseApi';

const blogManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBlog: build.mutation({
      query: (blog) => ({
        url: `/blogs`,
        method: 'POST',
        body: blog,
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    getBlogs: build.query({
      query: (params?: Record<string, any>) => ({
        url: `/blogs`,
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...(Array.isArray(result)
                ? result.map(({ id }: { id: string }) => ({
                    type: 'Blog' as const,
                    id,
                  }))
                : Array.isArray((result as any).data)
                ? (result as any).data.map(({ id }: { id: string }) => ({
                    type: 'Blog' as const,
                    id,
                  }))
                : []),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),

    getBlogById: build.query({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Blog', id }],
      keepUnusedDataFor: 5,
    }),

    updateBlog: build.mutation({
      query: ({ id, body }) => ({
        url: `/blogs/${id}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    deleteBlog: build.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogManagementApi;
