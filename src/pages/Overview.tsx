import OverviewCards from '@/components/Overview/OverviewCards';
import PerformanceOverview from '@/components/Overview/PerformanceOverview';
import QuickActions from '@/components/Overview/QuickActions';
import RecentActivity from '@/components/Overview/RecentActivity';
import TopViewedYachts from '@/components/Overview/TopViewedYachts';
import { useVisitorSocket } from '@/hooks/useVisitorSocket';
import {
  useGetDashboardOverviewQuery,
  useGetPerformanceOverviewQuery,
  useGetRecentActivityQuery,
} from '@/redux/features/overview/dashboardOverview';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const Overview = () => {
  const { data: dashboardData } = useGetDashboardOverviewQuery({});
  const { data: recentActivityData } = useGetRecentActivityQuery({});
  const { data: performanceOverviewData } = useGetPerformanceOverviewQuery({});
  const { activeCount, stats } = useVisitorSocket();

  const cardsData = {
    totalYachts: dashboardData?.totalYachtsListed || 0,
    pendingApprovals: dashboardData?.totalPendingApprovals || 0,
    totalListingValue: performanceOverviewData?.totalListingValue || 0,
    totalYatchPercentageChange:
      dashboardData?.totalYachtsListedChangePercent || 0,
    activeNow: activeCount,
    todayVisitors: stats.todayVisitors,
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 md:p-6 space-y-0">
      {/* Header */}
      <div className="mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">{today}</p>
      </div>

      {/* KPI Cards */}
      <OverviewCards cardsData={cardsData} />

      {/* Middle row: Recent Activity + Quick Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <RecentActivity recentActivityData={recentActivityData} />
        </div>
        <QuickActions />
      </div>

      {/* Performance strip */}
      <PerformanceOverview performanceOverviewData={performanceOverviewData} />

      {/* Top viewed yachts */}
      <TopViewedYachts socketStats={stats} />
    </div>
  );
};

export default Overview;
