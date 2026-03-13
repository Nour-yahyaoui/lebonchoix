// app/annonces/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Building, TreePine, Store, Car, Briefcase, 
  Warehouse, Landmark, MapPin, Calendar, Eye, 
  ArrowLeft, Filter, X, Search, Heart
} from 'lucide-react';

interface Annonce {
  id: string;
  title: string;
  description: string;
  price: number;
  category_name: string;
  category_slug: string;
  delegation_id?: string;
  governorate_id?: string;
  delegation_name: string;
  governorate_name: string;
  address: string;
  image_url: string | null;
  images: string[];
  created_at: string;
  views: number;
}

export default function AnnoncesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allAnnonces, setAllAnnonces] = useState<Annonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    locationId: searchParams.get('locationId') || '',
    locationName: searchParams.get('locationName') || '',
    q: searchParams.get('q') || '',
    minPrice: '',
    maxPrice: ''
  });

  // Fetch ALL annonces on mount
  useEffect(() => {
    const fetchAllAnnonces = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/annonces');
        const data = await res.json();
        setAllAnnonces(Array.isArray(data) ? data : []);
        setFilteredAnnonces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch annonces:', error);
        setAllAnnonces([]);
        setFilteredAnnonces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnnonces();
  }, []);

  // Apply filters
  useEffect(() => {
    if (allAnnonces.length === 0) return;

    let filtered = [...allAnnonces];

    const category = searchParams.get('category');
    const locationId = searchParams.get('locationId');
    const locationName = searchParams.get('locationName');
    const q = searchParams.get('q');

    // Filter by category
    if (category) {
      filtered = filtered.filter(a => a.category_slug === category);
    }

    // IMPROVED LOCATION FILTER - Match by ID or name
    if (locationId || locationName) {
      const searchTerm = (locationId || locationName || '').toLowerCase();
      
      filtered = filtered.filter(a => {
        // Direct ID match (most reliable)
        if (locationId && (a.delegation_id === locationId || a.governorate_id === locationId)) {
          return true;
        }
        
        // Name matches in multiple fields
        return (
          a.delegation_name?.toLowerCase().includes(searchTerm) ||
          a.governorate_name?.toLowerCase().includes(searchTerm) ||
          `${a.delegation_name} ${a.governorate_name}`.toLowerCase().includes(searchTerm) ||
          a.address?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Filter by search query
    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.category_name?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(a => a.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(a => a.price <= parseInt(filters.maxPrice));
    }

    setFilteredAnnonces(filtered);
  }, [searchParams, allAnnonces, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.append('q', searchInput);
    if (filters.category) params.append('category', filters.category);
    if (filters.locationId) params.append('locationId', filters.locationId);
    if (filters.locationName) params.append('locationName', filters.locationName);
    router.push(`/annonces?${params.toString()}`);
  };

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/annonces?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/annonces');
    setSearchInput('');
    setFilters({
      category: '',
      locationId: '',
      locationName: '',
      q: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date: string) => {
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    return new Date(date).toLocaleDateString('fr-TN');
  };

  // Get icon for category (fallback when no image)
  const getCategoryIcon = (slug: string) => {
    switch(slug) {
      case 'houses': return <Home className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'apartments': return <Building className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'land': return <TreePine className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'commercial': return <Store className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'cars': return <Car className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'offices': return <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'warehouses': return <Warehouse className="h-6 w-6 sm:h-8 sm:w-8" />;
      case 'companies': return <Landmark className="h-6 w-6 sm:h-8 sm:w-8" />;
      default: return <Home className="h-6 w-6 sm:h-8 sm:w-8" />;
    }
  };

  // Get background color for category
  const getCategoryColor = (slug: string) => {
    switch(slug) {
      case 'houses': return 'bg-blue-100 text-blue-700';
      case 'apartments': return 'bg-green-100 text-green-700';
      case 'land': return 'bg-emerald-100 text-emerald-700';
      case 'commercial': return 'bg-purple-100 text-purple-700';
      case 'cars': return 'bg-red-100 text-red-700';
      case 'offices': return 'bg-orange-100 text-orange-700';
      case 'warehouses': return 'bg-yellow-100 text-yellow-700';
      case 'companies': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const categories = [
    { name: 'Maisons', slug: 'houses' },
    { name: 'Appartements', slug: 'apartments' },
    { name: 'Terrains', slug: 'land' },
    { name: 'Commerces', slug: 'commercial' },
    { name: 'Voitures', slug: 'cars' },
    { name: 'Bureaux', slug: 'offices' },
    { name: 'Entrepôts', slug: 'warehouses' },
    { name: 'Entreprises', slug: 'companies' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <Link 
                href="/" 
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
              </Link>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-900 truncate">
                {filteredAnnonces.length} annonce{filteredAnnonces.length > 1 ? 's' : ''}
              </h1>
            </div>
            
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition lg:hidden"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden xs:inline">Filtres</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="py-3 sm:py-4 md:py-5 border-t border-gray-100">
            <form onSubmit={handleSearch} className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher une annonce..."
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 lg:py-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-full xs:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-gray-800 transition shadow-sm"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Active filters */}
          {(searchParams.toString() || filters.minPrice || filters.maxPrice) && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-2 sm:py-3 border-t border-gray-100">
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm">
                  <span className="hidden xs:inline">Catégorie:</span> {categories.find(c => c.slug === filters.category)?.name}
                  <button onClick={() => applyFilter('category', '')} className="ml-0.5 sm:ml-1 hover:text-gray-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.locationName && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm">
                  <MapPin className="h-3 w-3" />
                  <span className="max-w-[80px] xs:max-w-[120px] sm:max-w-none truncate">{filters.locationName}</span>
                  <button onClick={() => { applyFilter('locationId', ''); applyFilter('locationName', ''); }} className="ml-0.5 sm:ml-1 hover:text-gray-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.q && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm">
                  "{filters.q}"
                  <button onClick={() => { applyFilter('q', ''); setSearchInput(''); }} className="ml-0.5 sm:ml-1 hover:text-gray-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm">
                  Prix: {filters.minPrice || '0'} - {filters.maxPrice || '∞'} DT
                </span>
              )}
              <button onClick={clearAllFilters} className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline ml-1 sm:ml-2">
                Effacer
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[280px] sm:w-80 bg-white z-50 lg:hidden overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-medium text-gray-900">Filtres</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">Catégories</h3>
                <div className="space-y-1 sm:space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => { applyFilter('category', cat.slug); setMobileFiltersOpen(false); }}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition ${
                        filters.category === cat.slug ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {getCategoryIcon(cat.slug)}
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">Prix (DT)</h3>
                <div className="space-y-2 sm:space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
              </div>

              <button onClick={() => setMobileFiltersOpen(false)} className="w-full mt-6 sm:mt-8 px-4 py-2.5 sm:py-3 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-gray-800 transition">
                Voir les résultats
              </button>
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-5 lg:p-6 sticky top-20 lg:top-24">
              <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-4 lg:mb-6">Filtres</h2>
              
              <div className="mb-6 lg:mb-8">
                <h3 className="text-sm lg:text-base font-medium text-gray-700 mb-3 lg:mb-4">Catégories</h3>
                <div className="space-y-1 lg:space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => applyFilter('category', cat.slug)}
                      className={`w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base rounded-lg lg:rounded-xl transition ${
                        filters.category === cat.slug ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {getCategoryIcon(cat.slug)}
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6 lg:mb-8">
                <h3 className="text-sm lg:text-base font-medium text-gray-700 mb-3 lg:mb-4">Prix (DT)</h3>
                <div className="space-y-2 lg:space-y-3">
                  <input
                    type="number"
                    placeholder="Prix minimum"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-200 rounded-lg lg:rounded-xl text-sm lg:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Prix maximum"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-200 rounded-lg lg:rounded-xl text-sm lg:text-base"
                  />
                </div>
              </div>

              <button onClick={clearAllFilters} className="w-full px-4 py-2 lg:py-3 text-sm lg:text-base text-gray-600 border border-gray-200 rounded-lg lg:rounded-xl hover:bg-gray-50 transition">
                Effacer les filtres
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-5 animate-pulse">
                    <div className="h-40 xs:h-44 sm:h-48 lg:h-56 xl:h-64 bg-gray-200 rounded-lg lg:rounded-xl mb-3 sm:mb-4 lg:mb-5"></div>
                    <div className="h-5 sm:h-6 lg:h-7 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3"></div>
                    <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredAnnonces.length === 0 ? (
              <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">😕</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-4 sm:mb-6">
                  Essayez de modifier vos filtres ou d'élargir votre recherche
                </p>
                <button onClick={clearAllFilters} className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:bg-gray-800 transition">
                  Voir toutes les annonces
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {filteredAnnonces.map((annonce) => (
                  <Link
                    key={annonce.id}
                    href={`/annonces/${annonce.id}`}
                    className="group bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg lg:hover:shadow-xl transition-all hover:-translate-y-0.5 lg:hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-40 xs:h-44 sm:h-48 lg:h-56 xl:h-64 bg-gray-100">
                      {annonce.image_url ? (
                        <img
                          src={annonce.image_url}
                          alt={annonce.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : annonce.images && annonce.images.length > 0 ? (
                        <img
                          src={annonce.images[0]}
                          alt={annonce.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          {getCategoryIcon(annonce.category_slug)}
                          <span className="text-xs sm:text-sm mt-1 sm:mt-2">Image non disponible</span>
                        </div>
                      )}
                      
                      {/* Category badge */}
                      <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(annonce.category_slug)}`}>
                        {annonce.category_name}
                      </div>

                      {/* Image count indicator */}
                      {annonce.images && annonce.images.length > 1 && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/60 text-white text-xs rounded-full">
                          {annonce.images.length}
                        </div>
                      )}

                      {/* Favorite button */}
                      <button className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-1.5 sm:p-2 lg:p-2.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition">
                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 lg:p-5">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition line-clamp-2">
                        {annonce.title}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">
                          {annonce.delegation_name}
                        </span>
                      </div>

                      <div className="flex flex-col xs:flex-row xs:items-end xs:justify-between gap-2 xs:gap-0">
                        <div>
                          <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                            {formatPrice(annonce.price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden xs:inline text-xs">{formatDate(annonce.created_at)}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            {annonce.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}