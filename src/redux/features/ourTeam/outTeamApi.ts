import { baseApi } from '@/redux/api/baseApi';

export interface TeamMemberImage {
  id: string;
  filename: string;
  originalFilename: string;
  path: string;
  url: string;
  fileType: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  email?: string;
  contact?: string;
  imageId: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: TeamMemberImage;
}

export interface OurTeamResponse {
  success: boolean;
  message: string;
  data: TeamMember[];
}

export interface SingleTeamMemberResponse {
  success: boolean;
  message: string;
  data: TeamMember;
}

const ourTeamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOurTeam: build.query<OurTeamResponse, void>({
      query: () => ({
        url: `/our-team`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: 'OurTeam' as const,
                id,
              })),
              { type: 'OurTeam', id: 'LIST' },
            ]
          : [{ type: 'OurTeam', id: 'LIST' }],
    }),

    getSingleTeamMember: build.query<SingleTeamMemberResponse, string>({
      query: (id) => ({
        url: `/our-team/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'OurTeam', id }],
    }),

    createOurTeam: build.mutation<SingleTeamMemberResponse, FormData>({
      query: (data) => ({
        url: `/our-team`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'OurTeam', id: 'LIST' }],
    }),

    updateOurTeam: build.mutation<
      SingleTeamMemberResponse,
      { id: string; data: FormData; isActive: boolean }
    >({
      query: ({ id, data, isActive }) => ({
        url: `/our-team/${id}`,
        method: 'PATCH',
        body: data,
        params: { isActive },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'OurTeam', id },
        { type: 'OurTeam', id: 'LIST' },
      ],
    }),

    deleteOurTeam: build.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/our-team/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'OurTeam', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOurTeamQuery,
  useGetSingleTeamMemberQuery,
  useCreateOurTeamMutation,
  useUpdateOurTeamMutation,
  useDeleteOurTeamMutation,
} = ourTeamApi;
