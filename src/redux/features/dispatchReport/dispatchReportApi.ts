import { baseApi } from '@/redux/api/baseApi';

export interface DispatchEntry {
  id: number;
  member_email: string;
  member_name: string;
  assignment_order: number;
  sent_at: string;
  is_responded: boolean;
  responded_at: string | null;
  escalated_at: string | null;
}

export interface LeadReport {
  lead_id: number;
  lead_name: string;
  lead_email: string;
  lead_product: string;
  lead_status: string;
  created_at: string;
  total_dispatches: number;
  responded: boolean;
  dispatches: DispatchEntry[];
}

export interface DispatchReportResponse {
  status: string;
  total_leads: number;
  report: LeadReport[];
}

const dispatchReportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDispatchReport: build.query<
      DispatchReportResponse,
      { lead_id?: number } | void
    >({
      query: (params) => ({
        url: '/daily_leads/dispatch-report',
        params:
          params && (params as { lead_id?: number }).lead_id
            ? { lead_id: (params as { lead_id?: number }).lead_id }
            : undefined,
      }),
    }),
  }),
});

export const { useGetDispatchReportQuery } = dispatchReportApi;
