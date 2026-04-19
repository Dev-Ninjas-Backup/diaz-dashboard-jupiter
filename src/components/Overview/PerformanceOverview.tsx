import { LuTrendingUp, LuEye, LuDollarSign, LuUsers } from 'react-icons/lu';

interface PerformanceOverviewData {
  totalVisitors: number;
  totalPageViews: number;
  totalListingValue: number;
}

const PerformanceOverview = ({
  performanceOverviewData,
}: {
  performanceOverviewData?: PerformanceOverviewData;
}) => {
  const fmtNum = (n?: number) => (n ?? 0).toLocaleString();
  const fmtMoney = (n?: number) => {
    if (!n) return '$0';
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n.toLocaleString()}`;
  };

  const items = [
    {
      icon: <LuTrendingUp className="text-[#006EF0] text-3xl" />,
      value: fmtNum(performanceOverviewData?.totalVisitors),
      label: 'Total Visitors (Month)',
    },
    {
      icon: <LuEye className="text-[#006EF0] text-3xl" />,
      value: fmtNum(performanceOverviewData?.totalPageViews),
      label: 'Page Views (Month)',
    },
    {
      icon: <LuDollarSign className="text-[#006EF0] text-3xl" />,
      value: fmtMoney(performanceOverviewData?.totalListingValue),
      label: 'Total Listing Value',
    },
    {
      icon: <LuUsers className="text-[#006EF0] text-3xl" />,
      value: fmtNum(performanceOverviewData?.totalVisitors),
      label: 'Monthly Sessions',
    },
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-lg bg-white mt-5">
      <h1 className="text-lg font-semibold">Performance Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col text-center items-center justify-center gap-2 p-4 rounded-lg bg-[#EFF6FF]"
          >
            {item.icon}
            <p className="text-xl font-semibold">{item.value}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceOverview;
