// components/location/location-picker.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, Navigation } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface LocationPickerProps {
  onLocationChange: (governorate: string, delegation?: string, id?: string) => void;
}

export function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [selectedGov, setSelectedGov] = useState('');
  const [selectedGovName, setSelectedGovName] = useState('');
  const [delegations, setDelegations] = useState<any[]>([]);
  const [selectedDel, setSelectedDel] = useState('');
  const [selectedDelName, setSelectedDelName] = useState('');
  const [loading, setLoading] = useState(false);

  // Load governorates from your Neon DB
  useEffect(() => {
    fetch('/api/locations/governorates')
      .then(res => res.json())
      .then(data => setGovernorates(data));
  }, []);

  // Load delegations when governorate changes
  useEffect(() => {
    if (selectedGov) {
      setLoading(true);
      fetch(`/api/locations/delegations?governorateId=${selectedGov}`)
        .then(res => res.json())
        .then(data => {
          setDelegations(data);
          setLoading(false);
        });
    }
  }, [selectedGov]);

  const handleSelect = () => {
    if (selectedDel) {
      const delName = delegations.find(d => d.id === selectedDel)?.name;
      onLocationChange(selectedGovName, delName, selectedDel);
    } else if (selectedGov) {
      onLocationChange(selectedGovName);
    }
    setIsOpen(false);
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(
            `/api/locations/nearby?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          );
          const data = await res.json();
          if (data.length > 0) {
            setSelectedGov(data[0].governorate_id);
            setSelectedGovName(data[0].governorate_name);
            setSelectedDel(data[0].id);
            setSelectedDelName(data[0].name);
            onLocationChange(data[0].governorate_name, data[0].name, data[0].id);
            setIsOpen(false);
          }
        } catch (error) {
          console.log('Could not get location');
        }
      });
    }
  };

  const displayText = selectedDelName 
    ? `${selectedDelName}, ${selectedGovName}`
    : selectedGovName 
    ? selectedGovName
    : t('location.selectLocation') || 'Select location';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition min-w-[200px]"
      >
        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <span className="text-sm text-gray-700 truncate flex-1 text-left">
          {displayText}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              {t('location.chooseLocation') || 'Choose your location'}
            </h3>
            
            {/* Governorate Select */}
            <select
              value={selectedGov}
              onChange={(e) => {
                const gov = governorates.find(g => g.id === e.target.value);
                setSelectedGov(e.target.value);
                setSelectedGovName(gov?.name || '');
                setSelectedDel('');
                setSelectedDelName('');
              }}
              className="w-full p-2 border border-gray-200 rounded-lg mb-2 text-sm"
            >
              <option value="">{t('location.selectGovernorate') || 'Select governorate'}</option>
              {governorates.map(gov => (
                <option key={gov.id} value={gov.id}>{gov.name}</option>
              ))}
            </select>

            {/* Delegation Select */}
            {selectedGov && (
              <select
                value={selectedDel}
                onChange={(e) => {
                  const del = delegations.find(d => d.id === e.target.value);
                  setSelectedDel(e.target.value);
                  setSelectedDelName(del?.name || '');
                }}
                className="w-full p-2 border border-gray-200 rounded-lg mb-3 text-sm"
                disabled={loading}
              >
                <option value="">{t('location.selectDelegation') || 'Select delegation'}</option>
                {delegations.map(del => (
                  <option key={del.id} value={del.id}>{del.name}</option>
                ))}
              </select>
            )}

            {/* Use my location button */}
            <button
              onClick={handleUseMyLocation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
            >
              <Navigation className="h-4 w-4" />
              {t('location.useMyLocation') || 'Use my current location'}
            </button>

            <div className="flex justify-end mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={handleSelect}
                disabled={!selectedGov}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {t('location.apply') || 'Apply'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}