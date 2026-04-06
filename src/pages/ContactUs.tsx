import {
  useCreateContactInfoMutation,
  useGetContactInfoQuery,
  useUpdateContactInfoMutation,
} from '@/redux/features/contentmanagement/contentmanagement';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  ContactInfoForm,
  ContactInfoPreview,
  ContactInfoSidebar,
  ContactUsHeader,
  SocialMediaSection,
  WorkingHoursSection,
  type ContactInfoFormData,
  type SocialMedia,
} from '../components/ContactUs';

const ContactUs: React.FC = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSite] = useState<'FLORIDA' | 'JUPITER'>('JUPITER');
  const [formData, setFormData] = useState<ContactInfoFormData>({
    address: '',
    email: '',
    phone: '',
    workingHours: [
      { day: 'Monday', hours: '9am to 5pm' },
      { day: 'Tuesday', hours: '9am to 5pm' },
      { day: 'Wednesday', hours: '9am to 5pm' },
      { day: 'Thursday', hours: '9am to 5pm' },
      { day: 'Friday', hours: '9am to 5pm' },
      {
        day: 'Weekend',
        hours: 'Closed - Contact by email for urgent requests',
      },
    ],
    socialMedia: {
      twitter: '',
      youtube: '',
      facebook: '',
      linkedin: '',
    },
    backgroundImage: null,
    site: 'JUPITER',
  });

  const {
    data: contactInfoData,
    isLoading,
    isFetching,
  } = useGetContactInfoQuery(selectedSite, {
    refetchOnMountOrArgChange: true,
  });
  const [createContactInfo, { isLoading: isCreating }] =
    useCreateContactInfoMutation();
  const [updateContactInfo, { isLoading: isUpdating }] =
    useUpdateContactInfoMutation();

  // Load data when fetched or site changes
  useEffect(() => {
    if (contactInfoData?.data) {
      const data = contactInfoData.data;
      setFormData({
        address: data.address || '',
        email: data.email || '',
        phone: data.phone || '',
        workingHours: data.workingHours || [
          { day: 'Monday', hours: '9am to 5pm' },
          { day: 'Tuesday', hours: '9am to 5pm' },
          { day: 'Wednesday', hours: '9am to 5pm' },
          { day: 'Thursday', hours: '9am to 5pm' },
          { day: 'Friday', hours: '9am to 5pm' },
          {
            day: 'Weekend',
            hours: 'Closed - Contact by email for urgent requests',
          },
        ],
        socialMedia: data.socialMedia || {
          twitter: '',
          youtube: '',
          facebook: '',
          linkedin: '',
        },
        backgroundImage: data.backgroundImage?.url
          ? { id: data.backgroundImage.id, url: data.backgroundImage.url }
          : null,
        site: selectedSite,
      });
    } else {
      // Reset to default when no data
      setFormData({
        address: '',
        email: '',
        phone: '',
        workingHours: [
          { day: 'Monday', hours: '9am to 5pm' },
          { day: 'Tuesday', hours: '9am to 5pm' },
          { day: 'Wednesday', hours: '9am to 5pm' },
          { day: 'Thursday', hours: '9am to 5pm' },
          { day: 'Friday', hours: '9am to 5pm' },
          {
            day: 'Weekend',
            hours: 'Closed - Contact by email for urgent requests',
          },
        ],
        socialMedia: {
          twitter: '',
          youtube: '',
          facebook: '',
          linkedin: '',
        },
        backgroundImage: null,
        site: selectedSite,
      });
    }
  }, [contactInfoData, selectedSite]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        backgroundImage: { file, preview },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        backgroundImage: null,
      }));
    }
  };

  const removeImage = () => {
    if (formData.backgroundImage?.preview) {
      URL.revokeObjectURL(formData.backgroundImage.preview);
    }
    setFormData((prev) => ({
      ...prev,
      backgroundImage: null,
    }));
  };

  const handleWorkingHoursChange = (
    index: number,
    field: 'day' | 'hours',
    value: string,
  ) => {
    const updatedHours = [...formData.workingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData((prev) => ({ ...prev, workingHours: updatedHours }));
  };

  const handleSocialMediaChange = (
    platform: keyof SocialMedia,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value },
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.address.trim()) {
      Swal.fire('Error', 'Address is required', 'error');
      return;
    }
    if (!formData.email.trim()) {
      Swal.fire('Error', 'Email is required', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      Swal.fire('Error', 'Phone is required', 'error');
      return;
    }
    if (!formData.backgroundImage) {
      Swal.fire('Error', 'Background image is required', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();

      if (contactInfoData?.data) {
        // Update existing Contact Info
        formDataToSend.append('address', formData.address.trim());
        formDataToSend.append('email', formData.email.trim());
        formDataToSend.append('phone', formData.phone.trim());
        formDataToSend.append(
          'workingHours',
          JSON.stringify(formData.workingHours),
        );
        formDataToSend.append(
          'socialMedia',
          JSON.stringify(formData.socialMedia),
        );

        // Add new background image if selected
        if (formData.backgroundImage?.file) {
          formDataToSend.append(
            'backgroundImage',
            formData.backgroundImage.file,
          );
        }

        await updateContactInfo({
          site: selectedSite,
          contactInfo: formDataToSend,
        }).unwrap();
        await Swal.fire(
          'Success!',
          'Contact information updated successfully',
          'success',
        );
      } else {
        // Create new Contact Info
        formDataToSend.append('site', selectedSite);
        formDataToSend.append('address', formData.address.trim());
        formDataToSend.append('email', formData.email.trim());
        formDataToSend.append('phone', formData.phone.trim());
        formDataToSend.append(
          'workingHours',
          JSON.stringify(formData.workingHours),
        );
        formDataToSend.append(
          'socialMedia',
          JSON.stringify(formData.socialMedia),
        );

        // Background image is required for creation
        if (formData.backgroundImage?.file) {
          formDataToSend.append(
            'backgroundImage',
            formData.backgroundImage.file,
          );
        }

        await createContactInfo({
          site: selectedSite,
          contactInfo: formDataToSend,
        }).unwrap();
        await Swal.fire(
          'Success!',
          'Contact information created successfully',
          'success',
        );
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save contact information',
        'error',
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ContactUsHeader
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        onSave={handleSave}
        isLoading={isCreating || isUpdating}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : isPreviewMode ? (
          <ContactInfoPreview formData={formData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ContactInfoForm
                address={formData.address}
                email={formData.email}
                phone={formData.phone}
                backgroundImage={formData.backgroundImage}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
              />

              <WorkingHoursSection
                workingHours={formData.workingHours}
                onChange={handleWorkingHoursChange}
              />

              <SocialMediaSection
                socialMedia={formData.socialMedia}
                onChange={handleSocialMediaChange}
              />
            </div>

            {/* Sidebar */}
            <ContactInfoSidebar
              selectedSite={selectedSite}
              onSiteChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
