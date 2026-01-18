import { useState } from 'react';
import { usePharmacies } from '../context/PharmacyContext';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import PharmacyGrid from '../components/pharmacy/PharmacyGrid';
import Pagination from '../components/common/Pagination';
import PharmacyModal from '../components/pharmacy/PharmacyModal';
import { Filter, Loader } from 'lucide-react';

export default function PharmacyList() {
  const { 
    filteredPharmacies, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    filters, 
    setFilters 
  } = usePharmacies();

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  
  const itemsPerPage = 10; // Show 10 pharmacies per page
  const totalPages = Math.ceil(filteredPharmacies.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPharmacies = filteredPharmacies.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
  };

  if (loading) {
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
          Showing {startIndex + 1}-{Math.min(endIndex, filteredPharmacies.length)} of {filteredPharmacies.length} pharmacies
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or address..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center justify-center space-x-2 md:w-auto"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {(filters.minRating > 0 || filters.hasDelivery || filters.hasPickup) && (
            <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[filters.minRating > 0, filters.hasDelivery, filters.hasPickup].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-8">
          <FilterPanel 
            filters={filters}
            setFilters={setFilters}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Pharmacy Grid */}
      <PharmacyGrid 
        pharmacies={currentPharmacies}
        onPharmacyClick={handlePharmacyClick}
      />

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Pharmacy Detail Modal */}
      {selectedPharmacy && (
        <PharmacyModal 
          pharmacy={selectedPharmacy}
          onClose={() => setSelectedPharmacy(null)}
        />
      )}
    </div>
  );
}
