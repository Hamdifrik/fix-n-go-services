import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, ArrowRight, Shield, Clock, Star, Users,
  Droplets, Zap, KeyRound, Flame, Wind, PanelTop, Paintbrush,
  Hammer, ChevronRight, ChevronLeft, MoreHorizontal, X,
} from 'lucide-react';
import { SERVICE_LABELS, ServiceType } from '@/types';
import { searchCities } from '@/data/frenchCities';
import heroBg from '@/assets/hero-bg.jpg';

/* ─────────────────────────────────────────
   Icônes SVG illustrées — Services
───────────────────────────────────────── */
const ServiceSVG: Record<ServiceType, React.FC<{ size?: number }>> = {
  plomberie: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#EFF6FF"/>
      <path d="M18 12h4v10h-4z" fill="#3B82F6" opacity=".3"/>
      <path d="M16 22h8v3a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-3z" fill="#3B82F6"/>
      <path d="M20 29v7" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="20" cy="12" r="3" fill="#60A5FA"/>
      <path d="M26 20h6v2h-6z" fill="#93C5FD" rx="1"/>
      <path d="M30 22v8a2 2 0 0 0 4 0v-8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="14" cy="20" r="2" fill="#BFDBFE"/>
    </svg>
  ),
  electricite: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#FFFBEB"/>
      <path d="M26 10L15 26h11l-4 12 13-18H24l2-8z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M26 10L15 26h11" fill="#FCD34D"/>
    </svg>
  ),
  serrurerie: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#F5F3FF"/>
      <rect x="15" y="20" width="18" height="16" rx="3" fill="#8B5CF6"/>
      <rect x="19" y="24" width="10" height="8" rx="2" fill="#7C3AED" opacity=".4"/>
      <circle cx="24" cy="28" r="3" fill="#EDE9FE"/>
      <path d="M24 28v4" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 20v-4a5 5 0 0 1 10 0v4" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  chauffage: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#FFF7ED"/>
      <path d="M24 36c-5 0-8-3-8-7 0-3 2-5 3-7 .5 2 1.5 3 2.5 3C20 21 22 17 24 13c2 4 4 8 2.5 12 1 0 2-1 2.5-3 1 2 3 4 3 7 0 4-3 7-8 7z" fill="#F97316"/>
      <path d="M24 36c-3 0-5-2-5-4 0-2 1-3 2-4 .3 1 1 2 1.5 2-.5-2 .5-5 1.5-7 1 2 2 5 1.5 7 .5 0 1.2-.8 1.5-2 1 1 2 2 2 4 0 2-2 4-5 4z" fill="#FDBA74"/>
    </svg>
  ),
  climatisation: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#EFF6FF"/>
      <rect x="10" y="16" width="28" height="12" rx="4" fill="#3B82F6"/>
      <rect x="13" y="19" width="22" height="6" rx="2" fill="#93C5FD" opacity=".5"/>
      <circle cx="31" cy="22" r="2" fill="#BFDBFE"/>
      <path d="M17 28v6M21 28v4M25 28v6M29 28v4" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 22h6M20 22h2M26 22h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
    </svg>
  ),
  vitrerie: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#F0FDF4"/>
      <rect x="12" y="10" width="24" height="28" rx="2" fill="#86EFAC" opacity=".3"/>
      <rect x="12" y="10" width="24" height="28" rx="2" stroke="#22C55E" strokeWidth="2"/>
      <line x1="24" y1="10" x2="24" y2="38" stroke="#22C55E" strokeWidth="1.5"/>
      <line x1="12" y1="24" x2="36" y2="24" stroke="#22C55E" strokeWidth="1.5"/>
      <path d="M14 12l4 4" stroke="#BBF7D0" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
    </svg>
  ),
  peinture: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#FDF2F8"/>
      <path d="M16 14h16v3H16z" fill="#EC4899" rx="1.5"/>
      <rect x="22" y="17" width="4" height="14" rx="1" fill="#F9A8D4"/>
      <path d="M19 31h10v5a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-5z" fill="#EC4899"/>
      <circle cx="32" cy="20" r="4" fill="#FDE68A"/>
      <circle cx="32" cy="20" r="2" fill="#F59E0B"/>
    </svg>
  ),
  menuiserie: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#FFFBEB"/>
      <path d="M12 34l4-4 16-16 4 4-16 16-4 4-4-4z" fill="#D97706"/>
      <path d="M12 34l4-4 2 2-4 4-2-2z" fill="#92400E"/>
      <rect x="30" y="10" width="6" height="3" rx="1" fill="#FCD34D" transform="rotate(45 30 10)"/>
      <path d="M28 16l4-4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="16" cy="34" r="2" fill="#FDE68A"/>
    </svg>
  ),
  autre: ({ size = 48 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#F8FAFC"/>
      <circle cx="24" cy="24" r="10" stroke="#94A3B8" strokeWidth="2" fill="none"/>
      <path d="M24 20v4l3 3" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="24" cy="32" r="1.5" fill="#94A3B8"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────
   Icônes SVG illustrées — Villes
───────────────────────────────────────── */
const CityIcon: React.FC<{ city: string; size?: number }> = ({ city, size = 48 }) => {
  const icons: Record<string, React.ReactNode> = {
    Paris: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#EFF6FF"/>
        <path d="M24 10l1.5 8h3l-2 3h1l-3 11H23L20 21h1l-2-3h3L24 10z" fill="#3B82F6"/>
        <rect x="17" y="35" width="14" height="2.5" rx="1" fill="#93C5FD"/>
      </svg>
    ),
    Marseille: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#EFF6FF"/>
        <path d="M24 32c-6 0-10-4-10-9 0-3 4-8 10-13 6 5 10 10 10 13 0 5-4 9-10 9z" fill="#3B82F6" opacity=".2"/>
        <path d="M20 26c0-2 2-5 4-8 2 3 4 6 4 8a4 4 0 0 1-8 0z" fill="#3B82F6"/>
        <path d="M14 28h20" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 32h28" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    Lyon: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#FFF7ED"/>
        <path d="M24 12l2 6h6l-5 4 2 6-5-3-5 3 2-6-5-4h6z" fill="#F97316"/>
      </svg>
    ),
    default: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#EFF6FF"/>
        <path d="M24 12c-4.4 0-8 3.6-8 8 0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8z" fill="#3B82F6"/>
        <circle cx="24" cy="20" r="3" fill="white"/>
      </svg>
    ),
  };
  return <>{icons[city] ?? icons.default}</>;
};

/* ─────────────────────────────────────────
   Config
───────────────────────────────────────── */
const SERVICE_META: Record<ServiceType, { bg: string; description: string }> = {
  plomberie:     { bg: '#EFF6FF', description: 'Fuites, robinets, canalisations...' },
  electricite:   { bg: '#FFFBEB', description: 'Pannes, installation, tableau...'   },
  serrurerie:    { bg: '#F5F3FF', description: 'Ouverture, remplacement, sécurité...' },
  chauffage:     { bg: '#FFF7ED', description: 'Chaudière, radiateurs, PAC...'      },
  climatisation: { bg: '#EFF6FF', description: 'Installation, entretien, dépannage...' },
  vitrerie:      { bg: '#F0FDF4', description: 'Vitres, fenêtres, stores...'        },
  peinture:      { bg: '#FDF2F8', description: 'Intérieur, extérieur, enduit...'    },
  menuiserie:    { bg: '#FFFBEB', description: 'Portes, parquet, meubles...'        },
  autre:         { bg: '#F8FAFC', description: 'Autre besoin, décrivez-nous...'     },
};

const POPULAR_CITIES = [
  'Paris','Marseille','Lyon','Toulouse','Nice',
  'Nantes','Montpellier','Strasbourg','Bordeaux','Lille',
  'Rennes','Reims','Saint-Étienne','Toulon','Grenoble',
  'Dijon','Angers','Nîmes','Villeurbanne','Clermont-Ferrand',
];

const CITY_REGION: Record<string, string> = {
  Paris:'Île-de-France', Marseille:'Provence-Alpes-Côte d\'Azur', Lyon:'Auvergne-Rhône-Alpes',
  Toulouse:'Occitanie', Nice:'Provence-Alpes-Côte d\'Azur', Nantes:'Pays de la Loire',
  Montpellier:'Occitanie', Strasbourg:'Grand Est', Bordeaux:'Nouvelle-Aquitaine',
  Lille:'Hauts-de-France', Rennes:'Bretagne', Reims:'Grand Est',
  'Saint-Étienne':'Auvergne-Rhône-Alpes', Toulon:'Provence-Alpes-Côte d\'Azur',
  Grenoble:'Auvergne-Rhône-Alpes', Dijon:'Bourgogne-Franche-Comté',
  Angers:'Pays de la Loire', Nîmes:'Occitanie',
  Villeurbanne:'Auvergne-Rhône-Alpes', 'Clermont-Ferrand':'Auvergne-Rhône-Alpes',
};

const popularServices: ServiceType[] = ['plomberie', 'electricite', 'serrurerie', 'chauffage'];

const TRUST_BADGES = [
  { icon: Shield, value: '100%',  label: 'Paiement sécurisé'      },
  { icon: Clock,  value: "<30'",  label: 'Temps de réponse'       },
  { icon: Star,   value: '4.8/5', label: 'Note moyenne'           },
  { icon: Users,  value: '10K+',  label: 'Interventions réussies' },
];

type ModalStep = 'none' | 'service' | 'city';

/* ─────────────────────────────────────────
   Composant principal
───────────────────────────────────────── */
const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | ''>('');
  const [selectedCity, setSelectedCity]       = useState('');
  const [modalStep, setModalStep]             = useState<ModalStep>('none');
  const [serviceSearch, setServiceSearch]     = useState('');
  const [citySearch, setCitySearch]           = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const serviceSearchRef = useRef<HTMLInputElement>(null);
  const citySearchRef    = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modalStep === 'service') setTimeout(() => serviceSearchRef.current?.focus(), 80);
    if (modalStep === 'city')    setTimeout(() => citySearchRef.current?.focus(), 80);
    document.body.style.overflow = modalStep !== 'none' ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalStep]);

  const closeModal    = ()               => { setModalStep('none'); setServiceSearch(''); setCitySearch(''); };
  const openService   = ()               => { setModalStep('service'); setServiceSearch(''); };
  const openCity      = ()               => { setModalStep('city'); setCitySearch(''); setCitySuggestions([]); };
  const selectService = (s: ServiceType) => { setSelectedService(s); setServiceSearch(''); setTimeout(() => setModalStep('city'), 120); };
  const selectCity    = (city: string)   => { setSelectedCity(city); closeModal(); };
  const clearService  = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedService(''); setSelectedCity(''); };
  const clearCity     = (e: React.MouseEvent) => { e.stopPropagation(); setSelectedCity(''); };

  const handleCitySearch = (value: string) => {
    setCitySearch(value);
    setCitySuggestions(value.trim() ? searchCities(value) : []);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set('category', selectedService);
    if (selectedCity)    params.set('city', selectedCity);
    navigate(`/services${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const allServices      = Object.keys(SERVICE_META) as ServiceType[];
  const filteredServices = serviceSearch.trim()
    ? allServices.filter(k => SERVICE_LABELS[k].toLowerCase().includes(serviceSearch.toLowerCase()))
    : allServices;
  const displayedCities  = citySearch.trim() ? citySuggestions : POPULAR_CITIES;
  const selectedMeta     = selectedService ? SERVICE_META[selectedService] : null;
  const SelectedSVG      = selectedService ? ServiceSVG[selectedService] : null;

  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Équipe FixIt" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/38" />
          <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/55 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-5" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}>
            Votre <span className="text-primary">dépannage</span><br />
            en un clic, <span className="text-primary">garanti.</span>
          </h1>

          <p className="text-base md:text-lg text-white/90 mb-10 max-w-xl leading-relaxed" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}>
            Des <strong className="text-white font-semibold">Helpers certifiés</strong> près de chez vous,
            disponibles <strong className="text-white font-semibold">7 jours/7</strong>.
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            La plateforme n°1 du dépannage en France
          </div>
          </p>

          {/* Barre de recherche */}
          <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 mb-5">

            {/* Champ Service */}
            <button type="button" onClick={openService}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                {SelectedSVG
                  ? <SelectedSVG size={36} />
                  : <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center"><Search className="w-4 h-4 text-gray-400" /></div>
                }
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider leading-none mb-0.5">Service</span>
                <span className={`text-sm font-medium truncate ${selectedService ? 'text-gray-800' : 'text-gray-400'}`}>
                  {selectedService ? SERVICE_LABELS[selectedService] : 'Quel service ?'}
                </span>
              </div>
              {selectedService
                ? <span onClick={clearService} className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 flex-shrink-0 cursor-pointer"><X className="w-3 h-3 text-gray-500" /></span>
                : <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
            </button>

            <div className="hidden sm:block w-px bg-gray-200 self-stretch my-1" />

            {/* Champ Ville */}
            {/* 
            <button type="button" onClick={openCity}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <div className="w-9 h-9 flex-shrink-0">
                {selectedCity
                  ? <CityIcon city={selectedCity} size={36} />
                  : <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-primary" /></div>
                }
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider leading-none mb-0.5">Localisation</span>
                <span className={`text-sm font-medium truncate ${selectedCity ? 'text-gray-800' : 'text-gray-400'}`}>
                  {selectedCity || 'Votre ville'}
                </span>
              </div>
              {selectedCity
                ? <span onClick={clearCity} className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 flex-shrink-0 cursor-pointer"><X className="w-3 h-3 text-gray-500" /></span>
                : <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
            </button>
*/}
            <button onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all flex-shrink-0 shadow-lg shadow-primary/30">
              Trouver un Helper <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chips populaires */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
            <span className="text-xs text-white/60 font-medium" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>Populaires :</span>
            {popularServices.map((service) => {
              const Ico    = ServiceSVG[service];
              const active = selectedService === service;
              return (
                <button key={service}
                  onClick={() => { setSelectedService(active ? '' : service); if (!active) openCity(); }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-all ${
                    active ? 'bg-primary border-primary text-white shadow-md shadow-primary/30' : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                  }`}>
                  <span className="w-5 h-5 flex items-center justify-center"><Ico size={20} /></span>
                  {SERVICE_LABELS[service]}
                </button>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center px-4 py-4 rounded-xl bg-white/12 backdrop-blur-md border border-white/20 shadow-sm">
                <badge.icon className="w-4 h-4 text-primary mb-2" />
                <span className="text-2xl font-extrabold text-white leading-none">{badge.value}</span>
                <span className="text-[11px] text-white/60 mt-1.5 leading-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── MODAL SERVICE ── */}
      {modalStep === 'service' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>

            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Choisir un service</h3>
                <p className="text-xs text-gray-400 mt-0.5">Sélectionnez votre besoin</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-primary/50 focus-within:bg-white transition-colors">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input ref={serviceSearchRef} type="text" placeholder="Quel service recherchez-vous ?"
                  value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-gray-700 placeholder:text-gray-400" />
                {serviceSearch && <button onClick={() => setServiceSearch('')}><X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" /></button>}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {filteredServices.length === 0
                ? <div className="px-5 py-10 text-center"><p className="text-sm text-gray-400">Aucun service trouvé</p></div>
                : filteredServices.map((key) => {
                  const Ico    = ServiceSVG[key];
                  const meta   = SERVICE_META[key];
                  const active = selectedService === key;
                  return (
                    <button key={key} onClick={() => selectService(key)}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-all group ${active ? 'bg-primary/5' : 'hover:bg-gray-50'}`}>
                      <div className="flex-shrink-0"><Ico size={48} /></div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-none ${active ? 'text-primary' : 'text-gray-800'}`}>{SERVICE_LABELS[key]}</p>
                        <p className="text-xs text-gray-400 mt-1 truncate">{meta.description}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'}`} />
                    </button>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL VILLE ── */}
      {modalStep === 'city' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>

            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
              <button onClick={() => setModalStep('service')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Choisir une ville</h3>
                {selectedService && (() => {
                  const IcoSmall = ServiceSVG[selectedService];
                  return (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                      <span className="inline-flex"><IcoSmall size={16} /></span>
                      {SERVICE_LABELS[selectedService]}
                    </p>
                  );
                })()}
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-primary/50 focus-within:bg-white transition-colors">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <input ref={citySearchRef} type="text" placeholder="Rechercher une ville..."
                  value={citySearch} onChange={(e) => handleCitySearch(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-gray-700 placeholder:text-gray-400" />
                {citySearch && <button onClick={() => { setCitySearch(''); setCitySuggestions([]); }}><X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" /></button>}
              </div>
            </div>

            <div className="px-5 py-2.5 bg-gray-50/80 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {citySearch.trim() ? 'Résultats de recherche' : 'Villes populaires'}
              </p>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
              {displayedCities.length === 0
                ? <div className="px-5 py-10 text-center"><p className="text-sm text-gray-400">Aucune ville trouvée</p></div>
                : displayedCities.map((city) => {
                  const active = selectedCity === city;
                  return (
                    <button key={city} onClick={() => selectCity(city)}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-all group ${active ? 'bg-primary/5' : 'hover:bg-gray-50'}`}>
                      <div className="flex-shrink-0"><CityIcon city={city} size={48} /></div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-none ${active ? 'text-primary' : 'text-gray-800'}`}>{city}</p>
                        <p className="text-xs text-gray-400 mt-1 truncate">{CITY_REGION[city] ?? 'France'}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${active ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'}`} />
                    </button>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;