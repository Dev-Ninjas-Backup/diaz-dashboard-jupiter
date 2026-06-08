export interface ImageData {
  id?: string;
  url?: string;
  file?: File;
  preview?: string;
}

export interface WorkingHour {
  day: string;
  hours: string;
}

export type SocialMedia = Record<string, string>;

export interface ContactInfoFormData {
  address: string;
  email: string;
  phone: string;
  workingHours: WorkingHour[];
  socialMedia: SocialMedia;
  backgroundImage: ImageData | null;
  site: 'FLORIDA' | 'JUPITER';
}

export interface ContactInfoApiResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    address: string;
    email: string;
    phone: string;
    workingHours: WorkingHour[];
    socialMedia: SocialMedia;
    backgroundImageId?: string;
    site: 'FLORIDA' | 'JUPITER';
    createdAt: string;
    updatedAt: string;
    backgroundImage?: {
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
  };
}
