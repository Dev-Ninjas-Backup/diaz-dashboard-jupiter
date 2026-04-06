// src/redux/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// Use environment variable or fallback to hardcoded URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.floridayachttrader.com';

console.log('🔧 Redux API Base URL:', API_BASE_URL);

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      console.log('Current State:', state); // Debugging line to check the state structure
      const token = state.auth?.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log(token);
      }
      return headers;
    },
  }),

  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  tagTypes: [
    'Auth',
    'User',
    'Yacht',
    'Seller',
    'Dashboard',
    'Activity',
    'Admin',
    'PERMISSION',
    'Blog',
    'TermsOfService',
    'AboutUs',
    'PrivacyPolicy',
    'ContactUs',
    'Footer',
    'Leads',
    'DailyLeads',
    'FAQ',
    'WhyUs',
    'OurTeam',
    'FeaturedBrands',
    'Category',
    'ContactInfo',
    'OurStory',
    'MissionVision',
    'WhatSetsUsApart',
    'Notification',
    'PageBanner',
    'AssignmentMember',
  ],

  endpoints: () => ({}),
});
