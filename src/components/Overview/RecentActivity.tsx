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
        return <LuShip className="h-6 w-6 text-[#006EF0]" />;
      case 'listing_approved':
        return <LuCircleCheckBig className="h-6 w-6 text-[#006EF0]" />;
      case 'seller_verified':
        return <LuUserCheck className="h-6 w-6 text-[#006EF0]" />;
      case 'banner_uploaded':
        return <LuStar className="h-6 w-6 text-[#006EF0]" />;
      default:
        return <LuShip className="h-6 w-6 text-[#006EF0]" />;
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
    <div className="flex-1 bg-white p-4 rounded-lg border border-gray-200 shadow flex flex-col">
      <div className="flex items-center gap-10 justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      <ul className="my-10 space-y-3 flex-1 overflow-y-auto">
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 4 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg animate-pulse"
            >
              <div className="bg-gray-200 p-3 rounded-full w-12 h-12"></div>
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
              className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg"
            >
              <div className="bg-[#006EF01A] p-3 rounded-full">
                {getIcon(activity.type)}
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium"> {activity.title}</p>
                <p className="text-xs text-gray-500"> {activity.description}</p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(activity.createdAt)}
                </p>
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
          className="text-sm text-[#006EF0] hover:text-[#0052B4] font-medium transition-colors"
        >
          View More
        </button>
      )}
    </div>
  );
};

export default RecentActivity;
