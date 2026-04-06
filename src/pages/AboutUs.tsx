import {
  AboutUsForm,
  AboutUsHeader,
  AboutUsPreview,
  AboutUsSidebar,
  MissionVisionSection,
  OurStorySection,
  WhatSetsUsApartSection,
  type AboutUsFormData,
  type MissionVisionFormData,
  type OurStoryFormData,
  type WhatSetsUsApartFormData,
} from '@/components/AboutUs';

import {
  useCreateAboutUsMutation,
  useCreateMissionVisionMutation,
  useCreateOurStoryMutation,
  useCreateWhatSetsUsApartMutation,
  useGetAboutUsContentQuery,
  useGetMissionVisionQuery,
  useGetOurStoryQuery,
  useGetWhatSetsUsApartQuery,
  useUpdateAboutUsMutation,
  useUpdateMissionVisionMutation,
  useUpdateOurStoryMutation,
  useUpdateWhatSetsUsApartMutation,
} from '@/redux/features/contentmanagement/contentmanagement';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSite] = useState<'FLORIDA' | 'JUPITER'>('JUPITER');

  const {
    data: aboutUsData,
    isLoading,
    isError,
  } = useGetAboutUsContentQuery(selectedSite, {
    refetchOnMountOrArgChange: true,
  });
  const { data: ourStoryData, isLoading: isOurStoryLoading } =
    useGetOurStoryQuery(selectedSite, {
      refetchOnMountOrArgChange: true,
    });
  const { data: missionVisionData, isLoading: isMissionVisionLoading } =
    useGetMissionVisionQuery(selectedSite, {
      refetchOnMountOrArgChange: true,
    });
  const { data: whatSetsUsApartData, isLoading: isWhatSetsUsApartLoading } =
    useGetWhatSetsUsApartQuery(selectedSite, {
      refetchOnMountOrArgChange: true,
    });

  const [createAboutUs] = useCreateAboutUsMutation();
  const [updateAboutUs] = useUpdateAboutUsMutation();

  const [createOurStory, { isLoading: isCreatingOurStory }] =
    useCreateOurStoryMutation();
  const [updateOurStory, { isLoading: isUpdatingOurStory }] =
    useUpdateOurStoryMutation();

  const [createMissionVision, { isLoading: isCreatingMissionVision }] =
    useCreateMissionVisionMutation();
  const [updateMissionVision, { isLoading: isUpdatingMissionVision }] =
    useUpdateMissionVisionMutation();

  const [createWhatSetsUsApart, { isLoading: isCreatingWhatSetsUsApart }] =
    useCreateWhatSetsUsApartMutation();
  const [updateWhatSetsUsApart, { isLoading: isUpdatingWhatSetsUsApart }] =
    useUpdateWhatSetsUsApartMutation();

  const [formData, setFormData] = useState<AboutUsFormData>({
    aboutTitle: '',
    aboutDescription: '',
    mission: '',
    vision: '',
    site: 'FLORIDA',
  });

  const [ourStoryFormData, setOurStoryFormData] = useState<OurStoryFormData>({
    title: '',
    description: '',
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    existingImage1: '',
    existingImage2: '',
    existingImage3: '',
    existingImage4: '',
    existingImage5: '',
  });

  const [missionVisionFormData, setMissionVisionFormData] =
    useState<MissionVisionFormData>({
      title: '',
      missionTitle: '',
      description: '',
      visionTitle: '',
      visionDescription: '',
      image1: null,
      image2: null,
      image3: null,
      existingImage1: '',
      existingImage2: '',
      existingImage3: '',
    });

  const [whatSetsUsApartFormData, setWhatSetsUsApartFormData] =
    useState<WhatSetsUsApartFormData>({
      title: '',
      description: '',
      yearsOfYachtingExcellence: '',
      boatsSoldIn2024: '',
      listingsViewedMonthly: '',
      image1: null,
      image2: null,
      existingImage1: '',
      existingImage2: '',
    });

  // Load About Us data
  useEffect(() => {
    if (aboutUsData) {
      setFormData({
        aboutTitle: aboutUsData.aboutTitle || '',
        aboutDescription: aboutUsData.aboutDescription || '',
        mission: aboutUsData.mission || '',
        vision: aboutUsData.vision || '',
        site: selectedSite,
      });
    } else {
      setFormData({
        aboutTitle: '',
        aboutDescription: '',
        mission: '',
        vision: '',
        site: selectedSite,
      });
    }
  }, [aboutUsData, selectedSite]);

  // Load Our Story data
  useEffect(() => {
    if (ourStoryData) {
      setOurStoryFormData({
        title: ourStoryData.title || '',
        description: ourStoryData.description || '',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        existingImage1: ourStoryData.image1?.url || '',
        existingImage2: ourStoryData.image2?.url || '',
        existingImage3: ourStoryData.image3?.url || '',
        existingImage4: ourStoryData.image4?.url || '',
        existingImage5: ourStoryData.image5?.url || '',
      });
    } else {
      setOurStoryFormData({
        title: '',
        description: '',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        existingImage1: '',
        existingImage2: '',
        existingImage3: '',
        existingImage4: '',
        existingImage5: '',
      });
    }
  }, [ourStoryData, selectedSite]);

  // Load Mission & Vision data
  useEffect(() => {
    if (missionVisionData) {
      setMissionVisionFormData({
        title: missionVisionData.title || '',
        missionTitle: missionVisionData.missionTitle || '',
        description: missionVisionData.description || '',
        visionTitle: missionVisionData.visionTitle || '',
        visionDescription: missionVisionData.visionDescription || '',
        image1: null,
        image2: null,
        image3: null,
        existingImage1: missionVisionData.image1?.url || '',
        existingImage2: missionVisionData.image2?.url || '',
        existingImage3: missionVisionData.image3?.url || '',
      });
    } else {
      setMissionVisionFormData({
        title: '',
        missionTitle: '',
        description: '',
        visionTitle: '',
        visionDescription: '',
        image1: null,
        image2: null,
        image3: null,
        existingImage1: '',
        existingImage2: '',
        existingImage3: '',
      });
    }
  }, [missionVisionData, selectedSite]);

  // Load What Sets Us Apart data
  useEffect(() => {
    if (whatSetsUsApartData) {
      setWhatSetsUsApartFormData({
        title: whatSetsUsApartData.title || '',
        description: whatSetsUsApartData.description || '',
        yearsOfYachtingExcellence:
          whatSetsUsApartData.yearsOfYachtingExcellence || '',
        boatsSoldIn2024: whatSetsUsApartData.boatsSoldIn2024 || '',
        listingsViewedMonthly: whatSetsUsApartData.listingsViewedMonthly || '',
        image1: null,
        image2: null,
        existingImage1: whatSetsUsApartData.image1?.url || '',
        existingImage2: whatSetsUsApartData.image2?.url || '',
      });
    } else {
      setWhatSetsUsApartFormData({
        title: '',
        description: '',
        yearsOfYachtingExcellence: '',
        boatsSoldIn2024: '',
        listingsViewedMonthly: '',
        image1: null,
        image2: null,
        existingImage1: '',
        existingImage2: '',
      });
    }
  }, [whatSetsUsApartData, selectedSite]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOurStoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOurStoryFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOurStoryImageChange = (imageKey: string, file: File | null) => {
    const existingKey = `existing${imageKey.charAt(0).toUpperCase() + imageKey.slice(1)}`;
    setOurStoryFormData((prev) => ({
      ...prev,
      [imageKey]: file,
      // Clear existing image URL when removing
      ...(file === null && { [existingKey]: '' }),
    }));
  };

  const handleMissionVisionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMissionVisionFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMissionVisionImageChange = (
    imageKey: string,
    file: File | null,
  ) => {
    const existingKey = `existing${imageKey.charAt(0).toUpperCase() + imageKey.slice(1)}`;
    setMissionVisionFormData((prev) => ({
      ...prev,
      [imageKey]: file,
      // Clear existing image URL when removing
      ...(file === null && { [existingKey]: '' }),
    }));
  };

  const handleWhatSetsUsApartInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setWhatSetsUsApartFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatSetsUsApartImageChange = (
    imageKey: string,
    file: File | null,
  ) => {
    const existingKey = `existing${imageKey.charAt(0).toUpperCase() + imageKey.slice(1)}`;
    setWhatSetsUsApartFormData((prev) => ({
      ...prev,
      [imageKey]: file,
      // Clear existing image URL when removing
      ...(file === null && { [existingKey]: '' }),
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, aboutDescription: value }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.aboutTitle.trim() || !formData.aboutDescription.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in About Title and About Description',
      });
      return;
    }

    try {
      // Save About Us data only
      const aboutUsContent = {
        aboutTitle: formData.aboutTitle,
        aboutDescription: formData.aboutDescription,
        mission: formData.mission,
        vision: formData.vision,
      };

      // Auto-detect: if data exists and no error, update; otherwise create
      if (aboutUsData?.id && !isError) {
        await updateAboutUs({
          site: selectedSite,
          aboutUsContent,
        }).unwrap();
      } else {
        await createAboutUs({
          site: selectedSite,
          aboutUsContent,
        }).unwrap();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'About Us section has been saved successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text:
          (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save About Us section',
      });
    }
  };

  const handleSaveOurStory = async () => {
    // Validate Our Story title
    if (!ourStoryFormData.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Title',
        text: 'Please enter a title for the Our Story section',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', ourStoryFormData.title);

      if (ourStoryFormData.description) {
        formDataToSend.append('description', ourStoryFormData.description);
      }

      // Append images
      [1, 2, 3, 4, 5].forEach((num) => {
        const imageKey = `image${num}` as keyof OurStoryFormData;
        const file = ourStoryFormData[imageKey];
        if (file instanceof File) {
          formDataToSend.append(imageKey, file);
        }
      });

      if (ourStoryData?.id) {
        await updateOurStory({
          site: selectedSite,
          formData: formDataToSend,
        }).unwrap();
      } else {
        await createOurStory({
          site: selectedSite,
          formData: formDataToSend,
        }).unwrap();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Our Story section has been saved successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text:
          (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save Our Story section',
      });
    }
  };

  const handleSaveMissionVision = async () => {
    // Validate Mission & Vision title
    if (
      !missionVisionFormData.title.trim() ||
      !missionVisionFormData.missionTitle.trim() ||
      !missionVisionFormData.description.trim() ||
      !missionVisionFormData.visionTitle.trim() ||
      !missionVisionFormData.visionDescription.trim()
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required Mission & Vision fields',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', missionVisionFormData.title);
      formDataToSend.append('missionTitle', missionVisionFormData.missionTitle);
      formDataToSend.append('description', missionVisionFormData.description);
      formDataToSend.append('visionTitle', missionVisionFormData.visionTitle);
      formDataToSend.append(
        'visionDescription',
        missionVisionFormData.visionDescription,
      );

      // Append images
      [1, 2, 3].forEach((num) => {
        const imageKey = `image${num}` as keyof MissionVisionFormData;
        const file = missionVisionFormData[imageKey];
        if (file instanceof File) {
          formDataToSend.append(imageKey, file);
        }
      });

      if (missionVisionData?.id) {
        await updateMissionVision({
          site: selectedSite,
          formData: formDataToSend,
        }).unwrap();
      } else {
        await createMissionVision({
          site: selectedSite,
          formData: formDataToSend,
        }).unwrap();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Mission & Vision section has been saved successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text:
          (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save Mission & Vision section',
      });
    }
  };

  const handleSaveWhatSetsUsApart = async () => {
    // Validate What Sets Us Apart title
    if (!whatSetsUsApartFormData.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Title',
        text: 'Please enter a title for the What Sets Us Apart section',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', whatSetsUsApartFormData.title);

      if (whatSetsUsApartFormData.description) {
        formDataToSend.append(
          'description',
          whatSetsUsApartFormData.description,
        );
      }

      if (whatSetsUsApartFormData.yearsOfYachtingExcellence) {
        formDataToSend.append(
          'yearsOfYachtingExcellence',
          whatSetsUsApartFormData.yearsOfYachtingExcellence,
        );
      }

      if (whatSetsUsApartFormData.boatsSoldIn2024) {
        formDataToSend.append(
          'boatsSoldIn2024',
          whatSetsUsApartFormData.boatsSoldIn2024,
        );
      }

      if (whatSetsUsApartFormData.listingsViewedMonthly) {
        formDataToSend.append(
          'listingsViewedMonthly',
          whatSetsUsApartFormData.listingsViewedMonthly,
        );
      }

      // Append images
      [1, 2].forEach((num) => {
        const imageKey = `image${num}` as keyof WhatSetsUsApartFormData;
        const file = whatSetsUsApartFormData[imageKey];
        if (file instanceof File) {
          formDataToSend.append(imageKey, file);
        }
      });

      if (whatSetsUsApartData?.id) {
        await updateWhatSetsUsApart({
          site: selectedSite,
          formData: formDataToSend,
        }).unwrap();
      } else {
        await createWhatSetsUsApart({
          site: selectedSite,
          formData: formDataToSend,
        }).unwrap();
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'What Sets Us Apart section has been saved successfully!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text:
          (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save What Sets Us Apart section',
      });
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  const handleTogglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AboutUsHeader
        isPreviewMode={isPreviewMode}
        onTogglePreview={handleTogglePreview}
        onSave={handleSave}
        onBack={handleBack}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ||
        isOurStoryLoading ||
        isMissionVisionLoading ||
        isWhatSetsUsApartLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : isPreviewMode ? (
          <AboutUsPreview
            formData={formData}
            ourStoryData={ourStoryFormData}
            missionVisionData={missionVisionFormData}
            whatSetsUsApartData={whatSetsUsApartFormData}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AboutUsForm
                formData={formData}
                onInputChange={handleInputChange}
                onDescriptionChange={handleDescriptionChange}
              />
              <OurStorySection
                formData={ourStoryFormData}
                onInputChange={handleOurStoryInputChange}
                onImageChange={handleOurStoryImageChange}
                onSave={handleSaveOurStory}
                isSaving={isCreatingOurStory || isUpdatingOurStory}
              />
              <MissionVisionSection
                formData={missionVisionFormData}
                onInputChange={handleMissionVisionInputChange}
                onImageChange={handleMissionVisionImageChange}
                onSave={handleSaveMissionVision}
                isSaving={isCreatingMissionVision || isUpdatingMissionVision}
              />
              <WhatSetsUsApartSection
                formData={whatSetsUsApartFormData}
                onInputChange={handleWhatSetsUsApartInputChange}
                onImageChange={handleWhatSetsUsApartImageChange}
                onSave={handleSaveWhatSetsUsApart}
                isSaving={
                  isCreatingWhatSetsUsApart || isUpdatingWhatSetsUsApart
                }
              />
            </div>
            <AboutUsSidebar
              selectedSite={selectedSite}
              onSiteChange={() => {}}
              updatedAt={aboutUsData?.updatedAt}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
