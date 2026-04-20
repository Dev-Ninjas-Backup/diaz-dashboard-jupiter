import React, { useRef, useState, useEffect } from 'react';
import { ImageIcon, X } from 'lucide-react';
import type { UpdateAdminSettingsPayload } from '@/redux/features/adminBannerApi/adminBannerApi';

interface Props {
  formData: UpdateAdminSettingsPayload;
  setFormData: React.Dispatch<React.SetStateAction<UpdateAdminSettingsPayload>>;
}

const Branding: React.FC<Props> = ({ formData, setFormData }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!formData.logo) {
      setLogoPreview(null);
    } else if (formData.logo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(formData.logo);
    } else if (typeof formData.logo === 'string') {
      setLogoPreview(formData.logo); // backend URL
    }
  }, [formData.logo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: undefined }));
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Branding</h2>

      <label className="block text-sm font-medium mb-4">Logo</label>

      <div className="flex gap-6 items-start">
        {/* Select Field / Dotted Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="h-32 w-full border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400"
        >
          <ImageIcon className="text-gray-400 w-8 h-8" />
        </div>

        {/* Preview */}
        {logoPreview && (
          <div className="relative w-32 h-32">
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveLogo}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleLogoUpload}
      />
    </div>
  );
};

export default Branding;
