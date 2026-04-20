import { useEffect } from 'react';
import { Eye, MapPin } from 'lucide-react';
import {
  useGetTopViewedBoatsQuery,
  type TopViewedBoat,
} from '@/redux/features/overview/dashboardOverview';
import type { VisitorStats } from '@/hooks/useVisitorSocket';

interface Props {
  socketStats: VisitorStats;
}

const YachtCard = ({ boat }: { boat: TopViewedBoat }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <div className="relative h-44 bg-gray-100">
      {boat.imageUrl ? (
        <img
          src={boat.imageUrl}
          alt={boat.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
          No image
        </div>
      )}
      <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
        <Eye className="w-3 h-3" />
        {boat.viewCount}
      </span>
    </div>

    <div className="p-4 flex flex-col gap-2 flex-1">
      {(boat.city || boat.state) && (
        <p className="flex items-center gap-1 text-xs text-orange-500 font-medium">
          <MapPin className="w-3 h-3 shrink-0" />
          {[boat.city, boat.state].filter(Boolean).join(', ')}
        </p>
      )}

      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
        {boat.name}
      </h3>

      <div className="grid grid-cols-3 gap-1 text-xs">
        <div>
          <p className="text-gray-400">Make</p>
          <p className="font-medium text-gray-700 truncate">{boat.make ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-400">Model</p>
          <p className="font-medium text-gray-700 truncate">{boat.model ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-400">Year</p>
          <p className="font-medium text-gray-700">{boat.buildYear ?? '—'}</p>
        </div>
      </div>

      {boat.price != null ? (
        <p className="text-orange-500 font-semibold text-sm mt-auto">
          ${boat.price.toLocaleString()}
        </p>
      ) : (
        <p className="text-gray-400 text-xs mt-auto">Price on request</p>
      )}
    </div>
  </div>
);

const TopViewedYachts = ({ socketStats }: Props) => {
  const { data, isLoading, refetch } = useGetTopViewedBoatsQuery();

  useEffect(() => {
    refetch();
  }, [socketStats.todayVisitors, socketStats.totalVisitors, refetch]);

  const top4 = (data ?? []).slice(0, 4);

  return (
    <div className="mt-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Top 4 Most Viewed Yachts
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm h-72 animate-pulse"
            />
          ))}
        </div>
      ) : top4.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center bg-white rounded-xl border border-gray-100">
          No yacht view data yet — views will appear here as visitors browse listings.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {top4.map((boat) => (
            <YachtCard key={boat.listingId} boat={boat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopViewedYachts;
