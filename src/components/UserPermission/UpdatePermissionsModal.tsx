import { useGetAvailablePermissionsQuery } from '@/redux/features/permissionManagement/permission';
import { PERMISSION_GROUPS } from '@/types/permission-types';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface UpdatePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (permissions: string[]) => void;
  currentPermissions: string[];
  userName: string;
  isLoading?: boolean;
}

export const UpdatePermissionsModal: React.FC<UpdatePermissionsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentPermissions,
  userName,
  isLoading = false,
}) => {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(currentPermissions),
  );
  const { data: availablePermissions = [], isLoading: isLoadingPerms } =
    useGetAvailablePermissionsQuery(undefined, { skip: !isOpen });

  useEffect(() => {
    if (isOpen) {
      setSelected(new Set(currentPermissions));
    }
  }, [isOpen, currentPermissions]);

  const toggle = (permission: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }
      return next;
    });
  };

  const toggleGroup = (permissions: string[]) => {
    const groupPerms = permissions.filter((p) =>
      availablePermissions.includes(p),
    );
    const allSelected = groupPerms.every((p) => selected.has(p));
    setSelected((prev) => {
      const next = new Set(prev);
      groupPerms.forEach((p) => (allSelected ? next.delete(p) : next.add(p)));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Array.from(selected));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Manage Permissions
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{userName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Groups */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {isLoadingPerms ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              Object.entries(PERMISSION_GROUPS).map(([group, groupPerms]) => {
                const available = groupPerms.filter((p) =>
                  availablePermissions.includes(p),
                );
                if (available.length === 0) return null;
                const allSelected = available.every((p) => selected.has(p));
                const someSelected = available.some((p) => selected.has(p));

                return (
                  <div
                    key={group}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Group header */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(available)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {group}
                      </span>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el)
                            el.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() => toggleGroup(available)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </button>

                    {/* Individual permissions */}
                    <div className="divide-y divide-gray-100">
                      {available.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <span className="text-sm text-gray-600 font-mono">
                            {permission}
                          </span>
                          <input
                            type="checkbox"
                            checked={selected.has(permission)}
                            onChange={() => toggle(permission)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || isLoadingPerms}
            >
              {isLoading ? 'Saving...' : `Save Permissions (${selected.size})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
