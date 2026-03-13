// components/location/location-stats.tsx
'use client';

import { useEffect, useState } from 'react';
import { Home, Building, Car, TreePine, Store, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface LocationStatsProps {
  governorate: string;
  delegationId?: string;
}

export function LocationStats({ governorate, delegationId }: LocationStatsProps) {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    total: 0,
    houses: 0,
    apartments: 0,
    cars: 0,
    lands: 0,
    commercial: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const url = delegationId 
          ? `/api/stats?delegationId=${delegationId}`
          : `/api/stats?governorate=${encodeURIComponent(governorate)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.log('Could not fetch stats');
      } finally {
        setLoading(false);
      }
    };

    if (governorate) {
      fetchStats();
    }
  }, [governorate, delegationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: t('categories.houses'), value: stats.houses, icon: Home, color: 'bg-blue-50 text-blue-600' },
    { label: t('categories.apartments'), value: stats.apartments, icon: Building, color: 'bg-green-50 text-green-600' },
    { label: t('categories.cars'), value: stats.cars, icon: Car, color: 'bg-red-50 text-red-600' },
    { label: t('categories.land'), value: stats.lands, icon: TreePine, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
        <span>📊</span>
        {t('location.inYourArea') || 'In your area'}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{t('home.properties')}</span>
          <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
        </div>
      </div>
    </div>
  );
}