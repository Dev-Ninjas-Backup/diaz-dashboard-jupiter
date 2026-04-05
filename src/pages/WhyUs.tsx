import {
  useCreateWhyUsMutation,
  useDeleteWhyUsMutation,
  useGetWhyUsQuery,
  useUpdateWhyUsMutation,
} from '@/redux/features/contentmanagement/contentmanagement';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  WhyUsForm,
  WhyUsHeader,
  WhyUsPreview,
  WhyUsSidebar,
  type WhyUsFormData,
} from '../components/WhyUs';

const WhyUs: React.FC = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedSite] = useState<'FLORIDA' | 'JUPITER'>('JUPITER');
  const [formData, setFormData] = useState<WhyUsFormData>({
    title: '',
    description: '',
    excellence: '',
    boatsSoldPerYear: '',
    listingViewed: '',
    buttonText: '',
    buttonLink: '',
    image1: null,
    image2: null,
    image3: null,
    site: 'JUPITER',
  });

  const { data: whyUsData, isLoading: isWhyUsLoading } =
    useGetWhyUsQuery(selectedSite, {
      refetchOnMountOrArgChange: true,
    });
  const [createWhyUs, { isLoading: isCreating }] = useCreateWhyUsMutation();
  const [updateWhyUs, { isLoading: isUpdating }] = useUpdateWhyUsMutation();
  const [deleteWhyUs] = useDeleteWhyUsMutation();

  useEffect(() => {
    if (whyUsData?.data) {
      const data = whyUsData.data;
      setFormData({
        title: data.title || '',
        description: data.description || '',
        excellence: data.excellence || '',
        boatsSoldPerYear: data.boatsSoldPerYear || '',
        listingViewed: data.listingViewed || '',
        buttonText: data.buttonText || '',
        buttonLink: data.buttonLink || '',
        image1: data.image1?.url
          ? { id: data.image1.id, url: data.image1.url }
          : null,
        image2: data.image2?.url
          ? { id: data.image2.id, url: data.image2.url }
          : null,
        image3: data.image3?.url
          ? { id: data.image3.id, url: data.image3.url }
          : null,
        site: selectedSite,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        excellence: '',
        boatsSoldPerYear: '',
        listingViewed: '',
        buttonText: '',
        buttonLink: '',
        image1: null,
        image2: null,
        image3: null,
        site: selectedSite,
      });
    }
  }, [whyUsData, selectedSite]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (
    imageKey: 'image1' | 'image2' | 'image3',
    file: File | null,
  ) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [imageKey]: { file, preview },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [imageKey]: null,
      }));
    }
  };

  const removeImage = (imageKey: 'image1' | 'image2' | 'image3') => {
    if (formData[imageKey]?.preview) {
      URL.revokeObjectURL(formData[imageKey]!.preview!);
    }
    setFormData((prev) => ({
      ...prev,
      [imageKey]: null,
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Swal.fire('Error', 'Title is required', 'error');
      return;
    }

    if (!formData.image1 || !formData.image2 || !formData.image3) {
      Swal.fire('Error', 'All 3 images are required', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();

      if (whyUsData?.data) {
        formDataToSend.append('title', formData.title.trim());
        if (formData.description.trim())
          formDataToSend.append('description', formData.description.trim());
        if (formData.excellence.trim())
          formDataToSend.append('excellence', formData.excellence.trim());
        if (formData.boatsSoldPerYear.trim())
          formDataToSend.append(
            'boatsSoldPerYear',
            formData.boatsSoldPerYear.trim(),
          );
        if (formData.listingViewed.trim())
          formDataToSend.append('listingViewed', formData.listingViewed.trim());
        if (formData.buttonText.trim())
          formDataToSend.append('buttonText', formData.buttonText.trim());
        if (formData.buttonLink.trim())
          formDataToSend.append('buttonLink', formData.buttonLink.trim());

        if (formData.image1?.file) {
          formDataToSend.append('image1', formData.image1.file);
        }
        if (formData.image2?.file) {
          formDataToSend.append('image2', formData.image2.file);
        }
        if (formData.image3?.file) {
          formDataToSend.append('image3', formData.image3.file);
        }

        await updateWhyUs({
          site: selectedSite,
          whyUsContent: formDataToSend,
        }).unwrap();
        await Swal.fire('Success!', 'Why Us section updated successfully', 'success');
      } else {
        formDataToSend.append('site', selectedSite);
        formDataToSend.append('title', formData.title.trim());
        if (formData.description.trim())
          formDataToSend.append('description', formData.description.trim());
        if (formData.excellence.trim())
          formDataToSend.append('excellence', formData.excellence.trim());
        if (formData.boatsSoldPerYear.trim())
          formDataToSend.append(
            'boatsSoldPerYear',
            formData.boatsSoldPerYear.trim(),
          );
        if (formData.listingViewed.trim())
          formDataToSend.append('listingViewed', formData.listingViewed.trim());
        if (formData.buttonText.trim())
          formDataToSend.append('buttonText', formData.buttonText.trim());
        if (formData.buttonLink.trim())
          formDataToSend.append('buttonLink', formData.buttonLink.trim());

        if (formData.image1?.file) {
          formDataToSend.append('image1', formData.image1.file);
        }
        if (formData.image2?.file) {
          formDataToSend.append('image2', formData.image2.file);
        }
        if (formData.image3?.file) {
          formDataToSend.append('image3', formData.image3.file);
        }

        await createWhyUs({
          whyUsContent: formDataToSend,
        }).unwrap();
        await Swal.fire('Success!', 'Why Us section created successfully', 'success');
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        (error as { data?: { message?: string } })?.data?.message ||
          'Failed to save Why Us section',
        'error',
      );
    }
  };

  const handleDelete = async () => {
    if (!whyUsData?.data) {
      Swal.fire('Error', 'No Why Us data to delete', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the Why Us section for ${selectedSite}? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await deleteWhyUs({ site: selectedSite }).unwrap();
        Swal.fire(
          'Deleted!',
          'Why Us section has been deleted successfully',
          'success',
        );
        setFormData({
          title: '',
          description: '',
          excellence: '',
          boatsSoldPerYear: '',
          listingViewed: '',
          buttonText: '',
          buttonLink: '',
          image1: null,
          image2: null,
          image3: null,
          site: selectedSite,
        });
      } catch (error) {
        Swal.fire(
          'Error!',
          (error as { data?: { message?: string } })?.data?.message ||
            'Failed to delete Why Us section',
          'error',
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WhyUsHeader
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        onSave={handleSave}
        isLoading={isCreating || isUpdating}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isWhyUsLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : isPreviewMode ? (
          <WhyUsPreview formData={formData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WhyUsForm
                formData={formData}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
              />
            </div>

            <WhyUsSidebar
              selectedSite={selectedSite}
              onSiteChange={() => {}}
              hasData={!!whyUsData?.data}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WhyUs;
