// components/location/location-search.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface Location {
  id: string;
  name: string;
  name_ar: string;
  type: 'governorate' | 'delegation' | 'locality';
  parent_name?: string;
}

interface LocationSearchProps {
  onLocationChange: (location: { id: string; name: string; type: string } | null) => void;
}

export function LocationSearch({ onLocationChange }: LocationSearchProps) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search locations
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (location: Location) => {
    setSelectedLocation(location);
    setQuery(language === 'ar' ? location.name_ar : location.name);
    setResults([]);
    setIsOpen(false);
    onLocationChange({
      id: location.id,
      name: location.name,
      type: location.type
    });
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setQuery('');
    setResults([]);
    onLocationChange(null);
  };

  return (
    <div ref={searchRef} className="relative flex-1">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={t('location.searchPlaceholder') || 'Search for a city, delegation...'}
          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-gray-900 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <div>
              {results.map((location) => (
                <button
                  key={`${location.type}-${location.id}`}
                  onClick={() => handleSelect(location)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3 border-b border-gray-100 last:border-0"
                >
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {language === 'ar' ? location.name_ar : location.name}
                    </div>
                    {location.parent_name && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {location.parent_name}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {location.type === 'governorate' && (t('location.governorate') || 'Governorate')}
                      {location.type === 'delegation' && (t('location.delegation') || 'Delegation')}
                      {location.type === 'locality' && (t('location.locality') || 'Area')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected location badge */}
      {selectedLocation && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {t('location.selected') || 'Selected:'}
          </span>
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {language === 'ar' ? selectedLocation.name_ar : selectedLocation.name}
          </span>
        </div>
      )}
    </div>
  );
}