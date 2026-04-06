import type {
  DispatchEntry,
  LeadReport,
} from '@/redux/features/dispatchReport/dispatchReportApi';
import { useGetDispatchReportQuery } from '@/redux/features/dispatchReport/dispatchReportApi';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  Search,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

/* ─── Helpers ─────────────────────────────────────────────── */
const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const minutesBetween = (start: string, end: string | null) => {
  if (!end) return null;
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  return Math.round(diff);
};

/* ─── Status Badge ────────────────────────────────────────── */
const LeadStatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACTIVE: 'bg-green-100 text-green-700',
    RESPONDED: 'bg-blue-100 text-blue-700',
    CLOSED: 'bg-gray-100 text-gray-600',
    ESCALATED: 'bg-orange-100 text-orange-700',
  };
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full ${map[status] ?? 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  );
};

/* ─── Dispatch Timeline ───────────────────────────────────── */
const DispatchTimeline = ({ dispatches }: { dispatches: DispatchEntry[] }) => {
  const sorted = [...dispatches].sort(
    (a, b) => a.assignment_order - b.assignment_order,
  );

  return (
    <div className="mt-3 space-y-2">
      {sorted.map((d, idx) => {
        const responseTime = minutesBetween(d.sent_at, d.responded_at);
        const isLast = idx === sorted.length - 1;

        return (
          <div key={d.id} className="relative flex gap-3">
            {/* Connector line */}
            {!isLast && (
              <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200" />
            )}

            {/* Icon */}
            <div
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                d.is_responded
                  ? 'bg-green-100 text-green-600'
                  : d.escalated_at
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              {d.is_responded ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : d.escalated_at ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {d.member_name}
                </span>
                <span className="text-xs text-gray-400">
                  #{d.assignment_order}
                </span>
                {d.is_responded && (
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                    Responded
                    {responseTime !== null ? ` in ${responseTime}m` : ''}
                  </span>
                )}
                {d.escalated_at && !d.is_responded && (
                  <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                    Escalated
                  </span>
                )}
                {!d.is_responded && !d.escalated_at && (
                  <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full font-medium">
                    No response
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{d.member_email}</p>
              <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-400">
                <span>Sent: {formatDate(d.sent_at)}</span>
                {d.responded_at && (
                  <span>Responded: {formatDate(d.responded_at)}</span>
                )}
                {d.escalated_at && (
                  <span>Escalated: {formatDate(d.escalated_at)}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Lead Report Card ────────────────────────────────────── */
const LeadReportCard = ({ report }: { report: LeadReport }) => {
  const [expanded, setExpanded] = useState(false);
  const respondedDispatch = report.dispatches.find((d) => d.is_responded);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header row */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Responded indicator */}
          <div
            className={`mt-0.5 shrink-0 ${report.responded ? 'text-green-500' : 'text-red-400'}`}
          >
            {report.responded ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {report.lead_name}
              </span>
              <LeadStatusBadge status={report.lead_status} />
              <span className="text-xs text-gray-400">
                ID #{report.lead_id}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {report.lead_email}
              </span>
              {report.lead_product && (
                <span className="truncate max-w-[200px]">
                  {report.lead_product}
                </span>
              )}
              <span>{formatDate(report.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-gray-500">Dispatches</p>
            <p className="text-sm font-semibold text-gray-800">
              {report.total_dispatches}
            </p>
          </div>
          {respondedDispatch && (
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Responded by</p>
              <p className="text-sm font-medium text-green-700 truncate max-w-[120px]">
                {respondedDispatch.member_name}
              </p>
            </div>
          )}
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded dispatch timeline */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-3 bg-gray-50">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Dispatch Chain
          </p>
          <DispatchTimeline dispatches={report.dispatches} />
        </div>
      )}
    </div>
  );
};

/* ─── Page ────────────────────────────────────────────────── */
const DispatchReport = () => {
  const [leadIdInput, setLeadIdInput] = useState('');
  const [leadIdFilter, setLeadIdFilter] = useState<number | undefined>();
  const [nameSearch, setNameSearch] = useState('');

  const { data, isLoading, isError, isFetching } = useGetDispatchReportQuery(
    leadIdFilter ? { lead_id: leadIdFilter } : undefined,
  );

  const handleSearch = () => {
    const id = parseInt(leadIdInput, 10);
    setLeadIdFilter(!isNaN(id) && id > 0 ? id : undefined);
  };

  const handleClear = () => {
    setLeadIdInput('');
    setLeadIdFilter(undefined);
  };

  const filtered = (data?.report ?? []).filter((r) =>
    nameSearch.trim()
      ? r.lead_name.toLowerCase().includes(nameSearch.toLowerCase()) ||
        r.lead_email.toLowerCase().includes(nameSearch.toLowerCase())
      : true,
  );

  const totalResponded = filtered.filter((r) => r.responded).length;
  const totalNotResponded = filtered.length - totalResponded;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Lead Dispatch Report
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track which team members received lead emails and whether they
          responded
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        {/* Name search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Search by lead name or email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Lead ID filter */}
        <div className="flex gap-2">
          <input
            type="number"
            value={leadIdInput}
            onChange={(e) => setLeadIdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Filter by Lead ID"
            min={1}
            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Filter
          </button>
          {leadIdFilter && (
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      {!isLoading && !isError && data && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            {
              label: 'Total Leads',
              value: filtered.length,
              color: 'text-gray-900',
              bg: 'bg-white',
            },
            {
              label: 'Responded',
              value: totalResponded,
              color: 'text-green-700',
              bg: 'bg-green-50',
            },
            {
              label: 'Not Responded',
              value: totalNotResponded,
              color: 'text-red-600',
              bg: 'bg-red-50',
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`${bg} rounded-lg border border-gray-200 p-3 text-center`}
            >
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading report...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-700">
          Failed to load dispatch report. Please try again.
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500">
          No dispatch records found
        </div>
      ) : (
        <div
          className={`space-y-3 ${isFetching ? 'opacity-60 pointer-events-none' : ''}`}
        >
          {filtered.map((report) => (
            <LeadReportCard key={report.lead_id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DispatchReport;
