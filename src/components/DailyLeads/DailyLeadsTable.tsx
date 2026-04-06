import type { Lead } from '@/types/daily-leads-types';
import { useUpdateLeadStatusMutation } from '@/redux/features/dailyLeads/dailyLeads';
import { Eye, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { LeadDetailsModal } from './LeadDetailsModal';

interface DailyLeadsTableProps {
  leads: Lead[];
  onRefetch?: () => void;
}

export const DailyLeadsTable: React.FC<DailyLeadsTableProps> = ({
  leads,
  onRefetch,
}) => {
  const [updateLeadStatus] = useUpdateLeadStatusMutation();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleStatusToggle = async (lead: Lead) => {
    if (!lead.id) {
      toast.error('Lead ID not found');
      return;
    }

    const newStatus =
      lead.status === 'contacted' ? 'not contacted' : 'contacted';
    setUpdatingId(lead.id);

    try {
      await updateLeadStatus({ leadId: lead.id, status: newStatus }).unwrap();
      toast.success(`Lead marked as ${newStatus}`);
      // Refetch data after successful update
      if (onRefetch) {
        onRefetch();
      }
    } catch (error) {
      toast.error('Failed to update lead status');
      console.error('Error updating lead status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (leads.length === 0) {
    return (
      <div className="px-4 md:px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No leads found</p>
        <p className="text-sm text-gray-400 mt-1">
          AI-generated leads will appear here
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Info
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interested Product
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead, index) => (
              <tr
                key={lead.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {lead.name || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {lead.email || 'No email'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-blue-600">
                    {lead.product || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleStatusToggle(lead)}
                    disabled={updatingId === lead.id || !lead.id}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                      lead.status === 'contacted'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {updatingId === lead.id ? (
                      <span className="flex items-center gap-1">
                        <svg
                          className="animate-spin h-3 w-3"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Updating...
                      </span>
                    ) : lead.status === 'contacted' ? (
                      'Contacted'
                    ) : (
                      'Not Contacted'
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {formatDate(lead.created_at)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewDetails(lead)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {leads.map((lead, index) => (
          <div
            key={lead.id || index}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  #{index + 1}
                </span>
                <button
                  onClick={() => handleStatusToggle(lead)}
                  disabled={updatingId === lead.id || !lead.id}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    lead.status === 'contacted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {updatingId === lead.id
                    ? 'Updating...'
                    : lead.status === 'contacted'
                      ? 'Contacted'
                      : 'Not Contacted'}
                </button>
              </div>
              <button
                type="button"
                className="p-1 text-gray-600 hover:text-blue-600 rounded cursor-pointer"
                onClick={() => handleViewDetails(lead)}
                title="View Details"
                aria-label="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {lead.name || 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 truncate">
                  {lead.email || 'No email'}
                </span>
              </div>
            </div>

            {/* Product & Date */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Interested In</p>
                <p className="text-sm font-medium text-blue-600">
                  {lead.product || 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Date</p>
                <p className="text-sm text-gray-600">
                  {formatDate(lead.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};
