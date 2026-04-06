import { baseApi } from '@/redux/api/baseApi';

export interface AssignmentMember {
  id: number;
  email: string;
  name: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAssignmentMemberPayload {
  email: string;
  name: string;
  order: number;
}

export interface UpdateAssignmentMemberPayload {
  email?: string;
  name?: string;
  order?: number;
  isActive?: boolean;
}

const assignmentMembersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssignmentMembers: build.query<AssignmentMember[], void>({
      query: () => ({ url: '/daily_leads/assignment-members', method: 'GET' }),
      transformResponse: (res: {
        status: string;
        total: number;
        members: AssignmentMember[];
      }) => res.members,
      providesTags: ['AssignmentMember'],
    }),

    createAssignmentMember: build.mutation<
      AssignmentMember,
      CreateAssignmentMemberPayload
    >({
      query: (body) => ({
        url: '/daily_leads/assignment-members',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AssignmentMember'],
    }),

    updateAssignmentMember: build.mutation<
      AssignmentMember,
      { id: number; data: UpdateAssignmentMemberPayload }
    >({
      query: ({ id, data }) => ({
        url: `/daily_leads/assignment-members/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['AssignmentMember'],
    }),

    deleteAssignmentMember: build.mutation<void, number>({
      query: (id) => ({
        url: `/daily_leads/assignment-members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AssignmentMember'],
    }),
  }),
});

export const {
  useGetAssignmentMembersQuery,
  useCreateAssignmentMemberMutation,
  useUpdateAssignmentMemberMutation,
  useDeleteAssignmentMemberMutation,
} = assignmentMembersApi;
