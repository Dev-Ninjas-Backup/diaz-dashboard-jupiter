/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCreateOurTeamMutation,
  useDeleteOurTeamMutation,
  useGetOurTeamQuery,
  useUpdateOurTeamMutation,
  type TeamMember,
} from '@/redux/features/ourTeam/outTeamApi';
import { ArrowLeft, Edit2, Plus, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface TeamMemberFormData {
  name: string;
  designation: string;
  bio: string;
  email: string;
  contact: string;
  image: File | null;
  isActive: boolean;
}

interface EditingMember extends TeamMemberFormData {
  id?: string;
  existingImageUrl?: string;
}

const OurTeam: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: ourTeamData,
    isLoading: isOurTeamLoading,
    refetch,
  } = useGetOurTeamQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTeamMember, { isLoading: isCreating }] =
    useCreateOurTeamMutation();
  const [updateTeamMember, { isLoading: isUpdating }] =
    useUpdateOurTeamMutation();
  const [deleteTeamMember, { isLoading: isDeleting }] =
    useDeleteOurTeamMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<EditingMember | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    designation: '',
    bio: '',
    email: '',
    contact: '',
    image: null,
    isActive: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateForm = () => {
    setFormData({
      name: '',
      designation: '',
      bio: '',
      email: '',
      contact: '',
      image: null,
      isActive: true,
    });
    setImagePreview(null);
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const openEditForm = (member: TeamMember) => {
    setFormData({
      name: member.name,
      designation: member.designation,
      bio: member.bio || '',
      email: member.email || '',
      contact: member.contact || '',
      image: null,
      isActive: member.isActive,
    });
    setEditingMember({
      id: member.id,
      name: member.name,
      designation: member.designation,
      bio: member.bio || '',
      email: member.email || '',
      contact: member.contact || '',
      image: null,
      isActive: member.isActive,
      existingImageUrl: member.image?.url,
    });
    setImagePreview(member.image?.url || null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      designation: '',
      bio: '',
      email: '',
      contact: '',
      image: null,
      isActive: true,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.designation.trim()) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    if (!editingMember && !formData.image) {
      Swal.fire('Error', 'Please upload an image', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('designation', formData.designation);
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      if (formData.email) formDataToSend.append('email', formData.email);
      if (formData.contact) formDataToSend.append('contact', formData.contact);
      if (formData.image) formDataToSend.append('image', formData.image);

      if (editingMember?.id) {
        await updateTeamMember({
          id: editingMember.id,
          data: formDataToSend,
          isActive: formData.isActive,
        }).unwrap();
        await refetch();
        await Swal.fire(
          'Success!',
          'Team member updated successfully',
          'success',
        );
      } else {
        await createTeamMember(formDataToSend).unwrap();
        await refetch();
        await Swal.fire(
          'Success!',
          'Team member created successfully',
          'success',
        );
      }
      closeForm();
    } catch (error: any) {
      Swal.fire('Error!', error?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteTeamMember(id).unwrap();
        await refetch();
        Swal.fire('Deleted!', 'Team member has been deleted.', 'success');
      } catch (error: any) {
        Swal.fire(
          'Error!',
          error?.data?.message || 'Failed to delete team member',
          'error',
        );
      }
    }
  };

  const handleBack = () => {
    navigate('/content');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Our Team
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage team members
                </p>
              </div>
            </div>

            <button
              onClick={openCreateForm}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isOurTeamLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading team members...</p>
            </div>
          </div>
        ) : ourTeamData?.data && ourTeamData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...ourTeamData.data]
              .sort((a, b) => a.order - b.order)
              .map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden aspect-square">
                    {member.image?.url ? (
                      <img
                        src={member.image.url}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <span className="text-4xl font-bold text-blue-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm ${
                          member.isActive
                            ? 'bg-green-500/90 text-white'
                            : 'bg-gray-500/90 text-white'
                        }`}
                      >
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {member.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-4 truncate">
                      {member.designation}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(member)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No team members yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first team member
              </p>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add First Member
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isCreating || isUpdating}
                aria-label="Close modal"
                title="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Photo{' '}
                    {!editingMember && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {imagePreview ? 'Change Photo' : 'Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., Senior Developer"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., john@example.com"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., +1 234 567 8900"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Short biography of the team member..."
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      Active Status
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Enable to display this member on the website
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2.5 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium shadow-sm"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingMember ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    <span>
                      {editingMember ? 'Update Member' : 'Create Member'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurTeam;
