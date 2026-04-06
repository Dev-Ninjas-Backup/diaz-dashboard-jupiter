import { baseApi } from '@/redux/api/baseApi';

const permissionManageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPermissionUsers: build.query({
      query: () => ({
        url: `/user-permissions/get-admins`,
        method: 'GET',
      }),
      providesTags: ['PERMISSION'],
    }),

    getAvailablePermissions: build.query<string[], void>({
      query: () => ({
        url: `/user-permissions/available-permissions`,
        method: 'GET',
      }),
      transformResponse: (response: {
        status: string;
        total: number;
        permissions: string[];
      }) => response.permissions,
    }),

    createPermission: build.mutation({
      query: (data) => ({
        url: `/user-permissions/add-admin`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PERMISSION'],
    }),

    changeRole: build.mutation({
      query: ({ id, data }) => ({
        url: `/user-permissions/${id}?changerole=${data.role}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PERMISSION'],
    }),

    updatePermissions: build.mutation({
      query: ({ id, permissions }: { id: string; permissions: string[] }) => ({
        url: `/user-permissions/${id}/permissions`,
        method: 'PATCH',
        body: { permissions },
      }),
      invalidatesTags: ['PERMISSION'],
    }),

    deletePermission: build.mutation({
      query: (id: string) => ({
        url: `/user-permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PERMISSION'],
    }),
  }),
});

export const {
  useGetAllPermissionUsersQuery,
  useGetAvailablePermissionsQuery,
  useCreatePermissionMutation,
  useChangeRoleMutation,
  useUpdatePermissionsMutation,
  useDeletePermissionMutation,
} = permissionManageApi;
