import { createContext, useContext, useState, useEffect } from 'react';

const PharmacyContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function PharmacyProvider({ children }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    hasDelivery: false,
    hasPickup: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadPharmacies();
    loadStats();
  }, []);

  useEffect(() => {
    loadPharmacies();
  }, [searchTerm, filters, pagination.page]);

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (filters.minRating > 0) {
        params.append('minRating', filters.minRating);
      }

      if (filters.hasDelivery) {
        params.append('hasDelivery', 'true');
      }

      if (filters.hasPickup) {
        params.append('hasPickup', 'true');
      }

      const response = await fetch(`${API_BASE_URL}/pharmacies?${params}`);
      if (!response.ok) throw new Error('Failed to load pharmacies');
      
      const result = await response.json();
      
      if (result.success) {
        setPharmacies(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
      } else {
        throw new Error(result.error || 'Failed to load pharmacies');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading pharmacies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to load stats');
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const resetPagination = () => {
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
  };

  // Client-side filtering is now handled by the API
  const filteredPharmacies = pharmacies;

  const value = {
    pharmacies,
    filteredPharmacies,
    loading,
    error,
    searchTerm,
    setSearchTerm: (term) => {
      setSearchTerm(term);
      resetPagination();
    },
    filters,
    setFilters: (newFilters) => {
      setFilters(newFilters);
      resetPagination();
    },
    pagination,
    loadMore,
    stats,
    refreshData: loadPharmacies,
  };

  return (
    <PharmacyContext.Provider value={value}>
      {children}
    </PharmacyContext.Provider>
  );
}

export function usePharmacies() {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacies must be used within PharmacyProvider');
  }
  return context;
}
