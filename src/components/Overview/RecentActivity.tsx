import { useState } from 'react';
import { LuCircleCheckBig, LuShip, LuStar, LuUserCheck } from 'react-icons/lu';

interface ActivityMeta {
  boatId: string;
  listingId?: string;
}

interface Activity {
  type: string;
  title: string;
  description: string;
  createdAt: string;
  meta: ActivityMeta;
}

interface RecentActivityProps {
  recentActivityData: Activity[];
  isLoading?: boolean;
}

const RecentActivity = ({
  recentActivityData,
  isLoading = false,
}: RecentActivityProps) => {
  const [visibleCount, setVisibleCount] = useState(4);

  const handleViewMore = () => {
    if (visibleCount === 4) {
      setVisibleCount(8);
    } else if (visibleCount === 8) {
      setVisibleCount(15);
    }
  };

  const displayedActivities = recentActivityData?.slice(0, visibleCount) || [];
  const hasMore =
    recentActivityData &&
    recentActivityData.length > visibleCount &&
    visibleCount < 15;
  const getIcon = (type: string) => {
    switch (type) {
      case 'boat_submitted':
        return <LuShip className="h-5 w-5 text-[#007B82]" />;
      case 'listing_approved':
        return <LuCircleCheckBig className="h-5 w-5 text-[#007B82]" />;
      case 'seller_verified':
        return <LuUserCheck className="h-5 w-5 text-[#007B82]" />;
      case 'banner_uploaded':
        return <LuStar className="h-5 w-5 text-[#007B82]" />;
      default:
        return <LuShip className="h-5 w-5 text-[#007B82]" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <ul className="space-y-2 flex-1 overflow-y-auto">
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 4 }).map((_, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg animate-pulse"
            >
              <div className="bg-gray-200 rounded-lg w-9 h-9 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </li>
          ))
        ) : displayedActivities && displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-teal-50 p-2 rounded-lg shrink-0">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.createdAt)}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="flex items-center justify-center p-8 text-gray-400">
            No recent activity
          </li>
        )}
      </ul>
      {hasMore && (
        <button
          onClick={handleViewMore}
          className="mt-3 text-xs text-[#007B82] hover:text-[#003235] font-medium transition-colors"
        >
          View more
        </button>
      )}
    </div>
  );
};

export default RecentActivity;
