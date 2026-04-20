/* eslint-disable @typescript-eslint/no-explicit-any */
import Branding from '@/components/Settings/Branding';
import General from '@/components/Settings/General';
import Notifications from '@/components/Settings/Notifications';
import type { UpdateAdminSettingsPayload } from '@/redux/features/adminBannerApi/adminBannerApi';
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from '@/redux/features/adminSettingApis/adminSettingsApi';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Tab = 'general' | 'branding' | 'notifications';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const { data, isLoading } = useGetAdminSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateAdminSettingsMutation();

  const [formData, setFormData] = useState<UpdateAdminSettingsPayload>({
    siteName: '',
    currency: 'USD',
    maintenanceMode: false,
    logo: null,
    newListingSubmitted: false,
    newSellerRegistration: false,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        siteName: data.siteName,
        currency: data.currency,
        maintenanceMode: data.maintenanceMode,
        logo: data.logoUrl, // logo file user upload করবে
        newListingSubmitted: data.newListingSubmitted,
        newSellerRegistration: data.newSellerRegistration,
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateSettings(formData).unwrap();
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update settings');
    }
  };
  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-gray-500">
            Configure your dashboard and preferences
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {(['general', 'branding', 'notifications'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'general' && (
        <General formData={formData} setFormData={setFormData} />
      )}
      {activeTab === 'branding' && (
        <Branding
          formData={formData}
          setFormData={setFormData}
          currentLogoUrl={data?.logoUrl}
        />
      )}
      {activeTab === 'notifications' && (
        <Notifications formData={formData} setFormData={setFormData} />
      )}
    </div>
  );
};

export default Settings;
