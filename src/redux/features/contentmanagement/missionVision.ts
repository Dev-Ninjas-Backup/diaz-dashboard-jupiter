import { baseApi } from '@/redux/api/baseApi';

export const missionVisionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMissionVision: build.query({
      query: (site) => ({
        url: `/aboutus/mission-vision?site=${site}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, site) => [
        { type: 'MissionVision', id: site },
      ],
      keepUnusedDataFor: 0,
    }),

    createMissionVision: build.mutation({
      query: ({ site, formData }) => ({
        url: `/aboutus/mission-vision?site=${site}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'MissionVision', id: site },
      ],
    }),

    updateMissionVision: build.mutation({
      query: ({ site, formData }) => ({
        url: `/aboutus/mission-vision?site=${site}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { site }) => [
        { type: 'MissionVision', id: site },
      ],
    }),
  }),
});

export const {
  useGetMissionVisionQuery,
  useCreateMissionVisionMutation,
  useUpdateMissionVisionMutation,
} = missionVisionApi;
