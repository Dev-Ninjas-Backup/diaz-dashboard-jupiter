import { LuShip, LuActivity, LuDollarSign } from 'react-icons/lu';
import { MdOutlineDirectionsBoat } from 'react-icons/md';

interface OverviewCardsProps {
  totalYachts: number;
  pendingApprovals: number;
  totalListingValue: number;
  totalYatchPercentageChange: number;
  activeNow: number;
  todayVisitors: number;
}

const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

const TrendBadge = ({ pct }: { pct: number }) => (
  <span
    className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${
      pct >= 0
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-red-100 text-red-600'
    }`}
  >
    {pct >= 0 ? '↑' : '↓'} {Math.abs(pct)}%
  </span>
);

const OverviewCards = ({ cardsData }: { cardsData: OverviewCardsProps }) => {
  const cards = [
    {
      label: 'Total Yachts Listed',
      value: cardsData.totalYachts.toLocaleString(),
      sub: 'vs last month',
      badge: <TrendBadge pct={cardsData.totalYatchPercentageChange} />,
      icon: <LuShip className="h-6 w-6" />,
      accent: 'bg-[#003235]',
    },
    {
      label: 'Pending Approvals',
      value: cardsData.pendingApprovals.toLocaleString(),
      sub: 'Awaiting review',
      badge: cardsData.pendingApprovals > 0 && (
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
          Action needed
        </span>
      ),
      icon: <MdOutlineDirectionsBoat className="h-6 w-6" />,
      accent: 'bg-[#00555A]',
    },
    {
      label: 'Total Listing Value',
      value: fmt(cardsData.totalListingValue),
      sub: 'Active listings',
      badge: null,
      icon: <LuDollarSign className="h-6 w-6" />,
      accent: 'bg-[#007B82]',
    },
    {
      label: 'Active Visitors',
      value: cardsData.activeNow.toLocaleString(),
      sub: `${cardsData.todayVisitors} visits today`,
      badge: (
        <span className="flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      ),
      icon: <LuActivity className="h-6 w-6" />,
      accent: 'bg-[#00A3AC]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 py-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4"
        >
          <div className={`${card.accent} p-2.5 rounded-lg text-white shrink-0`}>
            {card.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 font-medium truncate">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
            <div className="flex items-center gap-2 mt-1.5">
              {card.badge}
              <span className="text-xs text-gray-400">{card.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
