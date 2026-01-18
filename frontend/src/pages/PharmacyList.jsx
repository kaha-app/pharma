import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePharmacies } from '../context/PharmacyContext';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import PharmacyGrid from '../components/pharmacy/PharmacyGrid';
import Pagination from '../components/common/Pagination';
import { Filter, Loader } from 'lucide-react';

export default function PharmacyList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadPharmacies, loading } = usePharmacies();

  // Get state from URL
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const minRating = parseFloat(searchParams.get('minRating')) || 0;
  const hasDelivery = searchParams.get('hasDelivery') === 'true';
  const hasPickup = searchParams.get('hasPickup') === 'true';

  const [showFilters, setShowFilters] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const filters = { minRating, hasDelivery, hasPickup };

  // Load pharmacies when URL params change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await loadPharmacies({
          page,
          limit: 24,
          search,
          minRating,
          hasDelivery,
          hasPickup,
        });
        setPharmacies(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Failed to load pharmacies:', error);
      }
    };
    fetchData();
  }, [page, search, minRating, hasDelivery, hasPickup]);

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || value === false || value === 0) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change (except when changing page itself)
    if (!updates.page && newParams.get('page')) {
      newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  };

  const handleSearchChange = (value) => {
    updateSearchParams({ search: value });
  };

  const handleFiltersChange = (newFilters) => {
    updateSearchParams({
      minRating: newFilters.minRating || undefined,
      hasDelivery: newFilters.hasDelivery || undefined,
      hasPickup: newFilters.hasPickup || undefined,
    });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePharmacyClick = (pharmacy) => {
    navigate(`/pharmacy/${pharmacy.id}`);
  };

  const activeFilterCount = [minRating > 0, hasDelivery, hasPickup].filter(Boolean).length;

  if (loading && pharmacies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading pharmacies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          All Pharmacies
        </h1>
        <p className="text-gray-600">
          {pagination.total > 0 ? (
            <>
              Showing {((page - 1) * 24) + 1}-{Math.min(page * 24, pagination.total)} of 3100 pharmacies
            </>
          ) : (
            'No pharmacies found'
          )}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <SearchBar 
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or address..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center justify-center space-x-2 md:w-auto"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-8">
          <FilterPanel 
            filters={filters}
            setFilters={handleFiltersChange}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Pharmacy Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <PharmacyGrid 
          pharmacies={pharmacies}
          onPharmacyClick={handlePharmacyClick}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination 
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
