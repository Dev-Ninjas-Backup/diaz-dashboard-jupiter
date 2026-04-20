import {
  LuShip,
  LuStar,
  LuUsers,
  LuChartBar,
  LuMailCheck,
  LuCircleCheck,
  LuCircle,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const actions = [
  { label: 'Review Pending Listings', icon: LuShip, path: '/boats' },
  { label: 'Manage Yacht Leads', icon: LuMailCheck, path: '/yacht-leads' },
  { label: 'Featured Yachts', icon: LuStar, path: '/featured' },
  { label: 'Analytics & Reports', icon: LuChartBar, path: '/analytics' },
  { label: 'Users & Permissions', icon: LuUsers, path: '/users' },
];

const systemStatus = [
  { label: 'Website', status: 'Online', ok: true },
  { label: 'Listing Sync', status: 'Active', ok: true },
  { label: 'Database', status: 'Healthy', ok: true },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-80 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <ul className="space-y-1.5">
          {actions.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <button
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-[#003235] transition-colors text-left"
              >
                <Icon className="h-4 w-4 text-[#007B82] shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">System Status</h2>
        <ul className="space-y-2.5">
          {systemStatus.map(({ label, status, ok }) => (
            <li key={label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-500">
                {ok ? (
                  <LuCircleCheck className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <LuCircle className="h-3.5 w-3.5 text-red-400" />
                )}
                {label}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ok
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuickActions;
