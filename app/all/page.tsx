// app/all/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Home, Building, TreePine, Store, Car, Briefcase, 
  Warehouse, Landmark, MapPin, Calendar, Eye, 
  ArrowLeft, Grid, List, ChevronDown
} from 'lucide-react';

interface Annonce {
  id: string;
  title: string;
  description: string;
  price: number;
  category_name: string;
  category_slug: string;
  delegation_name: string;
  governorate_name: string;
  address: string;
  image_url: string;
  created_at: string;
  views: number;
}

export default function AllItemsPage() {
  const [items, setItems] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch all items
  useEffect(() => {
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/annonces');
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (date: string) => {
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    return new Date(date).toLocaleDateString('fr-TN');
  };

  // Get icon for category
  const getCategoryIcon = (slug: string) => {
    switch(slug) {
      case 'houses': return <Home className="h-5 w-5" />;
      case 'apartments': return <Building className="h-5 w-5" />;
      case 'land': return <TreePine className="h-5 w-5" />;
      case 'commercial': return <Store className="h-5 w-5" />;
      case 'cars': return <Car className="h-5 w-5" />;
      case 'offices': return <Briefcase className="h-5 w-5" />;
      case 'warehouses': return <Warehouse className="h-5 w-5" />;
      case 'companies': return <Landmark className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  // Get background color for category
  const getCategoryColor = (slug: string) => {
    switch(slug) {
      case 'houses': return 'bg-blue-50 text-blue-600';
      case 'apartments': return 'bg-green-50 text-green-600';
      case 'land': return 'bg-emerald-50 text-emerald-600';
      case 'commercial': return 'bg-purple-50 text-purple-600';
      case 'cars': return 'bg-red-50 text-red-600';
      case 'offices': return 'bg-orange-50 text-orange-600';
      case 'warehouses': return 'bg-yellow-50 text-yellow-600';
      case 'companies': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/" 
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </Link>
              <h1 className="text-lg sm:text-xl font-medium text-gray-900">
                Toutes les annonces
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <span>Trier par</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showSortMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSortMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                      <button
                        onClick={() => {
                          setSortBy('newest');
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === 'newest' ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        Plus récents
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('price_asc');
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === 'price_asc' ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        Prix croissant
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('price_desc');
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === 'price_desc' ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        Prix décroissant
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="py-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {sortedItems.length} annonces trouvées
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          // Loading skeletons
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-36 sm:h-40 lg:h-44 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : sortedItems.length === 0 ? (
          // Empty state
          <div className="text-center py-16 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-4">😕</div>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">
              Aucune annonce
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Il n'y a pas encore d'annonces disponibles.
            </p>
          </div>
        ) : (
          // Results
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedItems.map((item) => (
              <Link
                key={item.id}
                href={`/annonces/${item.id}`}
                className={`group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${
                  viewMode === 'grid' 
                    ? 'h-36 xs:h-40 sm:h-44 md:h-48' 
                    : 'h-36 sm:h-32 sm:w-48 md:h-36 md:w-56 flex-shrink-0'
                } bg-gray-100`}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {getCategoryIcon(item.category_slug)}
                    </div>
                  )}
                  
                  {/* Category badge */}
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category_slug)}`}>
                    {item.category_name}
                  </div>
                </div>

                {/* Content */}
                <div className={`p-3 sm:p-4 flex-1 ${
                  viewMode === 'list' ? 'flex flex-col justify-between' : ''
                }`}>
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-2">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {item.delegation_name}, {item.governorate_name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="hidden xs:inline">{formatDate(item.created_at)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}