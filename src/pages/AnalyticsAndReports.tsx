import { useGetAnalyticsStatsQuery } from '@/redux/features/analytics/analyticsApi';
import { useVisitorSocket } from '@/hooks/useVisitorSocket';
import React from 'react';
import {
  LuUsers,
  LuEye,
  LuClock,
  LuActivity,
  LuWifi,
  LuWifiOff,
  LuTrendingUp,
  LuTrendingDown,
} from 'react-icons/lu';

const AnalyticsAndReports: React.FC = () => {
  const { data: metricsData, isLoading, isError } = useGetAnalyticsStatsQuery({});
  const { isConnected, activeCount, stats } = useVisitorSocket();

  const metrics = metricsData
    ? [
        {
          title: 'Total Visitors',
          value: metricsData.totalVisitors?.value?.toLocaleString() || '0',
          growth: metricsData.totalVisitors?.growth || 0,
          icon: <LuUsers className="w-5 h-5" />,
          color: 'blue',
        },
        {
          title: 'Page Views',
          value: metricsData.pageViews?.value?.toLocaleString() || '0',
          growth: metricsData.pageViews?.growth || 0,
          icon: <LuEye className="w-5 h-5" />,
          color: 'purple',
        },
        {
          title: 'Avg. Session Time',
          value: metricsData.avgSessionTime?.value || '0:00',
          growth: metricsData.avgSessionTime?.growth || 0,
          icon: <LuClock className="w-5 h-5" />,
          color: 'green',
        },
      ]
    : [];

  const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Analytics & Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track performance and insights</p>
        </div>
        {/* Socket connection status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {isConnected ? <LuWifi className="w-3.5 h-3.5" /> : <LuWifiOff className="w-3.5 h-3.5" />}
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* Real-time visitor cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <LuActivity className="w-4 h-4 text-green-500" />
          <h2 className="text-sm font-semibold text-gray-700">Real-Time</h2>
          {isConnected && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600">Live</span>
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Active Now', value: activeCount, icon: <LuActivity className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
            { label: "Today's Visitors", value: stats.todayVisitors, icon: <LuUsers className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
            { label: 'Total Visitors', value: stats.totalVisitors?.toLocaleString(), icon: <LuUsers className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
              <div className={`${item.bg} p-3 rounded-lg`}>{item.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{item.value ?? 0}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly metrics from REST API */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">This Month</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            Failed to load analytics data
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((metric) => {
              const colors = colorMap[metric.color];
              const isPositive = metric.growth >= 0;
              return (
                <div key={metric.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${colors.bg} p-2.5 rounded-lg ${colors.icon}`}>
                      {metric.icon}
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isPositive ? <LuTrendingUp className="w-3 h-3" /> : <LuTrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{metric.growth}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <p className="text-xs text-gray-400 mt-1">vs last month</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsAndReports;
