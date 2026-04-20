import { LuTrendingUp, LuEye, LuDollarSign } from 'react-icons/lu';

interface PerformanceOverviewData {
  totalVisitors: number;
  totalPageViews: number;
  totalListingValue: number;
}

const fmtNum = (n?: number) => (n ?? 0).toLocaleString();
const fmtMoney = (n?: number) => {
  if (!n) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

const PerformanceOverview = ({
  performanceOverviewData,
}: {
  performanceOverviewData?: PerformanceOverviewData;
}) => {
  const items = [
    {
      icon: <LuTrendingUp className="h-5 w-5 text-[#007B82]" />,
      value: fmtNum(performanceOverviewData?.totalVisitors),
      label: 'Visitors This Month',
      bg: 'bg-teal-50',
    },
    {
      icon: <LuEye className="h-5 w-5 text-[#007B82]" />,
      value: fmtNum(performanceOverviewData?.totalPageViews),
      label: 'Page Views This Month',
      bg: 'bg-teal-50',
    },
    {
      icon: <LuDollarSign className="h-5 w-5 text-[#007B82]" />,
      value: fmtMoney(performanceOverviewData?.totalListingValue),
      label: 'Total Active Listing Value',
      bg: 'bg-teal-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Performance Overview
        <span className="ml-2 text-xs font-normal text-gray-400">This month</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-lg p-4 flex items-center gap-4`}
          >
            <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceOverview;
