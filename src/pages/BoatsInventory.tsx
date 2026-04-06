import type { Boat } from '@/redux/features/boatsApi/boatsApi';
import {
  useGetBoatsComBoatsQuery,
  useGetYachtBrokerBoatsQuery,
} from '@/redux/features/boatsApi/boatsApi';
import {
  Anchor,
  ChevronLeft,
  ChevronRight,
  Eye,
  Fuel,
  Gauge,
  MapPin,
  Search,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

type Tab = 'boats-com' | 'yachtbroker';
const LIMIT = 10;

/* ─── Helpers ─────────────────────────────────────────────── */
const formatPrice = (price: string) => {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/* ─── Detail Modal ────────────────────────────────────────── */
const BoatDetailModal = ({
  boat,
  onClose,
}: {
  boat: Boat;
  onClose: () => void;
}) => {
  const location = [
    boat.BoatLocation?.BoatCityName,
    boat.BoatLocation?.BoatStateCode,
    boat.BoatLocation?.BoatCountryID,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {boat.ModelYear} {boat.MakeString} {boat.Model}
            </h2>
            <p className="text-sm text-gray-500 mt-1">ID: {boat.DocumentID}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-220px)] overflow-y-auto space-y-6">
          {/* Image */}
          {boat.Images?.Uri && (
            <div>
              <img
                src={boat.Images.Uri}
                alt={
                  boat.Images.Caption ||
                  `${boat.ModelYear} ${boat.MakeString} ${boat.Model}`
                }
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
              {boat.Images.Caption && (
                <p className="text-xs text-gray-400 mt-1">
                  {boat.Images.Caption}
                </p>
              )}
            </div>
          )}

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium mb-1">Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(boat.Price)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium mb-1">Year</p>
              <p className="text-2xl font-bold text-gray-900">
                {boat.ModelYear}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium mb-1">Length</p>
              <p className="text-2xl font-bold text-gray-900">
                {boat.LengthOverall || boat.NominalLength}
              </p>
            </div>
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Anchor className="w-4 h-4" />,
                  label: 'Make & Model',
                  value: `${boat.MakeString} ${boat.Model}`,
                },
                {
                  icon: <Gauge className="w-4 h-4" />,
                  label: 'Length Overall',
                  value: boat.LengthOverall,
                },
                {
                  icon: <Gauge className="w-4 h-4" />,
                  label: 'Beam',
                  value: boat.BeamMeasure,
                },
                {
                  icon: <Zap className="w-4 h-4" />,
                  label: 'Engine Power',
                  value: boat.TotalEnginePowerQuantity,
                },
                {
                  icon: <Fuel className="w-4 h-4" />,
                  label: 'Fuel Tank',
                  value: boat.FuelTankCapacityMeasure,
                },
                {
                  icon: <MapPin className="w-4 h-4" />,
                  label: 'Location',
                  value: location,
                },
              ].map(({ icon, label, value }) =>
                value ? (
                  <div key={label} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5 shrink-0">
                      {icon}
                    </span>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {value}
                      </p>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          {/* Engines */}
          {boat.Engines?.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Engines
              </h3>
              <div className="space-y-2">
                {boat.Engines.map((eng, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      Engine {i + 1}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {[
                        ['Make', eng.Make],
                        ['Model', eng.Model],
                        ['Power', eng.EnginePower],
                        [
                          'Hours',
                          eng.Hours != null ? `${eng.Hours} hrs` : null,
                        ],
                        ['Fuel', eng.Fuel],
                        ['Type', eng.Type],
                        ['Year', eng.Year],
                      ].map(([label, val]) =>
                        val ? (
                          <div key={label as string}>
                            <p className="text-gray-500 text-xs">{label}</p>
                            <p className="font-medium text-gray-900">{val}</p>
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {(boat.GeneralBoatDescription?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <div
                className="text-sm text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: boat.GeneralBoatDescription![0],
                }}
              />
            </div>
          )}

          {/* Dates */}
          <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Received</p>
              <p className="font-medium text-gray-900">
                {formatDate(boat.ItemReceivedDate)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Last Modified</p>
              <p className="font-medium text-gray-900">
                {formatDate(boat.LastModificationDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Pagination ──────────────────────────────────────────── */
const Pagination = ({
  page,
  totalPage,
  total,
  limit,
  onChange,
  onLimitChange,
}: {
  page: number;
  totalPage: number;
  total: number;
  limit: number;
  onChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}) => {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | '...')[] = [];
  if (totalPage <= 7) {
    for (let i = 1; i <= totalPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPage - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPage - 2) pages.push('...');
    pages.push(totalPage);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-200">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          Showing{' '}
          <span className="font-medium text-gray-700">
            {from}–{to}
          </span>{' '}
          of <span className="font-medium text-gray-700">{total}</span> boats
        </span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {[10, 20, 50].map((l) => (
            <option key={l} value={l}>
              {l} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="px-2 text-gray-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`min-w-[32px] h-8 text-sm rounded-lg border transition-colors ${
                p === page
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPage}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ─── Table ───────────────────────────────────────────────── */
const BoatsTable = ({
  boats,
  onView,
}: {
  boats: Boat[];
  onView: (boat: Boat) => void;
}) => {
  if (boats.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-gray-500">No boats found</div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                'Image',
                'Boat',
                'Location',
                'Price',
                'Length',
                'Engine Power',
                'Date',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {boats.map((boat) => (
              <tr
                key={boat.DocumentID}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-3">
                  {boat.Images?.Uri ? (
                    <img
                      src={boat.Images.Uri}
                      alt=""
                      className="w-16 h-12 object-cover rounded-md border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-300">
                      <Anchor className="w-5 h-5" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">
                    {boat.MakeString} {boat.Model}
                  </p>
                  <p className="text-xs text-gray-500">
                    Year: {boat.ModelYear}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    <span>
                      {[
                        boat.BoatLocation?.BoatCityName,
                        boat.BoatLocation?.BoatStateCode,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-cyan-600">
                    {formatPrice(boat.Price)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {boat.LengthOverall || boat.NominalLength}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {boat.TotalEnginePowerQuantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">
                    {formatDate(boat.LastModificationDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onView(boat)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="lg:hidden divide-y divide-gray-200">
        {boats.map((boat) => (
          <div
            key={boat.DocumentID}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex gap-3 mb-3">
              {boat.Images?.Uri ? (
                <img
                  src={boat.Images.Uri}
                  alt=""
                  className="w-20 h-16 object-cover rounded-md border border-gray-200 shrink-0"
                />
              ) : (
                <div className="w-20 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 shrink-0">
                  <Anchor className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {boat.MakeString} {boat.Model}
                </p>
                <p className="text-xs text-gray-500">Year: {boat.ModelYear}</p>
                <p className="text-sm font-semibold text-cyan-600 mt-1">
                  {formatPrice(boat.Price)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm text-gray-800">
                  {[
                    boat.BoatLocation?.BoatCityName,
                    boat.BoatLocation?.BoatStateCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Length</p>
                <p className="text-sm text-gray-800">
                  {boat.LengthOverall || boat.NominalLength}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Engine Power</p>
                <p className="text-sm text-gray-800">
                  {boat.TotalEnginePowerQuantity}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Modified</p>
                <p className="text-sm text-gray-800">
                  {formatDate(boat.LastModificationDate)}
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => onView(boat)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/* ─── Tab Content ─────────────────────────────────────────── */
const BoatsTabContent = ({ source }: { source: Tab }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT);
  const [search, setSearch] = useState('');
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);

  const boatsComResult = useGetBoatsComBoatsQuery(
    { page, limit },
    { skip: source !== 'boats-com' },
  );
  const yachtBrokerResult = useGetYachtBrokerBoatsQuery(
    { page, limit },
    { skip: source !== 'yachtbroker' },
  );

  const { data, isLoading, isFetching, isError } =
    source === 'boats-com' ? boatsComResult : yachtBrokerResult;

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (l: number) => {
    setLimit(l);
    setPage(1);
  };

  const filtered = search.trim()
    ? (data?.data ?? []).filter((b) =>
        `${b.MakeString} ${b.Model} ${b.ModelYear} ${b.BoatLocation?.BoatCityName}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : (data?.data ?? []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading boats...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load boats</p>
          <p className="text-gray-500 text-sm mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by make, model, location..."
            className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
          isFetching ? 'opacity-60' : ''
        }`}
      >
        <BoatsTable boats={filtered} onView={setSelectedBoat} />

        {data?.metadata && !search && (
          <Pagination
            page={data.metadata.page}
            totalPage={data.metadata.totalPage}
            total={data.metadata.total}
            limit={data.metadata.limit}
            onChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {/* Detail Modal */}
      {selectedBoat && (
        <BoatDetailModal
          boat={selectedBoat}
          onClose={() => setSelectedBoat(null)}
        />
      )}
    </>
  );
};

/* ─── Page ────────────────────────────────────────────────── */
const BoatsInventory = () => {
  const [activeTab, setActiveTab] = useState<Tab>('boats-com');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'boats-com', label: 'Boats.com' },
    { id: 'yachtbroker', label: 'YachtBroker' },
  ];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Boats Inventory
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse synced boats from external platforms
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <BoatsTabContent key={activeTab} source={activeTab} />
    </div>
  );
};

export default BoatsInventory;
