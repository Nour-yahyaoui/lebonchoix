// app/annonces/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Building, TreePine, Store, Car, Briefcase, 
  Warehouse, Landmark, MapPin, Calendar, Eye, 
  ArrowLeft, Phone, Mail, User, Share2, Heart,
  ChevronLeft, ChevronRight, X, CheckCircle
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
  images: string[];
  created_at: string;
  views: number;
  user_id: string;
  user_name: string;
  user_email: string;
}

export default function AnnonceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchAnnonce = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/annonces/${params.id}`);
        const data = await res.json();
        setAnnonce(data);
      } catch (error) {
        console.error('Failed to fetch annonce:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnnonce();
    }
  }, [params.id]);

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
    return new Date(date).toLocaleDateString('fr-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get icon for category (fallback)
  const getCategoryIcon = (slug: string) => {
    switch(slug) {
      case 'houses': return <Home className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'apartments': return <Building className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'land': return <TreePine className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'commercial': return <Store className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'cars': return <Car className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'offices': return <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'warehouses': return <Warehouse className="h-5 w-5 sm:h-6 sm:w-6" />;
      case 'companies': return <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />;
      default: return <Home className="h-5 w-5 sm:h-6 sm:w-6" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-6 sm:mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 rounded-xl lg:rounded-2xl"></div>
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>
                <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl sm:text-6xl lg:text-7xl mb-4 sm:mb-6">😕</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Annonce non trouvée</h1>
          <p className="text-base sm:text-lg text-gray-500 mb-6 sm:mb-8">Cette annonce n'existe pas ou a été supprimée</p>
          <Link
            href="/annonces"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white text-base sm:text-lg rounded-lg sm:rounded-xl hover:bg-gray-800 transition"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
            Retour aux annonces
          </Link>
        </div>
      </div>
    );
  }

  // Use images from the database or empty array if none
  const images = annonce.images && annonce.images.length > 0 ? annonce.images : [];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <Link 
                href="/annonces" 
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg lg:rounded-xl transition flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
              </Link>
              <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-medium text-gray-900 truncate max-w-[200px] xs:max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] xl:max-w-2xl">
                {annonce.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2 sm:p-2.5 lg:p-3 hover:bg-gray-100 rounded-lg lg:rounded-xl transition">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
              </button>
              <button className="p-2 sm:p-2.5 lg:p-3 hover:bg-gray-100 rounded-lg lg:rounded-xl transition">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Left column - Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main image */}
            <div className="relative bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-lg lg:shadow-xl aspect-[4/3]">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={annonce.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                  }}
                />
              ) : null}

              {/* Fallback when no images */}
              {images.length === 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 fallback">
                  {getCategoryIcon(annonce.category_slug)}
                  <span className="text-xs sm:text-sm mt-1 sm:mt-2">Image non disponible</span>
                </div>
              )}

              {/* Image navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 sm:left-3 lg:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-2.5 lg:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 sm:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-2.5 lg:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-600" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xs sm:text-sm">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-[4/3] rounded-lg lg:rounded-xl overflow-hidden ${
                      selectedImage === idx ? 'ring-2 sm:ring-4 ring-blue-600' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${annonce.title} - Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Category badge and metadata */}
            <div className="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-4">
              <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs sm:text-sm lg:text-base font-medium ${getCategoryColor(annonce.category_slug)} w-fit`}>
                {getCategoryIcon(annonce.category_slug)}
                <span>{annonce.category_name}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm lg:text-base text-gray-500">
                <span className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">{formatDate(annonce.created_at)}</span>
                </span>
                <span className="flex items-center gap-1 sm:gap-2">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>{annonce.views || 0} vues</span>
                </span>
              </div>
            </div>

            {/* Title and price */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight">
                {annonce.title}
              </h1>
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-600">
                  {formatPrice(annonce.price)}
                </span>
                <span className="text-base sm:text-lg lg:text-xl text-gray-400">TND</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 bg-white rounded-xl lg:rounded-2xl border border-gray-200 shadow-sm">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-base sm:text-lg lg:text-xl text-gray-900 font-medium mb-0.5 sm:mb-1">{annonce.address}</p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-500">
                  {annonce.delegation_name}, {annonce.governorate_name}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 lg:mb-6">Description</h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {annonce.description}
              </p>
            </div>

            {/* Contact section */}
            <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 lg:mb-6">Contact</h2>
              
              {!showContact ? (
                <button
                  onClick={() => setShowContact(true)}
                  className="w-full py-3 sm:py-4 lg:py-5 bg-gray-900 text-white text-sm sm:text-base lg:text-lg font-medium rounded-lg lg:rounded-xl hover:bg-gray-800 transition shadow-md lg:shadow-lg"
                >
                  Afficher les coordonnées
                </button>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-lg lg:rounded-xl">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    <span className="text-sm sm:text-base lg:text-lg text-gray-900">{annonce.user_name || 'Vendeur'}</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-lg lg:rounded-xl">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    <a href={`mailto:${annonce.user_email}`} className="text-sm sm:text-base lg:text-lg text-blue-600 hover:underline break-all">
                      {annonce.user_email || 'contact@example.com'}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Safety tips */}
            <div className="bg-blue-50 rounded-xl lg:rounded-2xl p-5 sm:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-blue-900 mb-3 sm:mb-4">Conseils de sécurité</h3>
              <ul className="space-y-2 sm:space-y-3 text-blue-800">
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Rencontrez le vendeur dans un lieu public</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Vérifiez le bien avant tout paiement</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">Ne faites pas de paiement sans voir le bien</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}