/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AddAdminModal,
  UpdatePermissionsModal,
  UpdateRoleModal,
} from '@/components/UserPermission';
import type {
  AssignmentMember,
  CreateAssignmentMemberPayload,
} from '@/redux/features/assignmentMembers/assignmentMembersApi';
import {
  useCreateAssignmentMemberMutation,
  useDeleteAssignmentMemberMutation,
  useGetAssignmentMembersQuery,
  useUpdateAssignmentMemberMutation,
} from '@/redux/features/assignmentMembers/assignmentMembersApi';
import {
  useChangeRoleMutation,
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useGetAllPermissionUsersQuery,
  useUpdatePermissionsMutation,
} from '@/redux/features/permissionManagement/permission';
import { adminEmails } from '@/types/customer-contacted-types';
import type {
  CreateAdminRequest,
  PermissionUser,
  UpdateRoleRequest,
} from '@/types/permission-types';
import { useGetOurTeamQuery } from '@/redux/features/ourTeam/outTeamApi';
import {
  Check,
  MoreVertical,
  Pencil,
  Plus,
  Shield,
  Trash2,
  UserPlus,
  X,
  GripVertical,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* ─── Assignment Member Modal ────────────────────────────── */
interface AssignmentMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentMemberPayload) => void;
  isLoading: boolean;
  initial?: AssignmentMember | null;
  existingEmails: string[];
  nextOrder: number;
}

const AssignmentMemberModal: React.FC<AssignmentMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initial,
  existingEmails,
  nextOrder,
}) => {
  const [form, setForm] = useState({ name: '', email: '', order: nextOrder });
  const [manualMode, setManualMode] = useState(false);

  const { data: ourTeamData, isLoading: isTeamLoading } = useGetOurTeamQuery(
    undefined,
    {
      skip: !isOpen,
    },
  );

  const activeTeamMembers = (ourTeamData?.data ?? []).filter((m) => m.isActive);
  // Team members who have an email and are not already assigned
  const availableTeamMembers = activeTeamMembers.filter(
    (m) => m.email && !existingEmails.includes(m.email),
  );
  // Team members without email (shown as disabled)
  const noEmailTeamMembers = activeTeamMembers.filter((m) => !m.email);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initial?.name ?? '',
        email: initial?.email ?? '',
        order: initial?.order ?? nextOrder,
      });
      // When editing, always go to manual mode (pre-filled)
      setManualMode(!!initial);
    }
  }, [isOpen, initial, nextOrder]);

  if (!isOpen) return null;

  const selectTeamMember = (member: { name: string; email: string }) => {
    setForm((p) => ({ ...p, name: member.name, email: member.email ?? '' }));
    setManualMode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? 'Edit Assignment Member' : 'Add Assignment Member'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Team member picker — only on add, not edit */}
          {!initial && !manualMode && (
            <div className="p-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Select from team members
              </p>

              {isTeamLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                </div>
              ) : availableTeamMembers.length > 0 ||
                noEmailTeamMembers.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {availableTeamMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() =>
                        selectTeamMember({
                          name: member.name,
                          email: member.email!,
                        })
                      }
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                    >
                      {member.image?.url ? (
                        <img
                          src={member.image.url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.email}
                        </p>
                        {member.designation && (
                          <p className="text-xs text-blue-600 truncate">
                            {member.designation}
                          </p>
                        )}
                      </div>
                      <Check className="w-4 h-4 text-blue-400 shrink-0 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                  {noEmailTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed text-left"
                      title="Add an email to this team member to assign them"
                    >
                      {member.image?.url ? (
                        <img
                          src={member.image.url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-orange-500 truncate">
                          No email — add an email to enable
                        </p>
                        {member.designation && (
                          <p className="text-xs text-gray-400 truncate">
                            {member.designation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-gray-500 mb-4">
                  No unassigned team members with email found
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              <button
                type="button"
                onClick={() => setManualMode(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Enter manually
              </button>
            </div>
          )}

          {/* Manual / pre-filled form */}
          {(manualMode || initial) && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!initial && (
                <button
                  type="button"
                  onClick={() => {
                    setManualMode(false);
                    setForm({ name: '', email: '', order: 0 });
                  }}
                  className="text-xs text-blue-600 hover:underline mb-2 flex items-center gap-1"
                >
                  ← Back to team member list
                </button>
              )}

              {/* Name & email read-only preview if selected from team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="member-order"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notification Order <span className="text-red-500">*</span>
                </label>
                <input
                  id="member-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, order: Number(e.target.value) }))
                  }
                  required
                  placeholder="0"
                  title="Notification order (0 = first to receive)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  0 = first to receive lead notification email
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : initial ? 'Update' : 'Add Member'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Sortable Row ───────────────────────────────────────── */
const SortableRow: React.FC<{
  member: AssignmentMember;
  index: number;
  onEdit: (m: AssignmentMember) => void;
  onDelete: (m: AssignmentMember) => void;
  onToggle: (m: AssignmentMember) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}> = ({
  member,
  index,
  onEdit,
  onDelete,
  onToggle,
  isUpdating,
  isDeleting,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 transition-colors ${isDragging ? 'bg-blue-50 shadow-lg' : ''}`}
    >
      <td className="px-3 py-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 rounded"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          {index + 1}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {member.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {member.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">{member.email}</span>
      </td>
      <td className="px-4 py-4">
        <button
          onClick={() => onToggle(member)}
          disabled={isUpdating}
          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
            member.is_active
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {member.is_active ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member)}
            disabled={isDeleting}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ─── Assignment Members Tab ─────────────────────────────── */
const AssignmentMembersTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AssignmentMember | null>(
    null,
  );
  const [localMembers, setLocalMembers] = useState<AssignmentMember[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const {
    data: members = [],
    isLoading,
    isError,
  } = useGetAssignmentMembersQuery();
  const [createMember, { isLoading: isCreating }] =
    useCreateAssignmentMemberMutation();
  const [updateMember, { isLoading: isUpdating }] =
    useUpdateAssignmentMemberMutation();
  const [deleteMember, { isLoading: isDeleting }] =
    useDeleteAssignmentMemberMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setLocalMembers([...members].sort((a, b) => a.order - b.order));
  }, [members]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localMembers.findIndex((m) => m.id === active.id);
    const newIndex = localMembers.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(localMembers, oldIndex, newIndex);
    setLocalMembers(reordered);

    // Save new order to backend
    setIsSavingOrder(true);
    try {
      // Step 1: Set all orders to large temporary values to avoid unique conflicts
      const offset = 10000;
      await Promise.all(
        reordered.map((member, index) =>
          updateMember({
            id: member.id,
            data: { order: offset + index },
          }).unwrap(),
        ),
      );
      // Step 2: Set final order values sequentially
      for (let i = 0; i < reordered.length; i++) {
        await updateMember({
          id: reordered[i].id,
          data: { order: i },
        }).unwrap();
      }
      toast.success('Order saved');
    } catch {
      toast.error('Failed to save order');
      setLocalMembers([...members].sort((a, b) => a.order - b.order));
    } finally {
      setIsSavingOrder(false);
    }
  };

  const openAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };
  const openEdit = (member: AssignmentMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CreateAssignmentMemberPayload) => {
    try {
      if (editingMember) {
        await updateMember({
          id: editingMember.id,
          data: { name: data.name, email: data.email, order: data.order },
        }).unwrap();
        toast.success('Member updated successfully');
      } else {
        await createMember(data).unwrap();
        toast.success('Member added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Operation failed');
    }
  };

  const handleToggleActive = async (member: AssignmentMember) => {
    try {
      await updateMember({
        id: member.id,
        data: { isActive: !member.is_active },
      }).unwrap();
      toast.success(`Member ${member.is_active ? 'deactivated' : 'activated'}`);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (member: AssignmentMember) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Remove ${member.name} from lead assignments?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
    });
    if (result.isConfirmed) {
      try {
        await deleteMember(member.id).unwrap();
        toast.success('Member removed');
      } catch (error) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || 'Failed to remove member');
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading assignment members.</p>
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border-b border-gray-200 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Lead Assignment Members
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Drag rows to reorder notification priority
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSavingOrder && (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
                Saving order...
              </span>
            )}
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {localMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No assignment members found
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['', 'Order', 'Name', 'Email', 'Status', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localMembers.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className="divide-y divide-gray-200">
                    {localMembers.map((member, index) => (
                      <SortableRow
                        key={member.id}
                        member={member}
                        index={index}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onToggle={handleToggleActive}
                        isUpdating={isUpdating}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
          )}
        </div>
      </div>

      <AssignmentMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
        initial={editingMember}
        existingEmails={members.map((m) => m.email)}
        nextOrder={
          members.length > 0 ? Math.max(...members.map((m) => m.order)) + 1 : 0
        }
      />
    </>
  );
};

/* ─── Admin Users Tab ────────────────────────────────────── */
const AdminUsersTab: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);
  const [isUpdatePermissionsModalOpen, setIsUpdatePermissionsModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<PermissionUser | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetAllPermissionUsersQuery({});
  const [createAdmin, { isLoading: isCreating }] =
    useCreatePermissionMutation();
  const [updateRole, { isLoading: isUpdating }] = useChangeRoleMutation();
  const [updatePermissions, { isLoading: isUpdatingPerms }] =
    useUpdatePermissionsMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeletePermissionMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.dropdown-menu') &&
        !target.closest('.dropdown-button')
      ) {
        setOpenDropdownId(null);
      }
    };
    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdownId]);

  const handleCreateAdmin = async (data: CreateAdminRequest) => {
    try {
      await createAdmin(data).unwrap();
      toast.success('Admin created successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to create admin');
    }
  };

  const handleRoleUpdate = async (data: UpdateRoleRequest) => {
    if (!selectedUser) return;
    try {
      await updateRole({ id: selectedUser.id, data }).unwrap();
      toast.success('Role updated successfully');
      setIsUpdateRoleModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to update role');
    }
  };

  const handlePermissionsUpdate = async (permissions: string[]) => {
    if (!selectedUser) return;
    try {
      await updatePermissions({ id: selectedUser.id, permissions }).unwrap();
      toast.success('Permissions updated successfully');
      setIsUpdatePermissionsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to update permissions');
    }
  };

  const handleDeleteUser = async (user: PermissionUser) => {
    setOpenDropdownId(null);
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${user.name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
      try {
        await deleteUser(user.id).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        const err = error as { data?: { message?: string } };
        toast.error(err?.data?.message || 'Failed to delete user');
      }
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string, username: string) =>
    role === 'SUPER_ADMIN' ? (
      <span className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg whitespace-nowrap">
        Super Admin · @{username}
      </span>
    ) : (
      <span className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg whitespace-nowrap">
        Admin · @{username}
      </span>
    );

  const filteredUsers = users.filter(
    (user: any) => !adminEmails.includes(user.email),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Error loading users. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border-b border-gray-200 gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No admin users found
            </div>
          ) : (
            filteredUsers.map((user: PermissionUser) => (
              <div
                key={user.id}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 md:p-6 hover:bg-gray-50 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {user.email}
                    </p>
                    <div className="mt-1">
                      {getRoleBadge(user.role, user.username)}
                    </div>
                    {user.role === 'ADMIN' && user.permissions?.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        {user.permissions.length} permission
                        {user.permissions.length !== 1 ? 's' : ''} assigned
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Last Login:</span>{' '}
                      {formatDate(user.lastLoginAt)}
                    </div>
                    <div>
                      <span className="font-medium">Last Active:</span>{' '}
                      {formatDate(user.lastActiveAt)}
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === user.id ? null : user.id,
                        )
                      }
                      aria-label={`Options for ${user.name}`}
                      title={`Options for ${user.name}`}
                      className="dropdown-button p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openDropdownId === user.id && (
                      <div className="dropdown-menu absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsUpdateRoleModalOpen(true);
                            setOpenDropdownId(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                          disabled={isUpdating || isDeleting}
                        >
                          <Pencil className="w-4 h-4" />
                          Update Role
                        </button>
                        {user.role === 'ADMIN' && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUpdatePermissionsModalOpen(true);
                              setOpenDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isUpdatingPerms || isDeleting}
                          >
                            <Shield className="w-4 h-4" />
                            Manage Permissions
                          </button>
                        )}
                        {user.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                            disabled={isUpdating || isDeleting}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateAdmin}
        isLoading={isCreating}
      />

      {selectedUser && (
        <UpdateRoleModal
          isOpen={isUpdateRoleModalOpen}
          onClose={() => {
            setIsUpdateRoleModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handleRoleUpdate}
          currentRole={selectedUser.role}
          userName={selectedUser.name}
          isLoading={isUpdating}
        />
      )}

      {selectedUser && (
        <UpdatePermissionsModal
          isOpen={isUpdatePermissionsModalOpen}
          onClose={() => {
            setIsUpdatePermissionsModalOpen(false);
            setSelectedUser(null);
          }}
          onSubmit={handlePermissionsUpdate}
          currentPermissions={selectedUser.permissions ?? []}
          userName={selectedUser.name}
          isLoading={isUpdatingPerms}
        />
      )}
    </>
  );
};

/* ─── Page ────────────────────────────────────────────────── */
type Tab = 'admins' | 'assignment';

const UsersAndPermission: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('admins');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'admins', label: 'Admin Users' },
    { id: 'assignment', label: 'Lead Assignment Members' },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Users & Permissions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage admin users and access control
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'admins' ? <AdminUsersTab /> : <AssignmentMembersTab />}
    </div>
  );
};

export default UsersAndPermission;
