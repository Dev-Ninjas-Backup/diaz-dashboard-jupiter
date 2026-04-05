/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useCreateFeaturedBrandsMutation,
  useDeleteFeaturedBrandsMutation,
  useGetFeaturedBrandsQuery,
  useUpdateFeaturedBrandsMutation,
} from '@/redux/features/contentmanagement/contentmanagement';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  AddBrandModal,
  BrandsGrid,
  BrandsPreview,
  FeaturedBrandsHeader,
  SiteSelector,
  type FeaturedBrandFormData,
  type FeaturedBrandItem,
} from '../components/FeaturedBrands';

const FeaturedBrands: React.FC = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSite] = useState<'FLORIDA' | 'JUPITER'>('JUPITER');
  const [deletingBrandId, setDeletingBrandId] = useState<string | undefined>();

  const { data: getFeaturedBrandsData, isLoading } =
    useGetFeaturedBrandsQuery(selectedSite, {
      refetchOnMountOrArgChange: true,
    });
  const [createFeaturedBrands, { isLoading: isCreating }] =
    useCreateFeaturedBrandsMutation();
  const [updateFeaturedBrands] = useUpdateFeaturedBrandsMutation();
  const [deleteFeaturedBrands] = useDeleteFeaturedBrandsMutation();

  const brands: FeaturedBrandItem[] = Array.isArray(getFeaturedBrandsData)
    ? getFeaturedBrandsData
    : ([] as FeaturedBrandItem[]);

  const handleAddBrand = async (formData: FeaturedBrandFormData) => {
    if (!formData.logo) {
      Swal.fire('Error', 'Please select a brand logo', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('featuredbrandLogo', formData.logo);
      formDataToSend.append('site', formData.site);

      await createFeaturedBrands({
        featuredBrands: formDataToSend,
      }).unwrap();

      await Swal.fire('Success!', 'Brand added successfully', 'success');
      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error('Error adding brand:', error);
      Swal.fire(
        'Error!',
        error?.data?.message || 'Failed to add brand',
        'error',
      );
    }
  };

  const handleUpdateBrand = async (id: string, file: File) => {
    try {
      const result = await Swal.fire({
        title: 'Update Brand Logo?',
        text: 'This will replace the existing logo',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, update it!',
      });

      if (!result.isConfirmed) return;

      const formDataToSend = new FormData();
      formDataToSend.append('featuredbrandLogo', file);
      formDataToSend.append('site', selectedSite);

      await updateFeaturedBrands({
        id,
        featuredBrands: formDataToSend,
      }).unwrap();

      await Swal.fire('Success!', 'Brand logo updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating brand:', error);
      Swal.fire(
        'Error!',
        error?.data?.message || 'Failed to update brand',
        'error',
      );
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
      });

      if (!result.isConfirmed) return;

      setDeletingBrandId(id);
      await deleteFeaturedBrands({ id }).unwrap();

      Swal.fire('Deleted!', 'Brand has been deleted', 'success');
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      Swal.fire(
        'Error!',
        error?.data?.message || 'Failed to delete brand',
        'error',
      );
    } finally {
      setDeletingBrandId(undefined);
    }
  };

  const handleSave = () => {
    Swal.fire('Info', 'Changes are saved automatically', 'info');
  };

  const handleBack = () => {
    navigate('/content');
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading brands...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <FeaturedBrandsHeader
        onBack={handleBack}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        onSave={handleSave}
        isPreviewMode={isPreviewMode}
        isSaving={false}
        onAdd={() => setIsAddModalOpen(true)}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {!isPreviewMode ? (
          <div className="space-y-6">
            <SiteSelector
              selectedSite={selectedSite}
              onChange={() => {}}
            />

            <BrandsGrid
              brands={brands}
              onDelete={handleDeleteBrand}
              onUpdate={handleUpdateBrand}
              deletingBrandId={deletingBrandId}
            />
          </div>
        ) : (
          <BrandsPreview brands={brands} />
        )}
      </div>

      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBrand}
        isSubmitting={isCreating}
      />
    </div>
  );
};

export default FeaturedBrands;

