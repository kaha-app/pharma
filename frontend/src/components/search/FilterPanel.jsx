import { Star, Package, Truck, X } from 'lucide-react';

export default function FilterPanel({ filters, setFilters, onClose }) {
  const handleRatingChange = (rating) => {
    setFilters({ ...filters, minRating: rating });
  };

  const handleToggle = (key) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const clearFilters = () => {
    setFilters({
      minRating: 0,
      hasDelivery: false,
      hasPickup: false,
    });
  };

  const hasActiveFilters = filters.minRating > 0 || filters.hasDelivery || filters.hasPickup;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Minimum Rating
        </label>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                filters.minRating === rating
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm">& up</span>
            </button>
          ))}
          {filters.minRating > 0 && (
            <button
              onClick={() => handleRatingChange(0)}
              className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
            >
              Show all ratings
            </button>
          )}
        </div>
      </div>

      {/* Services Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Services
        </label>
        <div className="space-y-2">
          <button
            onClick={() => handleToggle('hasPickup')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg border transition-colors ${
              filters.hasPickup
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Package className={`w-5 h-5 ${filters.hasPickup ? 'text-primary-600' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">Pickup Available</span>
          </button>
          
          <button
            onClick={() => handleToggle('hasDelivery')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg border transition-colors ${
              filters.hasDelivery
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Truck className={`w-5 h-5 ${filters.hasDelivery ? 'text-primary-600' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">Delivery Available</span>
          </button>
        </div>
      </div>
    </div>
  );
}
