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
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

const cards = [
  {
    key: 'yachts',
    label: 'Total Yachts Listed',
    sub: (p: OverviewCardsProps) =>
      `${p.totalYatchPercentageChange >= 0 ? '+' : ''}${p.totalYatchPercentageChange}% from last month`,
    value: (p: OverviewCardsProps) => p.totalYachts.toLocaleString(),
    icon: <LuShip className="h-7 w-7 text-white" />,
    bg: 'bg-[#003235]',
  },
  {
    key: 'pending',
    label: 'Pending Approvals',
    sub: () => 'Needs attention',
    value: (p: OverviewCardsProps) => p.pendingApprovals.toLocaleString(),
    icon: <MdOutlineDirectionsBoat className="h-7 w-7 text-white" />,
    bg: 'bg-[#00555A]',
  },
  {
    key: 'value',
    label: 'Total Listing Value',
    sub: () => 'Active listings',
    value: (p: OverviewCardsProps) => fmt(p.totalListingValue),
    icon: <LuDollarSign className="h-7 w-7 text-white" />,
    bg: 'bg-[#007B82]',
  },
  {
    key: 'active',
    label: 'Active Now',
    sub: (p: OverviewCardsProps) => `${p.todayVisitors} today`,
    value: (p: OverviewCardsProps) => p.activeNow.toLocaleString(),
    icon: <LuActivity className="h-7 w-7 text-white animate-pulse" />,
    bg: 'bg-[#00A3AC]',
  },
];

const OverviewCards = ({ cardsData }: { cardsData: OverviewCardsProps }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 py-6">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`flex items-center gap-3 justify-between ${card.bg} text-white px-5 xl:px-3 2xl:px-6 py-4 rounded-lg`}
        >
          <div className="space-y-1">
            <p className="text-xs opacity-80">{card.label}</p>
            <h1 className="text-2xl font-semibold">{card.value(cardsData)}</h1>
            <p className="text-xs opacity-70">{card.sub(cardsData)}</p>
          </div>
          {card.icon}
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
