// app/page.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { LocationSearch } from "@/components/location/location-search";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Building,
  TreePine,
  Store,
  PlusCircle,
  LogOut,
  User,
  Search,
  ArrowRight,
  Heart,
  Shield,
  Users,
  Car,
  Briefcase,
  Warehouse,
  Landmark,
  MapPin,
  FileText,
  CheckCircle,
  Map,
  Filter,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    id?: string;
    name: string;
    type?: "governorate" | "delegation" | "locality";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    houses: 0,
    apartments: 0,
    cars: 0,
    lands: 0,
    commercial: 0,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Detect user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const res = await fetch(
                  `/api/locations/nearby?lat=${position.coords.latitude}&lng=${position.coords.longitude}`,
                );
                const data = await res.json();
                if (data.length > 0) {
                  setUserLocation({
                    id: data[0].id,
                    name: data[0].name,
                    type: "delegation",
                  });
                }
              } catch (error) {
                console.log("Impossible de obtenir la position");
              }
              setLocationLoading(false);
            },
            () => {
              setLocationLoading(false);
            },
          );
        } else {
          setLocationLoading(false);
        }
      } catch (error) {
        console.log("Échec de la détection de position");
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

 // In your home page search handler
const handleSearch = () => {
  const params = new URLSearchParams();
  
  if (searchQuery) {
    params.append('q', searchQuery);
  }
  
  if (userLocation?.id) {
    params.append('locationId', userLocation.id);
    params.append('locationName', userLocation.name);
  }
  
  router.push(`/annonces?${params.toString()}`);
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  const categories = [
    {
      name: "Maisons",
      icon: Home,
      count: 234,
      bg: "bg-blue-50",
      slug: "houses",
    },
    {
      name: "Appartements",
      icon: Building,
      count: 567,
      bg: "bg-green-50",
      slug: "apartments",
    },
    {
      name: "Terrains",
      icon: TreePine,
      count: 89,
      bg: "bg-emerald-50",
      slug: "land",
    },
    {
      name: "Commerces",
      icon: Store,
      count: 45,
      bg: "bg-purple-50",
      slug: "commercial",
    },
    { name: "Voitures", icon: Car, count: 156, bg: "bg-red-50", slug: "cars" },
    {
      name: "Bureaux",
      icon: Briefcase,
      count: 78,
      bg: "bg-orange-50",
      slug: "offices",
    },
    {
      name: "Entrepôts",
      icon: Warehouse,
      count: 34,
      bg: "bg-yellow-50",
      slug: "warehouses",
    },
    {
      name: "Entreprises",
      icon: Landmark,
      count: 23,
      bg: "bg-indigo-50",
      slug: "companies",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-xl font-medium text-gray-900 hover:text-gray-600 transition flex items-center gap-1"
            >
              Deals Tunisie
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-2">
                simple & rapide
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/marketplace/new"
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition shadow-sm flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Publier</span>
                  </Link>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {user?.username}
                    </span>
                    <button
                      onClick={logout}
                      className="text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-900 transition"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition shadow-sm"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div
              className={`transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              {/* Location Banner */}
              {!locationLoading && (
                <div className="mb-6 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
                  <MapPin className="h-4 w-4" />
                  {userLocation ? (
                    <span>
                      📍 Deals près de{" "}
                      <span className="font-semibold">{userLocation.name}</span>
                    </span>
                  ) : (
                    <span>🏠 Où cherchez-vous ?</span>
                  )}
                </div>
              )}

              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
                La vie est plus simple
                <br />
                <span className="font-medium">avec les bonnes deals</span>
              </h1>

              <p className="mt-6 text-lg text-gray-500 max-w-md">
                Des milliers d'annonces près de chez vous. Maisons, voitures,
                terrains, commerces... Tout en un clic.
              </p>

              {/* Search Section - Clearly separated */}
              <div className="mt-8 space-y-4">
                {/* Location Search - First */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    1. Choisissez votre ville
                  </label>
                  <LocationSearch
                    onLocationChange={(location) => {
                      if (location) {
                        setUserLocation({
                          id: location.id,
                          name: location.name,
                          type: location.type as
                            | "governorate"
                            | "delegation"
                            | "locality",
                        });

                        // Fetch stats for this location
                        fetch(
                          `/api/stats?locationId=${location.id}&type=${location.type}`,
                        )
                          .then((res) => res.json())
                          .then((data) => setStats(data))
                          .catch((err) =>
                            console.log(
                              "Impossible de charger les statistiques",
                            ),
                          );
                      } else {
                        setUserLocation(null);
                        setStats({
                          total: 0,
                          houses: 0,
                          apartments: 0,
                          cars: 0,
                          lands: 0,
                          commercial: 0,
                        });
                      }
                    }}
                  />
                </div>

                {/* Item Search - Second */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    2. Que cherchez-vous ?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Maison, voiture, terrain..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
                    />

                    <button
                      onClick={handleSearch}
                      className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Rechercher
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Display */}
              {userLocation && stats.total > 0 && (
                <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6 max-w-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span>📊</span>
                    Dans votre région
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Home className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-gray-900">
                          {stats.houses}
                        </div>
                        <div className="text-xs text-gray-500">Maisons</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-gray-900">
                          {stats.apartments}
                        </div>
                        <div className="text-xs text-gray-500">
                          Appartements
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <Car className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-gray-900">
                          {stats.cars}
                        </div>
                        <div className="text-xs text-gray-500">Voitures</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <TreePine className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-gray-900">
                          {stats.lands}
                        </div>
                        <div className="text-xs text-gray-500">Terrains</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total annonces
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {stats.total}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick stats */}
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="text-2xl font-medium text-gray-900">15k+</div>
                  <div className="text-sm text-gray-500 mt-1">Annonces</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div>
                  <div className="text-2xl font-medium text-gray-900">8k+</div>
                  <div className="text-sm text-gray-500 mt-1">Vendeurs</div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div>
                  <div className="text-2xl font-medium text-gray-900">24/7</div>
                  <div className="text-sm text-gray-500 mt-1">Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Image */}
            <div
              className={`relative transform transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <div className="relative">
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-gray-100 rounded-2xl"></div>
                <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-50 rounded-2xl"></div>

                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/hand-house.png"
                    alt="Main tenant une maison"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 min-w-[180px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Nouveau</div>
                      <div className="text-sm font-medium text-gray-900">
                        Villa - 450k DT
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 min-w-[160px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <Car className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">
                        Ajouté récemment
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        BMW - 120k DT
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-medium text-gray-900">
              Parcourir par catégorie
            </h2>
            <p className="text-gray-500 mt-3">
              Ce qui vous intéresse aujourd'hui ?
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={index}
                  href={`/annonces?category=${cat.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all text-center"
                >
                  <div
                    className={`w-12 h-12 ${cat.bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition`}
                  >
                    <Icon className="h-5 w-5 text-gray-700" />
                  </div>
                  <h3 className="text-xs font-medium text-gray-900">
                    {cat.name}
                  </h3>
                 
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/annonces"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left side - Image */}
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gray-100 rounded-2xl"></div>
              <div className="absolute -bottom-2 -left-2 w-full h-full bg-gray-50 rounded-2xl"></div>

              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/buyers.png"
                  alt="Acheteurs heureux"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-full shadow-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <span className="text-sm font-medium text-gray-900">
                    100% Gratuit
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Mission text */}
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-medium">
                Pourquoi nous choisir
              </div>

              <h2 className="text-4xl font-light text-gray-900 leading-tight">
                La plus grande plateforme
                <br />
                <span className="font-medium">immobilière de Tunisie</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Des maisons aux voitures, des terrains aux commerces. Nous
                rassemblons toutes les opportunités au même endroit. Gratuit
                pour tous.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Home className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      Maisons
                    </h3>
                    <p className="text-xs text-gray-500">2k+ annonces</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      Appartements
                    </h3>
                    <p className="text-xs text-gray-500">5k+ annonces</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      Voitures
                    </h3>
                    <p className="text-xs text-gray-500">1.5k+ annonces</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TreePine className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      Terrains
                    </h3>
                    <p className="text-xs text-gray-500">500+ annonces</p>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="pt-6">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm group"
                  >
                    Commencer
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Partnership Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left side - Text */}
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Depuis 2024
              </div>

              <h2 className="text-4xl font-light text-gray-900 leading-tight">
                Le meilleur endroit pour
                <br />
                <span className="font-medium text-green-600">
                  des transactions fiables
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Nous réunissons acheteurs et vendeurs de la manière la plus
                transparente. Sans tracas, sans stress — des transactions
                fluides.
              </p>

              <div className="pt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Transactions sécurisées
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Toutes les transactions sont protégées et vérifiées
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Contact direct
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Connectez-vous directement avec les acheteurs et vendeurs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Processus simple
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Publiez en minutes, trouvez en secondes
                    </p>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="pt-6">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition shadow-sm group"
                  >
                    Commencer
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right side - Handshake Image */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-green-100 rounded-2xl"></div>
              <div className="absolute -bottom-2 -right-2 w-full h-full bg-green-50 rounded-2xl"></div>

              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/handshake.png"
                  alt="Poignée de main"
                  className="w-full h-auto object-cover"
                />

              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Paper Section - Making life easier */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left side - Paper Image */}
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-amber-100 rounded-2xl"></div>
              <div className="absolute -bottom-2 -left-2 w-full h-full bg-amber-50 rounded-2xl"></div>

              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/paper.png"
                  alt="Documents et paperasse simplifiés"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-full shadow-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Zéro paperasse
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Text */}
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Fini la complexité
              </div>

              <h2 className="text-4xl font-light text-gray-900 leading-tight">
                On s'occupe de tout.
                <br />
                <span className="font-medium">Vous, vous profitez.</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Plus besoin de courir après les papiers. Plus de stress avec les
                documents. On a simplifié chaque étape pour que trouver LA bonne
                affaire soit aussi simple qu'une conversation.
              </p>

              <div className="pt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Contact direct
                    </h3>
                    <p className="text-sm text-gray-500">
                      Parlez directement avec le vendeur, sans intermédiaire
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Visites organisées
                    </h3>
                    <p className="text-sm text-gray-500">
                      Planifiez vos visites en quelques clics
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Documents prêts
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tous les papiers nécessaires sont préparés pour vous
                    </p>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="pt-6">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-6 py-3 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition shadow-sm group"
                  >
                    Commencer simplement
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA for Non-Logged Users */}
      {!isAuthenticated && (
        <section className="border-t border-gray-100 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-medium text-gray-900">
                Prêt à trouver la bonne affaire ?
              </h2>
              <p className="text-gray-500 mt-3">
                Rejoignez des milliers de Tunisiens qui simplifient leur
                recherche chaque jour
              </p>
              <div className="mt-8 flex gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm"
                >
                  C'est parti
                </Link>
                <Link
                  href="/annonces"
                  className="px-6 py-3 border border-gray-200 bg-white text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  Voir les annonces
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
