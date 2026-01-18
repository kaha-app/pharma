import { createContext, useContext, useState, useEffect } from 'react';

const PharmacyContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function PharmacyProvider({ children }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadPharmacies = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 24,
      });

      if (params.search) {
        queryParams.append('search', params.search);
      }

      if (params.minRating > 0) {
        queryParams.append('minRating', params.minRating);
      }

      if (params.hasDelivery) {
        queryParams.append('hasDelivery', 'true');
      }

      if (params.hasPickup) {
        queryParams.append('hasPickup', 'true');
      }

      const response = await fetch(`${API_BASE_URL}/pharmacies?${queryParams}`);
      if (!response.ok) throw new Error('Failed to load pharmacies');
      
      const result = await response.json();
      
      if (result.success) {
        return {
          data: result.data,
          pagination: result.pagination,
        };
      } else {
        throw new Error(result.error || 'Failed to load pharmacies');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading pharmacies:', err);
      throw err;
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

  const loadPharmacyById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacies/${id}`);
      if (!response.ok) throw new Error('Failed to load pharmacy');
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to load pharmacy');
      }
    } catch (err) {
      console.error('Error loading pharmacy:', err);
      throw err;
    }
  };

  const value = {
    loadPharmacies,
    loadPharmacyById,
    loading,
    error,
    stats,
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
