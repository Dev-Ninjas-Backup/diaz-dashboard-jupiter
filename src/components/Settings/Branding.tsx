import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, ImageIcon, CheckCircle } from 'lucide-react';
import type { UpdateAdminSettingsPayload } from '@/redux/features/adminBannerApi/adminBannerApi';

interface Props {
  formData: UpdateAdminSettingsPayload;
  setFormData: React.Dispatch<React.SetStateAction<UpdateAdminSettingsPayload>>;
  currentLogoUrl?: string | null;
}

const Branding: React.FC<Props> = ({ formData, setFormData, currentLogoUrl }) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.logo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(formData.logo);
    } else if (typeof formData.logo === 'string') {
      setLogoPreview(formData.logo);
    } else if (!formData.logo) {
      setLogoPreview(null);
    }
  }, [formData.logo]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, logo: undefined }));
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const newLogoSelected = formData.logo instanceof File;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Branding</h2>
      <p className="text-sm text-gray-500 mb-6">Customize your dashboard logo</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left — Upload Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Logo
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center gap-3 h-44 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG — Max 5MB</p>
            </div>
            {newLogoSelected && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                New file selected
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

        {/* Right — Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {newLogoSelected ? 'New Logo Preview' : 'Current Logo'}
          </label>
          <div className="h-44 border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center relative">
            {logoPreview || currentLogoUrl ? (
              <>
                <img
                  src={logoPreview || currentLogoUrl || ''}
                  alt="Logo preview"
                  className="max-h-32 max-w-full object-contain p-4"
                />
                {(logoPreview || newLogoSelected) && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    title="Remove logo"
                    aria-label="Remove logo"
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                {newLogoSelected && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Will be saved on update
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <ImageIcon className="w-10 h-10" />
                <p className="text-xs">No logo uploaded</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Branding;
