/* eslint-disable @typescript-eslint/no-explicit-any */
// Common types for Content Management API

export interface SiteParam {
  site: string;
}

export interface IdParam {
  id: string | number;
}

export interface TermsAndConditionsParams {
  site: string;
  termsAndConditions: any;
}

export interface PrivacyPolicyParams {
  site: string;
  privacyPolicy: any;
}

export interface FooterParams {
  site: string;
  footerContent: any;
}

export interface FaqParams {
  site?: string;
  faqContent: any;
}

export interface WhyUsParams {
  site?: string;
  whyUsContent: any;
}

export interface ContactInfoParams {
  site?: string;
  contactInfo: any;
}

export interface FeaturedBrandsParams {
  id?: string | number;
  featuredBrands: any;
}

export interface AboutUsParams {
  site: string;
  aboutUsContent: any;
}

export interface WhatSetsUsApartData {
  id?: string;
  site: 'FLORIDA' | 'JUPITER';
  title: string;
  description: string;
  yearsOfYachtingExcellence: string;
  boatsSoldIn2024: string;
  listingsViewedMonthly: string;
  image1Id?: string;
  image2Id?: string;
  image1?: {
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
  };
  image2?: {
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
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnersParams {
  id?: string | number;
  partners: any;
}

