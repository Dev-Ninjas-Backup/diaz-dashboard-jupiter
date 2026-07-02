// Content Management API - Centralized exports
// Re-export all hooks and types from individual modules

export * from './types';

// Terms and Conditions
export {
  useCreateTermsAndConditionsMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
} from './termsAndConditions';

// Privacy Policy
export {
  useCreatePrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from './privacyPolicy';

// Footer
export {
  useCreateFooterMutation,
  useGetFooterQuery,
  useUpdateFooterMutation,
} from './footer';

// FAQ
export {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqQuery,
  useUpdateFaqMutation,
} from './faq';

// Why Us
export {
  useCreateWhyUsMutation,
  useDeleteWhyUsMutation,
  useGetWhyUsQuery,
  useUpdateWhyUsMutation,
} from './whyUs';

// Contact Info
export {
  useCreateContactInfoMutation,
  useGetContactInfoQuery,
  useUpdateContactInfoMutation,
} from './contactInfo';

// Featured Brands
export {
  useCreateFeaturedBrandsMutation,
  useDeleteFeaturedBrandsMutation,
  useGetFeaturedBrandsQuery,
  useUpdateFeaturedBrandsMutation,
} from './featuredBrands';

// About Us
export {
  useCreateAboutUsMutation,
  useGetAboutUsContentQuery,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} from './aboutUs';

// Our Story
export {
  useCreateOurStoryMutation,
  useGetOurStoryQuery,
  useUpdateOurStoryMutation,
} from './ourStory';

// Mission & Vision
export {
  useCreateMissionVisionMutation,
  useGetMissionVisionQuery,
  useUpdateMissionVisionMutation,
} from './missionVision';

// What Sets Us Apart
export {
  useCreateWhatSetsUsApartMutation,
  useGetWhatSetsUsApartQuery,
  useUpdateWhatSetsUsApartMutation,
} from './whatSetsUsApart';

// Category
export {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryListsQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from './category';

// AI Search Banner
export {
  useGetAiSearchBannerQuery,
  useCreateAiSearchBannerMutation,
  useUpdateAiSearchBannerMutation,
  useDeleteAiSearchBannerMutation,
} from './aiSearchBanner';

// Partners
export {
  useCreatePartnerMutation,
  useDeletePartnerMutation,
  useGetPartnersQuery,
  useUpdatePartnerMutation,
} from './partners';

