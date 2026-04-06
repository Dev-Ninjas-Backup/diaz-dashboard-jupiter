import { baseApi } from '@/redux/api/baseApi';

export interface Banner {
  id: string;
  page: string;
  site: string;
  bannerTitle: string;
  subtitle?: string;
  background?: {
    id: string;
    url: string;
    fileType?: string;
    mimeType?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerPayload {
  page: string;
  site: string;
  bannerTitle: string;
  subtitle?: string;
  background?: File;
}

export interface UpdateBannerPayload {
  id: string;
  page?: string;
  site?: string;
  bannerTitle?: string;
  subtitle?: string;
  background?: File;
}

export interface GetSingleBannerQuery {
  page: string;
  site: string;
}

export interface AdminSettings {
  id: string;
  siteName: string;
  currency: string;
  maintenanceMode: boolean;
  logoId: string | null;
  newListingSubmitted: boolean;
  newSellerRegistration: boolean;
  createdAt: string;
  updatedAt: string;
  logo: string | null;
  logoUrl: string | null;
}

export interface UpdateAdminSettingsPayload {
  siteName?: string;
  currency?: string;
  maintenanceMode?: boolean;
  newListingSubmitted?: boolean;
  newSellerRegistration?: boolean;
  logo?: File | null | string;
}

export const adminBannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBanner: builder.mutation<Banner, CreateBannerPayload>({
      query: (data) => {
        const formData = new FormData();

        formData.append('page', data.page);
        formData.append('site', data.site);
        formData.append('bannerTitle', data.bannerTitle);

        if (data.subtitle) {
          formData.append('subtitle', data.subtitle);
        }

        if (data.background) {
          formData.append('background', data.background);
        }

        return {
          url: '/banners',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { page, site }) => [
        { type: 'PageBanner', id: `${page}-${site}` },
        { type: 'PageBanner', id: 'LIST' },
      ],
    }),

    getSingleBanner: builder.query<Banner, GetSingleBannerQuery>({
      query: ({ page, site }) => ({
        url: '/banners/single',
        method: 'GET',
        params: { page, site },
      }),
      providesTags: (_result, _error, { page, site }) => [
        { type: 'PageBanner', id: `${page}-${site}` },
      ],
      keepUnusedDataFor: 0,
      transformErrorResponse: (response: any) => {
        console.error('Get banner error:', response);
        return response;
      },
    }),

    updateBanner: builder.mutation<Banner, UpdateBannerPayload>({
      query: ({ id, page, site, bannerTitle, subtitle, background }) => {
        const formData = new FormData();

        if (page) formData.append('page', page);
        if (site) formData.append('site', site);
        if (bannerTitle) formData.append('bannerTitle', bannerTitle);
        if (subtitle) formData.append('subtitle', subtitle);
        if (background) formData.append('background', background);

        console.log('Update banner payload:', {
          id,
          page,
          site,
          bannerTitle,
          subtitle,
          hasFile: !!background,
        });

        return {
          url: `/banners/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { page, site }) => {
        const tags = [{ type: 'PageBanner' as const, id: 'LIST' }];
        if (page && site) {
          tags.push({ type: 'PageBanner' as const, id: `${page}-${site}` });
        }
        console.log('Invalidating tags:', tags);
        return tags;
      },
      transformErrorResponse: (response: any) => {
        console.error('Update banner error:', response);
        return response;
      },
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useGetSingleBannerQuery,
  useUpdateBannerMutation,
} = adminBannerApi;
