/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Plus,
  Trash2,
  Edit,
  Globe,
  Upload,
  X,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import {
  useGetPartnersQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} from '@/redux/features/contentmanagement';

interface PartnerItem {
  id: string;
  name: string;
  description?: string;
  link?: string;
  logo?: {
    url: string;
  };
  site: string;
  createdAt: string;
}

const Partners: React.FC = () => {
  const navigate = useNavigate();
  const selectedSite = 'JUPITER' as const;

  const { data: partnersData, isLoading, refetch } = useGetPartnersQuery(
    selectedSite,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
  const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();
  const [deletePartner] = useDeletePartnerMutation();

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const partners: PartnerItem[] = Array.isArray(partnersData)
    ? partnersData
    : [];

  const openAddModal = () => {
    setEditingPartner(null);
    setName('');
    setDescription('');
    setLink('');
    setLogoFile(null);
    setLogoPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (partner: PartnerItem) => {
    setEditingPartner(partner);
    setName(partner.name);
    setDescription(partner.description || '');
    setLink(partner.link || '');
    setLogoFile(null);
    setLogoPreview(partner.logo?.url || null);
    setIsModalOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire('Error', 'Partner name is required', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('description', description);
      formDataToSend.append('link', link);
      formDataToSend.append('site', selectedSite);

      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      if (editingPartner) {
        await updatePartner({
          id: editingPartner.id,
          partners: formDataToSend,
        }).unwrap();
        Swal.fire('Success!', 'Partner updated successfully', 'success');
      } else {
        await createPartner({
          partners: formDataToSend,
        }).unwrap();
        Swal.fire('Success!', 'Partner created successfully', 'success');
      }

      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Error saving partner:', error);
      Swal.fire('Error!', error?.data?.message || 'Failed to save partner', 'error');
    }
  };

  const handleDelete = async (id: string) => {
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

      await deletePartner({ id }).unwrap();
      Swal.fire('Deleted!', 'Partner has been deleted.', 'success');
      refetch();
    } catch (error: any) {
      console.error('Error deleting partner:', error);
      Swal.fire('Error!', error?.data?.message || 'Failed to delete partner', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <button
            onClick={() => navigate('/content')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Content Management
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Partners Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your partner listings, descriptions, links, and logos
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Partner
        </button>
      </div>

      {/* Grid of Partners */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-xs">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Partners Found</h3>
          <p className="text-sm text-gray-500 mb-6">
            Get started by adding your first partner details.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Partner
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Link</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      {partner.logo?.url ? (
                        <img
                          src={partner.logo.url}
                          alt={partner.name}
                          className="w-12 h-12 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-200">
                          {partner.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-900">{partner.name}</td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                      {partner.description || '—'}
                    </td>
                    <td className="p-4 text-sm">
                      {partner.link ? (
                        <a
                          href={partner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          <Globe className="w-4 h-4" />
                          Link
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEditModal(partner)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit Partner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete Partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col my-8">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingPartner ? 'Edit Partner Details' : 'Add New Partner'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Florida Yacht"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              {/* URL Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL / Link
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://floridayachttrader.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description / Small Content
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide a small overview of what this partner does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-hidden resize-none"
                />
              </div>

              {/* Logo File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partner Logo (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors relative">
                  <div className="space-y-1 text-center">
                    {logoPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={logoPreview}
                          alt="Preview"
                          className="w-20 h-20 object-contain rounded-lg border p-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview(null);
                          }}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove Logo
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-hidden">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleLogoChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingPartner ? 'Save Changes' : 'Add Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
