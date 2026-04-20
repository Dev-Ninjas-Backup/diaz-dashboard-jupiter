import type { CreateAdminRequest } from '@/types/permission-types';
import { X, Check, AlertCircle } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdminRequest) => void;
  isLoading?: boolean;
}

interface ApiError {
  data?: { message?: string | string[] };
}

const getErrorMessage = (error: ApiError): string => {
  if (Array.isArray(error?.data?.message)) return error.data.message.join(', ');
  return error?.data?.message || 'An error occurred';
};

const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
  <div className="flex items-center gap-2">
    {met ? (
      <Check className="w-4 h-4 text-green-500 shrink-0" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
    )}
    <span className={`text-xs ${met ? 'text-green-600' : 'text-red-600'}`}>{text}</span>
  </div>
);

export const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const randomString = Math.random().toString(36).substring(2, 15);
  const [formData, setFormData] = useState<CreateAdminRequest>({
    email: '',
    username: '',
    password: '',
    name: '',
    role: 'ADMIN',
    googleId: randomString,
    avatarUrl: randomString,
    isVerified: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateAdminRequest, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const passwordValidation = useMemo(() => {
    const pwd = formData.password;
    return {
      hasLowercase: /[a-z]/.test(pwd),
      hasUppercase: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      hasMinLength: pwd.length >= 8,
    };
  }, [formData.password]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateAdminRequest, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Letters, numbers, underscores only';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Max 20 characters';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password does not meet all requirements';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        toast.error(getErrorMessage(error as ApiError) || 'Failed to create admin');
      }
    }
  };

  const handleClose = () => {
    setFormData({ email: '', username: '', password: '', name: '', role: 'ADMIN', googleId: '', avatarUrl: '', isVerified: true });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Admin</h2>
          <button onClick={handleClose} disabled={isLoading} title="Close" aria-label="Close">
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="name" name="name"
              value={formData.name} onChange={handleChange}
              placeholder="John Doe" disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email" id="email" name="email"
              value={formData.email} onChange={handleChange}
              placeholder="admin@example.com" disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="username" name="username"
              value={formData.username} onChange={handleChange}
              placeholder="johndoe" maxLength={20} disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-400 text-xs mt-1">Letters, numbers, underscores only. Max 20 characters.</p>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password" id="password" name="password"
              value={formData.password} onChange={handleChange}
              placeholder="SuperSecret123!" disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formData.password
                  ? isPasswordValid
                    ? 'border-green-300 focus:ring-green-500'
                    : 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            {formData.password && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-gray-600">Password Requirements:</p>
                <PasswordRequirement met={passwordValidation.hasMinLength} text="At least 8 characters" />
                <PasswordRequirement met={passwordValidation.hasLowercase} text="Lowercase letter (a-z)" />
                <PasswordRequirement met={passwordValidation.hasUppercase} text="Uppercase letter (A-Z)" />
                <PasswordRequirement met={passwordValidation.hasNumber} text="Number (0-9)" />
                <PasswordRequirement met={passwordValidation.hasSpecial} text="Special character (!@#$%^&*)" />
              </div>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role" name="role"
              value={formData.role} onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button" onClick={handleClose} disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
