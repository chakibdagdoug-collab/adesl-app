import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import { 
  Home, 
  MapPin, 
  Calendar, 
  Trophy, 
  User, 
  Bell, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  CreditCard, 
  Globe, 
  Heart, 
  Info, 
  Phone, 
  Mail, 
  HelpCircle, 
  Share2, 
  Star, 
  X,
  Zap,
  Activity,
  Play,
} from 'lucide-react';

type Language = 'fr' | 'ar';
type Screen = 'splash' | 'onboarding' | 'home' | 'activities' | 'facilities' | 'facilityDetail' | 'reservation' | 'success' | 'myReservations' | 'events' | 'eventDetail' | 'news' | 'profile' | 'favorites' | 'notifications' | 'about' | 'faq' | 'contact';

interface Facility {
  id: string;
  name: string;
  location: string;
  sport: string;
  type: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  lighting: boolean;
  vestiaires: boolean;
  parking: boolean;
  status: string;
  description: string;
}

interface Sport {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: string;
  desc: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  teams: string;
  image: string;
  description: string;
}

interface Reservation {
  id: string;
  facilityName: string;
  sport: string;
  date: string;
  time: string;
  price: string;
  status: 'CONFIRMÉE' | 'ANNULÉE';
  location: string;
  qr: string;
}

interface NotificationItem {
  id: string;
  title: string;
  text: string;
  date: string;
  unread: boolean;
}

type Navigate = (screen: Screen) => void;
type ButtonHandler = () => void;

// --- ADESL RUNNER LOGO VECTOR SVG (Matches image_14cb87.png) ---
const AdeslLogo = ({ className = "w-10 h-10", color = "#C8F000" }) => (
  <svg className={`adesl-logo ${className}`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Dynamic Motion Trails */}
    <path d="M 35,165 A 80,80 0 0,1 115,85" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.4" />
    <path d="M 20,150 A 95,95 0 0,1 115,55" stroke={color} strokeWidth="11" strokeLinecap="round" opacity="0.7" />
    <path d="M 10,135 A 110,110 0 0,1 115,25" stroke={color} strokeWidth="12" strokeLinecap="round" />
    
    {/* Runner Silhouette */}
    <g fill={color}>
      {/* Head */}
      <circle cx="142" cy="46" r="13" />
      {/* Torso & Arms in sprint posture */}
      <path d="M 115 78 C 122 68, 136 60, 148 62 C 158 64, 163 72, 155 82 C 145 95, 128 115, 120 128 L 102 110 C 112 98, 122 88, 115 78 Z" />
      {/* Arms */}
      <path d="M 124 72 L 102 88 L 94 78 L 118 62 Z" />
      <path d="M 148 68 L 168 82 L 158 92 L 142 78 Z" />
      {/* Legs */}
      <path d="M 120 122 L 148 152 L 128 162 L 108 132 Z" />
      <path d="M 112 128 L 78 168 L 72 160 L 98 120 Z" />
    </g>
  </svg>
);

// --- MOCK DATA FOR ACTIVITIES (Matches image_1ec0c6.jpg) ---
const SPORTS_DATA: Sport[] = [
  { 
    id: 'football', 
    name: 'Football', 
    icon: '⚽', 
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600', 
    count: '8 Terrains',
    desc: 'Le football est un sport d\'équipe qui se joue avec un ballon sphérique entre deux équipes de onze joueurs chacune.'
  },
  { 
    id: 'basketball', 
    name: 'Basketball', 
    icon: '🏀', 
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600', 
    count: '4 Terrains',
    desc: 'Le basketball est un sport de balle où deux équipes de cinq joueurs s\'affrontent pour marquer des paniers.'
  },
  { 
    id: 'handball', 
    name: 'Handball', 
    icon: '🤾', 
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=600', 
    count: '2 Terrains',
    desc: 'Le handball est un sport d\'équipe où deux équipes s\'affrontent pour marquer des buts en lançant un ballon dans le but adverse.'
  },
  { 
    id: 'volleyball', 
    name: 'Volleyball', 
    icon: '🏐', 
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=600', 
    count: '3 Terrains',
    desc: 'Le volleyball est un sport d\'équipe dans lequel deux équipes s\'affrontent sur un terrain divisé par un filet.'
  },
  { 
    id: 'petanque', 
    name: 'Pétanque', 
    icon: '🎯', 
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=600', 
    count: '6 Pistes',
    desc: 'La pétanque est un jeu de boules où les joueurs lancent des boules métalliques vers un cochonnet.'
  },
  { 
    id: 'arts', 
    name: 'Arts Martiaux', 
    icon: '🥋', 
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600', 
    count: '2 Salles',
    desc: 'Les Arts Martiaux englobent une grande variété de styles et d\'écoles avec leurs propres techniques et principes.'
  },
  { 
    id: 'surfing', 
    name: 'Surfing', 
    icon: '🏄‍♂️', 
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600', 
    count: 'Espace Nautique',
    desc: 'Le surf est un sport nautique où les participants se tiennent debout sur des planches spéciales et glissent sur les vagues.'
  }
];

const FACILITIES_DATA: Facility[] = [
  {
    id: 'f1',
    name: 'Terrain Synthétique Sidi Bernoussi',
    location: 'Sidi Bernoussi, Casablanca',
    sport: 'Football',
    type: 'Gazon Synthétique High-Tech',
    price: 150,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
    lighting: true,
    vestiaires: true,
    parking: true,
    status: 'Disponible aujourd\'hui',
    description: 'Terrain de proximité en gazon synthétique de dernière génération, équipé d\'un éclairage LED haute intensité pour les matchs en soirée.'
  },
  {
    id: 'f2',
    name: 'Complexe Omnisport Sidi Moumen',
    location: 'Sidi Moumen, Casablanca',
    sport: 'Basketball',
    type: 'Parquet Réglementaire',
    price: 120,
    rating: 4.8,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=800',
    lighting: true,
    vestiaires: true,
    parking: true,
    status: 'Disponible aujourd\'hui',
    description: 'Terrain de basketball moderne avec paniers suspendus professionnels et gradins pour spectateurs.'
  },
  {
    id: 'f3',
    name: 'Espace Jeunesse Bernoussi 2',
    location: 'Sidi Bernoussi, Casablanca',
    sport: 'Handball',
    type: 'Revêtement Souple Premium',
    price: 130,
    rating: 4.7,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&q=80&w=800',
    lighting: true,
    vestiaires: false,
    parking: true,
    status: 'Réservations ouvertes',
    description: 'Espace idéal pour le handball et le futsal, conçu selon les normes de sécurité de l\'ADESL.'
  },
  {
    id: 'f4',
    name: 'Terrain Beach-Volley Sidi Moumen',
    location: 'Sidi Moumen, Casablanca',
    sport: 'Volleyball',
    type: 'Sable Fin Sécurisé',
    price: 100,
    rating: 4.6,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800',
    lighting: false,
    vestiaires: true,
    parking: true,
    status: 'Disponible aujourd\'hui',
    description: 'Piste de Volleyball sur sable, idéale pour les matchs estivaux et les entraînements d\'équipe.'
  }
];

const EVENTS_DATA: EventItem[] = [
  {
    id: 'e1',
    title: 'Tournoi de Football U17',
    date: '18 SEPTEMBRE 2026',
    time: '14:00 - 19:00',
    location: 'Sidi Bernoussi',
    category: 'Jeunesse',
    teams: '16 Équipes',
    image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=600',
    description: 'Grand tournoi inter-quartiers pour les jeunes de moins de 17 ans. Inscriptions ouvertes aux clubs et associations locales.'
  },
  {
    id: 'e2',
    title: 'Championnat Régional de Volleyball',
    date: '25 SEPTEMBRE 2026',
    time: '10:00 - 18:00',
    location: 'Sidi Moumen',
    category: 'Tournois',
    teams: '8 Équipes',
    image: 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=600',
    description: 'Compétition féminine et masculine réunissant les meilleurs talents sportifs de la préfecture.'
  },
  {
    id: 'e3',
    title: 'Stage d\'Initiation Enfants & Familles',
    date: '02 OCTOBRE 2026',
    time: '09:00 - 12:00',
    location: 'Sidi Bernoussi',
    category: 'Formations',
    teams: 'Tous Niveaux',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=600',
    description: 'Ateliers gratuits encadrés par des coachs diplômés pour découvrir le basketball, les arts martiaux et l\'athlétisme.'
  }
];

const NEWS_DATA = [
  {
    id: 'n1',
    title: 'ADESL inaugure 2 nouveaux terrains synthétiques',
    date: '02 Septembre 2026',
    summary: 'Extension des infrastructures sportives à Sidi Bernoussi pour répondre à la demande croissante de la jeunesse locale.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'n2',
    title: 'Les espaces sportifs au cœur de l’inclusion des quartiers',
    date: '28 Août 2026',
    summary: 'Retour sur le bilan annuel des initiatives d’animation sportive et d’intégration par le sport dans le district.',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=600'
  }
];

export default function App() {
  // Navigation & State
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedFacility, setSelectedFacility] = useState(FACILITIES_DATA[0]);
  const [selectedEvent, setSelectedEvent] = useState(EVENTS_DATA[0]);
  const [language, setLanguage] = useState<Language>('fr');
  const [favorites, setFavorites] = useState(['f1']);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Booking State
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingSport, setBookingSport] = useState('Football');
  const [bookingFacility, setBookingFacility] = useState(FACILITIES_DATA[0]);
  const [bookingDate, setBookingDate] = useState('SAM 12 SEPT');
  const [bookingTime, setBookingTime] = useState('19:00');
  
  // User Reservations State
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'ADESL-2026-001258',
      facilityName: 'Terrain Synthétique Sidi Bernoussi',
      sport: 'Football',
      date: 'Samedi 12 Septembre 2026',
      time: '19:00 – 20:00',
      price: '150 MAD',
      status: 'CONFIRMÉE',
      location: 'Sidi Bernoussi, Casablanca',
      qr: 'ADESL-2026-001258-VALID'
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Réservation confirmée !', text: 'Votre terrain à Sidi Bernoussi est prêt pour le 12 Septembre.', date: 'Il y a 10 min', unread: true },
    { id: '2', title: 'Rappel de match', text: 'Votre session de football commence dans 2 heures.', date: 'Hier', unread: true },
    { id: '3', title: 'Nouveau Tournoi U17', text: 'Inscriptions ouvertes pour la Coupe ADESL 2026.', date: '3 jours', unread: false }
  ]);

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const toggleFavorite = (facilityId: string) => {
    if (favorites.includes(facilityId)) {
      setFavorites(favorites.filter(id => id !== facilityId));
    } else {
      setFavorites([...favorites, facilityId]);
    }
  };

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen w-full bg-[#F5F7F4] text-slate-900 font-sans antialiased">
      <div className={`adesl-app-shell w-full min-h-screen bg-[#F5F7F4] overflow-hidden relative flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
        
        <div className="bg-[#022C27] px-4 py-3 flex items-center justify-between text-xs text-emerald-100/80 z-50 select-none moroccan-pattern">
          <div className="flex items-center gap-2">
            <AdeslLogo className="w-7 h-7" color="#C8F000" />
            <div><span className="block font-black tracking-wide text-white">ADESL</span><span className="block text-[9px] text-emerald-200/70">SPORT & LOISIRS</span></div>
          </div>
          <button onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')} aria-label="Changer de langue" className="flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-900 px-3 py-1.5 rounded-full text-[10px] text-[#C8F000] font-bold border border-[#C8F000]/30 transition"><Globe size={12} /><span>{language === 'fr' ? 'العربية' : 'Français'}</span></button>
        </div>

        {/* MAIN INTERFACE SCREEN SWITCHER */}
        <div className="adesl-screen-container flex-1 overflow-y-auto relative bg-[#F5F7F4] text-[#10231F] scrollbar-none">
          
          {/* SCREEN 1: SPLASH SCREEN */}
          {currentScreen === 'splash' && (
            <div className="h-full bg-[#022C27] text-white flex flex-col justify-between p-8 items-center text-center animate-fadeIn">
              <div className="my-auto flex flex-col items-center">
                {/* Official ADESL Logo Render */}
                <div className="adesl-splash-logo w-28 h-28 bg-[#063B32] border-2 border-[#C8F000] rounded-3xl flex items-center justify-center shadow-2xl mb-6 relative overflow-hidden p-3">
                  <AdeslLogo className="w-full h-full" color="#C8F000" />
                </div>

                <h1 className="text-3xl font-black tracking-wider text-white">ADESL</h1>
                <p className="text-[10px] text-emerald-300 tracking-widest mt-1 uppercase font-extrabold max-w-[200px] leading-tight">
                  Association de Développement des Espaces Sportifs et Loisirs
                </p>
                <p className="text-xs text-emerald-400/90 mt-2 font-semibold">Sidi Bernoussi – Sidi Moumen</p>
                
                <div className="mt-8 space-y-2">
                  <h2 className="text-lg font-black text-[#C8F000] leading-tight">
                    {language === 'ar' ? 'الرياضة تبدأ بالقرب منكم' : 'LE SPORT COMMENCE PRÈS DE CHEZ VOUS.'}
                  </h2>
                  <p className="text-xs text-emerald-200/80">
                    {language === 'ar' ? 'فضاءات رياضية للقرب' : 'Espaces sportifs de proximité'}
                  </p>
                </div>
              </div>

              <div className="mb-6 flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-[#C8F000] border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-[10px] text-emerald-300/60 uppercase tracking-widest">Chargement...</span>
              </div>
            </div>
          )}

          {/* SCREEN 2: ONBOARDING */}
          {currentScreen === 'onboarding' && (
            <OnboardingView 
              language={language}
              onComplete={() => setCurrentScreen('home')} 
            />
          )}

          {/* SCREEN 3: HOME DASHBOARD */}
          {currentScreen === 'home' && (
            <HomeDashboard 
              language={language}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectFacility={(fac) => { setSelectedFacility(fac); setCurrentScreen('facilityDetail'); }}
              onSelectSport={() => setCurrentScreen('activities')}
              onSelectEvent={(evt) => { setSelectedEvent(evt); setCurrentScreen('eventDetail'); }}
              onOpenVideo={() => setShowVideoModal(true)}
              unreadCount={notifications.filter(n => n.unread).length}
            />
          )}

          {/* ACTIVITIES PAGE (Matches image_1ec0c6.jpg) */}
          {currentScreen === 'activities' && (
            <ActivitiesView 
              onStartBooking={(sportName) => {
                setBookingSport(sportName);
                setBookingStep(1);
                setCurrentScreen('reservation');
              }}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {/* SCREEN 4 & 5: FACILITIES DIRECTORY */}
          {currentScreen === 'facilities' && (
            <FacilitiesDirectory 
              language={language}
              favorites={favorites}
              onToggleFav={toggleFavorite}
              onSelectFacility={(fac) => { setSelectedFacility(fac); setCurrentScreen('facilityDetail'); }}
              onStartBooking={(fac) => {
                setBookingFacility(fac);
                setBookingStep(1);
                setCurrentScreen('reservation');
              }}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {/* SCREEN 6: FACILITY DETAIL VIEW */}
          {currentScreen === 'facilityDetail' && (
            <FacilityDetailView 
              facility={selectedFacility}
              language={language}
              isFav={favorites.includes(selectedFacility.id)}
              onToggleFav={() => toggleFavorite(selectedFacility.id)}
              onBook={() => {
                setBookingFacility(selectedFacility);
                setBookingStep(1);
                setCurrentScreen('reservation');
              }}
              onBack={() => setCurrentScreen('facilities')}
            />
          )}

          {/* SCREEN 7, 8, 9: MULTI-STEP RESERVATION & CMI PAYMENT */}
          {currentScreen === 'reservation' && (
            <ReservationFlow 
              language={language}
              step={bookingStep}
              setStep={setBookingStep}
              facility={bookingFacility}
              sport={bookingSport}
              setSport={setBookingSport}
              date={bookingDate}
              setDate={setBookingDate}
              time={bookingTime}
              setTime={setBookingTime}
              onCompleteBooking={() => {
                const newRes = {
                  id: `ADESL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
                  facilityName: bookingFacility.name,
                  sport: bookingSport,
                  date: `${bookingDate} 2026`,
                  time: `${bookingTime} – ${parseInt(bookingTime) + 1}:00`,
                  price: `${bookingFacility.price} MAD`,
                  status: 'CONFIRMÉE' as const,
                  location: bookingFacility.location,
                  qr: `ADESL-CONFIRMED-${Date.now()}`
                };
                setReservations([newRes, ...reservations]);
                setCurrentScreen('success');
              }}
              onBack={() => {
                if (bookingStep > 1) setBookingStep(bookingStep - 1);
                else setCurrentScreen('home');
              }}
            />
          )}

          {/* SCREEN 10: SUCCESS TICKET CONFIRMATION */}
          {currentScreen === 'success' && (
            <SuccessView 
              language={language}
              reservation={reservations[0]}
              onViewReservations={() => setCurrentScreen('myReservations')}
              onHome={() => setCurrentScreen('home')}
            />
          )}

          {/* SCREEN 11 & 12: MY RESERVATIONS */}
          {currentScreen === 'myReservations' && (
            <MyReservationsView 
              language={language}
              reservations={reservations}
              onCancel={(id: string) => {
                setReservations(reservations.map(r => r.id === id ? { ...r, status: 'ANNULÉE' } : r));
              }}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {/* SCREEN 13 & 14: EVENTS */}
          {currentScreen === 'events' && (
            <EventsView 
              language={language}
              events={EVENTS_DATA}
              onSelectEvent={(evt) => { setSelectedEvent(evt); setCurrentScreen('eventDetail'); }}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'eventDetail' && (
            <EventDetailView 
              event={selectedEvent}
              isRegistered={registeredEvents.includes(selectedEvent.id)}
              onRegister={() => {
                if (!registeredEvents.includes(selectedEvent.id)) {
                  setRegisteredEvents([...registeredEvents, selectedEvent.id]);
                }
              }}
              onBack={() => setCurrentScreen('events')}
            />
          )}

          {/* SCREEN 15: NEWS */}
          {currentScreen === 'news' && (
            <NewsView 
              language={language}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {/* SCREEN 16+: PROFILE & AUXILIARY */}
          {currentScreen === 'profile' && (
            <ProfileView 
              language={language}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onLanguageToggle={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
            />
          )}

          {currentScreen === 'favorites' && (
            <FavoritesView 
              language={language}
              favorites={FACILITIES_DATA.filter(f => favorites.includes(f.id))}
              onSelect={(fac) => { setSelectedFacility(fac); setCurrentScreen('facilityDetail'); }}
              onBack={() => setCurrentScreen('profile')}
            />
          )}

          {currentScreen === 'notifications' && (
            <NotificationsView 
              language={language}
              notifications={notifications}
              onMarkAllRead={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'about' && (
            <AboutView 
              onBack={() => setCurrentScreen('profile')}
            />
          )}

          {currentScreen === 'faq' && (
            <FAQView 
              onBack={() => setCurrentScreen('profile')}
            />
          )}

          {currentScreen === 'contact' && (
            <ContactView 
              onBack={() => setCurrentScreen('profile')}
            />
          )}

        </div>

        {/* PROMO VIDEO MODAL (From website image_1ec129.jpg) */}
        {showVideoModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#022C27] text-white p-5 rounded-3xl w-full space-y-4 border border-emerald-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <AdeslLogo className="w-6 h-6" color="#C8F000" />
                  <span className="text-xs font-black text-white">ADESL en Vidéo</span>
                </div>
                <button onClick={() => setShowVideoModal(false)} className="p-1.5 bg-emerald-900 rounded-full">
                  <X size={16} />
                </button>
              </div>

              <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-emerald-800/60">
                <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60" />
                <div className="absolute w-14 h-14 bg-[#C8F000] text-[#022C27] rounded-full flex items-center justify-center shadow-2xl animate-pulse cursor-pointer">
                  <Play size={24} className="fill-[#022C27] ml-1" />
                </div>
              </div>

              <p className="text-xs text-emerald-200/80 text-center leading-relaxed">
                Présentation officielle de la gestion inclusive des espaces sportifs de la préfecture des arrondissements de Sidi Bernoussi.
              </p>
            </div>
          </div>
        )}

        {/* PERSISTENT MOBILE BOTTOM NAVIGATION BAR */}
        {!['splash', 'onboarding'].includes(currentScreen) && (
          <div className="bg-[#022C27] border-t border-emerald-900/60 px-2 py-2 flex justify-around items-center z-40 text-xs shadow-2xl">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-xl transition ${currentScreen === 'home' ? 'text-[#C8F000]' : 'text-emerald-300/60 hover:text-emerald-100'}`}
            >
              <Home size={20} />
              <span className="text-[10px] font-medium">{language === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('facilities')}
              className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-xl transition ${['facilities', 'facilityDetail'].includes(currentScreen) ? 'text-[#C8F000]' : 'text-emerald-300/60 hover:text-emerald-100'}`}
            >
              <MapPin size={20} />
              <span className="text-[10px] font-medium">{language === 'ar' ? 'الملاعب' : 'Terrains'}</span>
            </button>

            {/* Floating Central Accent Button for Main Reservation Trigger */}
            <button 
              onClick={() => {
                setBookingStep(1);
                setCurrentScreen('reservation');
              }}
              className="relative -top-4 bg-[#C8F000] text-[#022C27] p-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all border-4 border-[#022C27]"
            >
              <Calendar size={22} className="stroke-[2.5]" />
            </button>

            <button 
              onClick={() => setCurrentScreen('events')}
              className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-xl transition ${['events', 'eventDetail'].includes(currentScreen) ? 'text-[#C8F000]' : 'text-emerald-300/60 hover:text-emerald-100'}`}
            >
              <Trophy size={20} />
              <span className="text-[10px] font-medium">{language === 'ar' ? 'الأحداث' : 'Événements'}</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center space-y-1 py-1 px-2 rounded-xl transition ${['profile', 'favorites', 'about', 'faq', 'contact'].includes(currentScreen) ? 'text-[#C8F000]' : 'text-emerald-300/60 hover:text-emerald-100'}`}
            >
              <User size={20} />
              <span className="text-[10px] font-medium">{language === 'ar' ? 'حسابي' : 'Profil'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 1: ONBOARDING FLOW
// ==========================================
interface OnboardingProps {
  onComplete: ButtonHandler;
  language: Language;
}

function OnboardingView({ onComplete, language }: OnboardingProps) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: language === 'ar' ? 'الرياضة بالقرب منكم' : 'Le sport près de chez vous',
      subtitle: language === 'ar' ? 'اكتشفوا الفضاءات الرياضية الحديثة في سيدي البرنوصي وسيدي مومن.' : 'Infrastructures sportives modernes gérées par l’ADESL pour la jeunesse de Sidi Bernoussi.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: language === 'ar' ? 'حجز سهل وسريع' : 'Réservez simplement',
      subtitle: language === 'ar' ? 'احجز ملعبك المفضل بضعة نقرات واقضِ وقتاً ممتعاً مع فريقك.' : 'Choisissez votre terrain, sélectionnez le créneau idéal et recevez votre ticket QR instantané.',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: language === 'ar' ? 'شارك في الحياة الرياضية' : 'Participez à la vie sportive',
      subtitle: language === 'ar' ? 'دوريات، أنشطة وفعاليات موجهة للشباب والعائلات طوال السنة.' : 'Rejoignez les tournois inter-quartiers et encouragez la dynamique sportive locale.',
      image: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="h-full bg-[#022C27] text-white flex flex-col justify-between p-6 relative">
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <AdeslLogo className="w-6 h-6" color="#C8F000" />
          <span className="text-xs text-[#C8F000] font-bold tracking-widest uppercase">ADESL MOBILE</span>
        </div>
        <button onClick={onComplete} className="text-xs text-emerald-300 hover:text-white font-medium">
          {language === 'ar' ? 'تخطي' : 'Passer'}
        </button>
      </div>

      <div className="my-auto space-y-6 text-center">
        <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-2xl border border-emerald-800/50">
          <img 
            src={slides[slide].image} 
            alt="Onboarding" 
            className="w-full h-full object-cover transition-all duration-500 transform hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C27] via-transparent to-transparent"></div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white leading-tight">
            {slides[slide].title}
          </h2>
          <p className="text-xs text-emerald-200/80 leading-relaxed max-w-xs mx-auto">
            {slides[slide].subtitle}
          </p>
        </div>
      </div>

      <div className="space-y-6 mb-4">
        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-[#C8F000]' : 'w-2 bg-emerald-800'}`}
            />
          ))}
        </div>

        <button 
          onClick={() => {
            if (slide < slides.length - 1) setSlide(slide + 1);
            else onComplete();
          }}
          className="w-full py-4 bg-[#C8F000] text-[#022C27] font-bold text-sm rounded-2xl shadow-xl hover:bg-lime-300 active:scale-98 transition flex items-center justify-center space-x-2 rtl:space-x-reverse"
        >
          <span>{slide === slides.length - 1 ? (language === 'ar' ? 'ابدأ الآن' : 'Commencer') : (language === 'ar' ? 'التالي' : 'Suivant')}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 2: HOME DASHBOARD (AUTHENTIC WEBSITE CONTENT)
// ==========================================
interface HomeDashboardProps {
  onNavigate: Navigate;
  onSelectFacility: (facility: Facility) => void;
  onSelectSport: (sportId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onOpenVideo: ButtonHandler;
  unreadCount: number;
  language: Language;
}

function HomeDashboard({ onNavigate, onSelectFacility, onSelectSport, onSelectEvent, onOpenVideo, unreadCount, language }: HomeDashboardProps) {
  return (
    <div className="pb-10 space-y-6">
      
      {/* Header Bar */}
      <div className="bg-[#022C27] text-white p-6 pb-8 rounded-b-[32px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#063B32] rounded-full blur-2xl opacity-40"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-11 h-11 bg-[#063B32] border border-[#C8F000]/40 rounded-2xl flex items-center justify-center p-1.5 shadow-md">
              <AdeslLogo className="w-full h-full" color="#C8F000" />
            </div>
            <div>
              <span className="text-[10px] text-[#C8F000] font-bold uppercase tracking-wider">ADESL CASABLANCA</span>
              <h1 className="text-xl font-black leading-tight">
                {language === 'ar' ? 'مرحباً 👋' : 'Bonjour 👋'}
              </h1>
              <p className="text-[11px] text-emerald-200/80 flex items-center mt-0.5">
                <MapPin size={11} className="mr-1 text-[#C8F000] rtl:ml-1 rtl:mr-0" />
                Sidi Bernoussi – Sidi Moumen
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button 
              onClick={() => onNavigate('notifications')}
              className="relative p-2.5 bg-[#063B32] rounded-2xl border border-emerald-800/60 hover:bg-emerald-900 transition"
            >
              <Bell size={18} className="text-emerald-100" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8F000] rounded-full"></span>
              )}
            </button>

            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-2xl bg-[#C8F000] text-[#022C27] font-bold flex items-center justify-center text-sm shadow-md"
            >
              AE
            </button>
          </div>
        </div>

        {/* HERO CARD (EXACT CONTENT FROM WEBSITE image_1ec129.jpg) */}
        <div className="mt-6 bg-gradient-to-br from-[#063B32] to-[#022C27] p-5 rounded-3xl border border-emerald-700/40 relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-3">
            <span className="text-[9px] bg-[#C8F000] text-[#022C27] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {language === 'ar' ? 'الموقع الرسمي' : 'OFFICIEL ADESL'}
            </span>

            <h2 className="text-base font-black text-white leading-snug">
              {language === 'ar' ? 'التدبير الشامل للفضاءات الرياضية بعمالة مقاطعات سيدي البرنوصي' : 'La gestion inclusive des espaces sportifs de la préfecture des arrondissements de Sidi Bernoussi'}
            </h2>

            <p className="text-xs text-emerald-200/90 leading-relaxed">
              {language === 'ar' ? 'استعدوا لعيش لحظات رياضية مميزة عبر نظام الحجز المباشر.' : 'Préparez-vous à vivre des moments intenses avec notre système de réservation en ligne.'}
            </p>

            {/* Video Play Button Feature */}
            <div className="pt-1 flex items-center space-x-3 rtl:space-x-reverse">
              <button 
                onClick={() => onNavigate('reservation')}
                className="flex-1 py-3 bg-[#C8F000] text-[#022C27] font-black text-xs rounded-xl shadow-md hover:bg-lime-300 transition flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
              >
                <Calendar size={15} />
                <span>{language === 'ar' ? 'احجز الآن' : 'Réserver maintenant'}</span>
              </button>

              <button 
                onClick={onOpenVideo}
                className="p-3 bg-[#022C27] text-[#C8F000] border border-[#C8F000]/40 rounded-xl hover:bg-emerald-900 transition flex items-center justify-center shadow-md"
              >
                <Play size={16} className="fill-[#C8F000]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL PARTNERS BANNER (From image_1ec129.jpg) */}
      <div className="px-5">
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-center">
          <div className="flex-1 pr-2 border-r border-slate-100 rtl:border-l rtl:border-r-0">
            <span className="text-[9px] font-extrabold text-[#063B32] uppercase block">المبادرة الوطنية للتنمية البشرية</span>
            <span className="text-[8px] text-slate-400">INDH Casablanca</span>
          </div>
          <div className="flex-1 pl-2">
            <span className="text-[9px] font-extrabold text-[#063B32] uppercase block">عمالة مقاطعات سيدي البرنوصي</span>
            <span className="text-[8px] text-slate-400">Préfecture Sidi Bernoussi</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="px-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          {language === 'ar' ? 'ماذا تريد أن تفعل؟' : 'Que souhaitez-vous faire ?'}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: language === 'ar' ? 'حجز' : 'Réserver', icon: Calendar, screen: 'reservation', color: 'bg-emerald-100 text-emerald-900' },
            { label: language === 'ar' ? 'الأنشطة' : 'Activités', icon: Activity, screen: 'activities', color: 'bg-lime-100 text-lime-900' },
            { label: language === 'ar' ? 'ملاعب' : 'Terrains', icon: MapPin, screen: 'facilities', color: 'bg-amber-100 text-amber-900' },
            { label: language === 'ar' ? 'أحداث' : 'Événements', icon: Trophy, screen: 'events', color: 'bg-blue-100 text-blue-900' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigate(action.screen as Screen)}
                className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition active:scale-95"
              >
                <div className={`p-2.5 rounded-xl ${action.color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-bold text-slate-800">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* HORIZONTAL SPORTS CAROUSEL */}
      <div className="px-5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            {language === 'ar' ? 'الأنشطة الرياضية' : 'Nos activités'}
          </h3>
          <button onClick={() => onNavigate('activities')} className="text-xs text-[#063B32] font-bold hover:underline">
            {language === 'ar' ? 'عرض الكل' : 'Voir tout'}
          </button>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none rtl:space-x-reverse">
          {SPORTS_DATA.map((sport) => (
            <div
              key={sport.id}
              onClick={() => onSelectSport(sport.id)}
              className="flex-shrink-0 w-32 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/70 cursor-pointer hover:shadow-md transition group"
            >
              <div className="h-20 relative overflow-hidden">
                <img src={sport.image} alt={sport.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-xs">
                  {sport.icon}
                </div>
              </div>
              <div className="p-2.5 text-center">
                <h4 className="text-xs font-bold text-slate-900">{sport.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{sport.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED FACILITY */}
      <div className="px-5 space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
          {language === 'ar' ? 'فضاءات للاكتشاف' : 'Espaces à découvrir'}
        </h3>

        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200/80">
          <div className="relative h-44">
            <img src={FACILITIES_DATA[0].image} alt="Featured facility" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <span className="absolute top-3 left-3 bg-[#C8F000] text-[#022C27] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
              {FACILITIES_DATA[0].status}
            </span>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <h4 className="text-base font-extrabold">{FACILITIES_DATA[0].name}</h4>
              <p className="text-xs text-slate-200 flex items-center mt-1">
                <MapPin size={12} className="mr-1 text-[#C8F000] rtl:ml-1 rtl:mr-0" />
                {FACILITIES_DATA[0].location}
              </p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between bg-white">
            <div>
              <span className="text-xs text-slate-500">{language === 'ar' ? 'التعريفة' : 'Tarif'}</span>
              <p className="text-base font-black text-[#022C27]">150 MAD <span className="text-xs text-slate-500 font-normal">/ heure</span></p>
            </div>
            <button 
              onClick={() => onSelectFacility(FACILITIES_DATA[0])}
              className="px-4 py-2 bg-[#022C27] text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-900 transition"
            >
              {language === 'ar' ? 'تفاصيل الملعب' : 'Voir le terrain'}
            </button>
          </div>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="px-5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            {language === 'ar' ? 'الأحداث القادمة' : 'Prochains événements'}
          </h3>
          <button onClick={() => onNavigate('events')} className="text-xs text-[#063B32] font-bold hover:underline">
            {language === 'ar' ? 'عرض الكل' : 'Voir tous'}
          </button>
        </div>

        <div className="space-y-3">
          {EVENTS_DATA.map((event) => (
            <div 
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/80 flex items-center space-x-3 rtl:space-x-reverse cursor-pointer hover:border-emerald-700/50 transition"
            >
              <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-[#063B32] uppercase tracking-wider">{event.category}</span>
                <h4 className="text-xs font-bold text-slate-900 truncate">{event.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center">
                  <Calendar size={11} className="mr-1 text-slate-400 rtl:ml-1 rtl:mr-0" />
                  {event.date}
                </p>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* INSTITUTIONAL DEMO STATISTICS */}
      <div className="px-5">
        <div className="bg-[#022C27] text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
          <div className="text-center space-y-1">
            <span className="text-[10px] text-[#C8F000] font-bold uppercase tracking-widest">ADESL EN CHIFFRES</span>
            <h4 className="text-base font-extrabold">{language === 'ar' ? 'تأثير الرياضة في المنطقة' : 'L’impact du sport de proximité'}</h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-[#063B32] p-3 rounded-2xl border border-emerald-800/40">
              <p className="text-2xl font-black text-[#C8F000]">15+</p>
              <p className="text-[10px] text-emerald-200 mt-0.5">{language === 'ar' ? 'فضاءات رياضية' : 'Espaces sportifs'}</p>
            </div>
            <div className="bg-[#063B32] p-3 rounded-2xl border border-emerald-800/40">
              <p className="text-2xl font-black text-[#C8F000]">8</p>
              <p className="text-[10px] text-emerald-200 mt-0.5">{language === 'ar' ? 'أنواع الرياضة' : 'Disciplines'}</p>
            </div>
            <div className="bg-[#063B32] p-3 rounded-2xl border border-emerald-800/40">
              <p className="text-2xl font-black text-[#C8F000]">25K+</p>
              <p className="text-[10px] text-emerald-200 mt-0.5">{language === 'ar' ? 'مستفيد' : 'Bénéficiaires'}</p>
            </div>
            <div className="bg-[#063B32] p-3 rounded-2xl border border-emerald-800/40">
              <p className="text-2xl font-black text-[#C8F000]">10K+</p>
              <p className="text-[10px] text-emerald-200 mt-0.5">{language === 'ar' ? 'حجز سنوياً' : 'Réservations'}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// ACTIVITIES DIRECTORY VIEW (Matches image_1ec0c6.jpg)
// ==========================================
interface ActivitiesProps {
  onStartBooking: (sportName: string) => void;
  onBack: ButtonHandler;
}

function ActivitiesView({ onStartBooking, onBack }: ActivitiesProps) {
  return (
    <div className="pb-12 space-y-5 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-[10px] text-[#C8F000] font-extrabold uppercase tracking-widest block">SÉLECTIONNEZ UNE ACTIVITÉ</span>
            <h1 className="text-base font-black leading-tight uppercase">
              EXPLOREZ LES ÉQUIPEMENTS DE NOS ESPACES SPORTIFS
            </h1>
          </div>
        </div>
      </div>

      {/* Sports Grid matching website screenshot */}
      <div className="px-5 space-y-4">
        {SPORTS_DATA.map((sport) => (
          <div key={sport.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
            {/* Top Photo with Sport Badge */}
            <div className="relative h-40">
              <img src={sport.image} alt={sport.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-white font-black text-xs">
                {sport.name}
              </div>
            </div>

            {/* Green Bottom Section */}
            <div className="p-4 bg-[#8CB028] text-white space-y-3">
              <p className="text-xs text-lime-50 leading-relaxed font-medium">
                {sport.desc}
              </p>

              <button 
                onClick={() => onStartBooking(sport.name)}
                className="px-4 py-2 bg-[#C8F000] text-[#022C27] text-xs font-black rounded-xl shadow-md hover:bg-lime-300 transition flex items-center space-x-1.5 rtl:space-x-reverse"
              >
                <Calendar size={13} />
                <span>Réserver</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 3: FACILITIES DIRECTORY
// ==========================================
interface FacilitiesProps {
  onSelectFacility: (facility: Facility) => void;
  onStartBooking: (facility: Facility) => void;
  favorites: string[];
  onToggleFav: (facilityId: string) => void;
  onBack: ButtonHandler;
  language: Language;
}

function FacilitiesDirectory({ onSelectFacility, onStartBooking, favorites, onToggleFav, onBack, language }: FacilitiesProps) {
  const [search, setSearch] = useState('');
  const [filterSport, setFilterSport] = useState('Tous');

  const filtered = FACILITIES_DATA.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase());
    const matchesSport = filterSport === 'Tous' || f.sport.toLowerCase() === filterSport.toLowerCase();
    return matchesSearch && matchesSport;
  });

  return (
    <div className="pb-10 space-y-4">
      {/* Header */}
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black">{language === 'ar' ? 'فضاءاتنا الرياضية' : 'Nos espaces'}</h1>
            <p className="text-xs text-emerald-200/80">{language === 'ar' ? 'الملاعب المتاحة للحجز' : 'Terrains et complexes à proximité'}</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400 rtl:right-3.5 rtl:left-auto" />
          <input 
            type="text" 
            placeholder={language === 'ar' ? 'بحث عن ملعب...' : 'Rechercher un terrain...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-slate-900 text-xs rounded-2xl pl-10 pr-4 py-3 border-0 focus:ring-2 focus:ring-[#C8F000] rtl:pr-10 rtl:pl-4"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex space-x-2 mt-3 overflow-x-auto scrollbar-none py-1 rtl:space-x-reverse">
          {['Tous', 'Football', 'Basketball', 'Handball', 'Volleyball'].map((chip) => (
            <button
              key={chip}
              onClick={() => setFilterSport(chip)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${filterSport === chip ? 'bg-[#C8F000] text-[#022C27]' : 'bg-[#063B32] text-emerald-200'}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities List */}
      <div className="px-5 space-y-4">
        {filtered.map((facility) => (
          <div key={facility.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80">
            <div className="relative h-40">
              <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => onToggleFav(facility.id)}
                className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white"
              >
                <Heart size={16} className={favorites.includes(facility.id) ? "fill-red-500 text-red-500" : ""} />
              </button>
              <span className="absolute bottom-3 left-3 bg-[#022C27] text-[#C8F000] text-[10px] font-bold px-2.5 py-1 rounded-full">
                {facility.sport}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black text-slate-900">{facility.name}</h3>
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star size={12} className="fill-amber-400 mr-1" />
                    {facility.rating}
                  </div>
                </div>
                <p className="text-xs text-slate-500 flex items-center mt-1">
                  <MapPin size={12} className="mr-1 text-emerald-700 rtl:ml-1 rtl:mr-0" />
                  {facility.location}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{language === 'ar' ? 'السعر' : 'Prix'}</span>
                  <p className="text-sm font-black text-[#022C27]">{facility.price} MAD <span className="text-[10px] font-normal text-slate-500">/h</span></p>
                </div>

                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button 
                    onClick={() => onSelectFacility(facility)}
                    className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                  >
                    {language === 'ar' ? 'تفاصيل' : 'Détails'}
                  </button>
                  <button 
                    onClick={() => onStartBooking(facility)}
                    className="px-4 py-2 bg-[#C8F000] text-[#022C27] text-xs font-extrabold rounded-xl shadow-md hover:bg-lime-300 transition"
                  >
                    {language === 'ar' ? 'حجز' : 'Réserver'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 4: FACILITY DETAIL VIEW
// ==========================================
interface FacilityDetailProps {
  facility: Facility;
  onBook: ButtonHandler;
  onBack: ButtonHandler;
  isFav: boolean;
  onToggleFav: ButtonHandler;
  language: Language;
}

function FacilityDetailView({ facility, onBook, onBack, isFav, onToggleFav, language }: FacilityDetailProps) {
  return (
    <div className="pb-24 bg-white min-h-full">
      {/* Image Banner */}
      <div className="relative h-64 bg-slate-900">
        <img src={facility.image} alt={facility.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button onClick={onBack} className="p-2.5 bg-black/50 backdrop-blur-md rounded-2xl text-white">
            <ArrowLeft size={18} />
          </button>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button onClick={onToggleFav} className="p-2.5 bg-black/50 backdrop-blur-md rounded-2xl text-white">
              <Heart size={18} className={isFav ? "fill-red-500 text-red-500" : ""} />
            </button>
            <button className="p-2.5 bg-black/50 backdrop-blur-md rounded-2xl text-white">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="bg-[#C8F000] text-[#022C27] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
            {facility.sport}
          </span>
          <h1 className="text-xl font-black mt-2 leading-tight">{facility.name}</h1>
          <p className="text-xs text-slate-200 flex items-center mt-1">
            <MapPin size={13} className="mr-1 text-[#C8F000] rtl:ml-1 rtl:mr-0" />
            {facility.location}
          </p>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 space-y-6">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ar' ? 'نوع الأرضية' : 'Revêtement'}</span>
            <p className="text-xs font-extrabold text-slate-800">{facility.type}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ar' ? 'التقييم' : 'Évaluation'}</span>
            <p className="text-xs font-extrabold text-amber-600 flex items-center justify-end">
              <Star size={12} className="fill-amber-400 mr-1" />
              {facility.rating} ({facility.reviews})
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400">{language === 'ar' ? 'حول الملعب' : 'À propos'}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{facility.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400">{language === 'ar' ? 'التجهيزات' : 'Équipements'}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold">
              <Zap size={15} className="text-emerald-700" />
              <span>{language === 'ar' ? 'إنارة nocturne' : 'Éclairage nocturne'}</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold">
              <ShieldCheck size={15} className="text-emerald-700" />
              <span>{language === 'ar' ? 'حراسة وأمن' : 'Espace sécurisé'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-slate-400">{language === 'ar' ? 'أوقات العمل' : 'Horaires'}</h3>
          <p className="text-xs text-slate-800 font-semibold bg-slate-100 p-3 rounded-xl flex justify-between">
            <span>{language === 'ar' ? 'الإثنين - الأحد' : 'Lundi à Dimanche'}</span>
            <span className="text-emerald-800">08:00 – 23:00</span>
          </p>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex items-center justify-between max-w-[412px] mx-auto z-30">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ar' ? 'السعر الكلي' : 'Tarif horaire'}</span>
          <p className="text-lg font-black text-[#022C27]">{facility.price} MAD <span className="text-xs text-slate-500 font-normal">/h</span></p>
        </div>

        <button 
          onClick={onBook}
          className="px-6 py-3.5 bg-[#C8F000] text-[#022C27] font-black text-xs rounded-2xl shadow-lg hover:bg-lime-300 transition"
        >
          {language === 'ar' ? 'حجز هذا الملعب' : 'RÉSERVER CE TERRAIN'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 5: RESERVATION FLOW
// ==========================================
interface ReservationFlowProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  facility: Facility;
  sport: string;
  setSport: Dispatch<SetStateAction<string>>;
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
  time: string;
  setTime: Dispatch<SetStateAction<string>>;
  onCompleteBooking: ButtonHandler;
  onBack: ButtonHandler;
  language: Language;
}

function ReservationFlow({ step, setStep, facility, sport, setSport, date, setDate, time, setTime, onCompleteBooking, onBack, language }: ReservationFlowProps) {
  
  const dates = [
    { label: 'VEN 11', value: 'VEN 11 SEPT' },
    { label: 'SAM 12', value: 'SAM 12 SEPT' },
    { label: 'DIM 13', value: 'DIM 13 SEPT' },
    { label: 'LUN 14', value: 'LUN 14 SEPT' },
  ];

  const slots = [
    { hour: '17:00', available: true },
    { hour: '18:00', available: true },
    { hour: '19:00', available: true },
    { hour: '20:00', available: false },
    { hour: '21:00', available: true },
    { hour: '22:00', available: false },
  ];

  return (
    <div className="pb-12 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black">{language === 'ar' ? 'حجز ملعب' : 'Réserver un terrain'}</h1>
            <p className="text-xs text-emerald-200/80">{language === 'ar' ? 'خطوة ' + step + ' من 4' : `Étape ${step} sur 4`}</p>
          </div>
        </div>

        <div className="flex space-x-1.5 rtl:space-x-reverse">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-[#C8F000]' : 'bg-emerald-900/60'}`}
            />
          ))}
        </div>
      </div>

      <div className="p-5 space-y-6">

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">1. Choisir l’activité</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Football', 'Basketball', 'Handball', 'Volleyball', 'Surfing'].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSport(sp)}
                  className={`p-4 rounded-2xl border text-left font-bold text-xs transition flex flex-col justify-between h-20 ${sport === sp ? 'bg-[#022C27] text-white border-[#022C27]' : 'bg-white text-slate-800 border-slate-200'}`}
                >
                  <span className="text-lg">{sp === 'Football' ? '⚽' : sp === 'Basketball' ? '🏀' : sp === 'Handball' ? '🤾' : sp === 'Volleyball' ? '🏐' : '🏄‍♂️'}</span>
                  <span>{sp}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-4 bg-[#C8F000] text-[#022C27] font-black text-xs rounded-2xl shadow-md mt-6"
            >
              {language === 'ar' ? 'متابعة' : 'CONTINUER'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">2. Choisir la date</h2>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDate(d.value)}
                    className={`py-3 rounded-2xl border text-center font-bold text-xs transition ${date === d.value ? 'bg-[#022C27] text-[#C8F000] border-[#022C27]' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">3. Choisir l’heure</h2>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((s) => (
                  <button
                    key={s.hour}
                    disabled={!s.available}
                    onClick={() => setTime(s.hour)}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${!s.available ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : time === s.hour ? 'bg-[#063B32] text-[#C8F000] border-[#063B32]' : 'bg-white text-slate-800 border-slate-200'}`}
                  >
                    <p className="text-sm">{s.hour}</p>
                    <span className="text-[9px] font-normal">{s.available ? (language === 'ar' ? 'متاح' : 'Disponible') : (language === 'ar' ? 'مكتمل' : 'Complet')}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setStep(3)}
              className="w-full py-4 bg-[#C8F000] text-[#022C27] font-black text-xs rounded-2xl shadow-md mt-6"
            >
              {language === 'ar' ? 'معاينة الملخص' : 'VOIR LE RÉSUMÉ'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Résumé de la réservation</h2>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
              <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-slate-100 pb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#063B32] text-[#C8F000] flex items-center justify-center font-bold text-lg">
                  ⚽
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{facility.name}</h3>
                  <p className="text-xs text-slate-500">{sport}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date</span>
                  <span className="font-bold text-slate-800">{date} 2026</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Horaire</span>
                  <span className="font-bold text-slate-800">{time} – {parseInt(time) + 1}:00 (1h)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Localisation</span>
                  <span className="font-bold text-slate-800">{facility.location}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-sm font-bold text-slate-900">Total à payer</span>
                  <span className="text-lg font-black text-[#022C27]">{facility.price} MAD</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(4)}
              className="w-full py-4 bg-[#C8F000] text-[#022C27] font-black text-xs rounded-2xl shadow-md"
            >
              {language === 'ar' ? 'الانتقال إلى الأداء' : 'PASSER AU PAIEMENT'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-[11px] font-medium flex items-center space-x-2 rtl:space-x-reverse">
              <Info size={16} className="text-amber-600 flex-shrink-0" />
              <span>DÉMO UI: Simulation du guichet de paiement sécurisé CMI Maroc.</span>
            </div>

            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Paiement sécurisé CMI</h2>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-sm">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Titulaire de la carte</label>
                <input 
                  type="text" 
                  defaultValue="AHMED EL AMRANI"
                  className="w-full p-3 bg-slate-50 rounded-xl text-xs border border-slate-200 font-medium" 
                />

                <label className="text-xs font-bold text-slate-700 block">Numéro de carte bancaire</label>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="4111 •••• •••• 8892"
                    className="w-full p-3 bg-slate-50 rounded-xl text-xs border border-slate-200 font-medium" 
                  />
                  <CreditCard size={18} className="absolute right-3 top-3 text-slate-400" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Expirations</label>
                    <input type="text" defaultValue="08/28" className="w-full p-3 bg-slate-50 rounded-xl text-xs border border-slate-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">CVV</label>
                    <input type="text" defaultValue="312" className="w-full p-3 bg-slate-50 rounded-xl text-xs border border-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={onCompleteBooking}
              className="w-full py-4 bg-[#022C27] text-[#C8F000] font-black text-xs rounded-2xl shadow-xl hover:bg-emerald-900 transition"
            >
              PAYER {facility.price} MAD
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 6: SUCCESS TICKET CONFIRMATION
// ==========================================
interface SuccessProps {
  reservation: Reservation;
  onViewReservations: ButtonHandler;
  onHome: ButtonHandler;
  language: Language;
}

function SuccessView({ reservation, onViewReservations, onHome, language }: SuccessProps) {
  return (
    <div className="p-6 bg-[#022C27] min-h-full text-white flex flex-col justify-between text-center animate-fadeIn">
      <div className="my-auto space-y-6">
        
        <div className="w-20 h-20 bg-[#C8F000] text-[#022C27] rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
          <CheckCircle2 size={48} className="stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-[#C8F000] font-extrabold uppercase tracking-widest">Confirmation ADESL</span>
          <h1 className="text-2xl font-black text-white">{language === 'ar' ? 'تم تأكيد الحجز !' : 'RÉSERVATION CONFIRMÉE'}</h1>
          <p className="text-xs text-emerald-200/80">{language === 'ar' ? 'ملعبكم جاهز للاستخدام' : 'Votre billet QR Code est prêt pour l’accès'}</p>
        </div>

        <div className="bg-white text-slate-900 p-5 rounded-3xl shadow-2xl space-y-4 text-left rtl:text-right">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase">N° Réservation</span>
              <p className="text-xs font-black text-slate-900">{reservation.id}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {reservation.status}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">{reservation.facilityName}</h3>
            <p className="text-xs text-slate-500">{reservation.date} • {reservation.time}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-300">
            <QrCode size={120} className="text-slate-800" />
            <span className="text-[9px] text-slate-400 font-mono mt-2">{reservation.qr}</span>
          </div>
        </div>

      </div>

      <div className="space-y-2 mt-4">
        <button 
          onClick={onViewReservations}
          className="w-full py-4 bg-[#C8F000] text-[#022C27] font-black text-xs rounded-2xl shadow-lg"
        >
          {language === 'ar' ? 'عرض تذكرتي' : 'VOIR MA RÉSERVATION'}
        </button>
        <button 
          onClick={onHome}
          className="w-full py-3 text-emerald-300 text-xs font-bold hover:text-white"
        >
          {language === 'ar' ? 'العودة للرئيسية' : 'Retour à l’accueil'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 7: MY RESERVATIONS VIEW
// ==========================================
interface MyReservationsProps {
  reservations: Reservation[];
  onCancel: (id: string) => void;
  onBack: ButtonHandler;
  language: Language;
}

function MyReservationsView({ reservations, onCancel, onBack, language }: MyReservationsProps) {
  const [tab, setTab] = useState('upcoming');

  return (
    <div className="pb-10 space-y-4 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black">{language === 'ar' ? 'حجوزاتي' : 'Mes réservations'}</h1>
            <p className="text-xs text-emerald-200/80">{language === 'ar' ? 'تذاكر الدخول للملاعب' : 'Billets d’accès et historique'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 bg-[#063B32] p-1 rounded-2xl">
          <button 
            onClick={() => setTab('upcoming')}
            className={`py-2 text-xs font-bold rounded-xl transition ${tab === 'upcoming' ? 'bg-[#C8F000] text-[#022C27]' : 'text-emerald-200'}`}
          >
            {language === 'ar' ? 'القادمة' : 'À venir'}
          </button>
          <button 
            onClick={() => setTab('history')}
            className={`py-2 text-xs font-bold rounded-xl transition ${tab === 'history' ? 'bg-[#C8F000] text-[#022C27]' : 'text-emerald-200'}`}
          >
            {language === 'ar' ? 'الأرشيف' : 'Historique'}
          </button>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${res.status === 'CONFIRMÉE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {res.status}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{res.id}</span>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{res.facilityName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{res.sport} • {res.location}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Heure</span>
                <span className="font-bold text-slate-800">{res.date} ({res.time})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Montant</span>
                <span className="font-bold text-emerald-800">{res.price}</span>
              </div>
            </div>

            <div className="flex space-x-2 rtl:space-x-reverse pt-1">
              {res.status === 'CONFIRMÉE' && (
                <button 
                  onClick={() => onCancel(res.id)}
                  className="flex-1 py-2.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl hover:bg-red-100"
                >
                  {language === 'ar' ? 'إلغاء الحجز' : 'Annuler'}
                </button>
              )}
              <button className="flex-1 py-2.5 bg-[#022C27] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1 rtl:space-x-reverse">
                <QrCode size={14} />
                <span>{language === 'ar' ? 'عرض التذكرة' : 'Billet QR'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 8: EVENTS & EVENT DETAIL
// ==========================================
interface EventsProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onBack: ButtonHandler;
  language: Language;
}

function EventsView({ events, onSelectEvent, onBack, language }: EventsProps) {
  return (
    <div className="pb-10 space-y-4 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black">{language === 'ar' ? 'الأحداث الرياضية' : 'Événements ADESL'}</h1>
            <p className="text-xs text-emerald-200/80">{language === 'ar' ? 'الدوريات والأنشطة الشبابية' : 'Tournois et programmes d’animation'}</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {events.map((evt) => (
          <div 
            key={evt.id} 
            onClick={() => onSelectEvent(evt)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 cursor-pointer hover:shadow-md transition"
          >
            <div className="relative h-40">
              <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-[#022C27] text-[#C8F000] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                {evt.category}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-black text-slate-900">{evt.title}</h3>
              <p className="text-xs text-slate-500 flex items-center">
                <Calendar size={12} className="mr-1 text-emerald-700 rtl:ml-1 rtl:mr-0" />
                {evt.date} • {evt.location}
              </p>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] font-bold text-emerald-800">{evt.teams}</span>
                <span className="text-xs font-bold text-[#022C27] flex items-center">
                  <span>Détails</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface EventDetailProps {
  event: EventItem;
  isRegistered: boolean;
  onRegister: ButtonHandler;
  onBack: ButtonHandler;
}

function EventDetailView({ event, isRegistered, onRegister, onBack }: EventDetailProps) {
  return (
    <div className="pb-20 bg-white min-h-full">
      <div className="relative h-60 bg-slate-900">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <button onClick={onBack} className="absolute top-4 left-4 p-2.5 bg-black/50 rounded-2xl text-white">
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
            {event.category}
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-2">{event.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{event.date} | {event.location}</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
          <h3 className="text-xs font-bold uppercase text-slate-400">Informations</h3>
          <p className="text-xs text-slate-700 leading-relaxed">{event.description}</p>
        </div>

        <button 
          onClick={onRegister}
          disabled={isRegistered}
          className={`w-full py-4 text-xs font-black rounded-2xl shadow-lg transition ${isRegistered ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed' : 'bg-[#C8F000] text-[#022C27]'}`}
        >
          {isRegistered ? 'DÉJÀ INSCRIT' : 'S’INSCRIRE À L’ÉVÉNEMENT'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 9: NEWS VIEW
// ==========================================
interface NewsProps {
  onBack: ButtonHandler;
  language: Language;
}

function NewsView({ onBack, language }: NewsProps) {
  return (
    <div className="pb-10 space-y-4 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black">{language === 'ar' ? 'الأخبار والأنشطة' : 'Actualités ADESL'}</h1>
            <p className="text-xs text-emerald-200/80">Communiqués et vie associative</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {NEWS_DATA.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <img src={item.image} alt={item.title} className="w-full h-36 rounded-2xl object-cover" />
            <span className="text-[10px] text-slate-400 font-bold">{item.date}</span>
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{item.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT 10: USER PROFILE & AUXILIARY PAGES
// ==========================================
interface ProfileProps {
  onNavigate: Navigate;
  onLanguageToggle: ButtonHandler;
  language: Language;
}

function ProfileView({ onNavigate, onLanguageToggle, language }: ProfileProps) {
  return (
    <div className="pb-10 space-y-6 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-6 rounded-b-3xl text-center space-y-3 shadow-lg">
        <div className="w-20 h-20 bg-[#C8F000] text-[#022C27] text-2xl font-black rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          AE
        </div>
        <div>
          <h2 className="text-lg font-black">Ahmed El Amrani</h2>
          <p className="text-xs text-emerald-200/80">ahmed.amrani@example.ma</p>
        </div>
      </div>

      <div className="px-5 space-y-3">
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200/80 space-y-1">
          {[
            { label: language === 'ar' ? 'حجوزاتي' : 'Mes réservations', icon: Calendar, screen: 'myReservations' },
            { label: language === 'ar' ? 'المفضلة' : 'Espaces favoris', icon: Heart, screen: 'favorites' },
            { label: language === 'ar' ? 'الإشعارات' : 'Notifications', icon: Bell, screen: 'notifications' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button 
                key={i}
                onClick={() => onNavigate(item.screen as Screen)}
                className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition text-xs font-bold text-slate-800"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon size={16} className="text-[#063B32]" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200/80 space-y-1">
          {[
            { label: language === 'ar' ? 'عن جمعية ADESL' : 'À propos d’ADESL', icon: Info, screen: 'about' },
            { label: language === 'ar' ? 'الأسئلة الشائعة' : 'Questions fréquentes (FAQ)', icon: HelpCircle, screen: 'faq' },
            { label: language === 'ar' ? 'اتصل بنا' : 'Contactez-nous', icon: Phone, screen: 'contact' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button 
                key={i}
                onClick={() => onNavigate(item.screen as Screen)}
                className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition text-xs font-bold text-slate-800"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon size={16} className="text-[#063B32]" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Globe size={18} className="text-[#063B32]" />
            <span className="text-xs font-bold text-slate-800">Langue / اللغة</span>
          </div>
          <button 
            onClick={onLanguageToggle}
            className="px-3 py-1.5 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl"
          >
            {language === 'fr' ? 'Français' : 'العربية'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FavoritesProps {
  favorites: Facility[];
  onSelect: (facility: Facility) => void;
  onBack: ButtonHandler;
  language: Language;
}

function FavoritesView({ favorites, onSelect, onBack, language }: FavoritesProps) {
  return (
    <div className="pb-10 space-y-4 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black">{language === 'ar' ? 'المفضلة' : 'Espaces favoris'}</h1>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {favorites.map((fac) => (
          <div key={fac.id} onClick={() => onSelect(fac)} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
            <img src={fac.image} alt={fac.name} className="w-16 h-16 rounded-2xl object-cover" />
            <div>
              <h3 className="text-xs font-bold text-slate-900">{fac.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{fac.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface NotificationsProps {
  notifications: NotificationItem[];
  onMarkAllRead: ButtonHandler;
  onBack: ButtonHandler;
  language: Language;
}

function NotificationsView({ notifications, onMarkAllRead, onBack, language }: NotificationsProps) {
  return (
    <div className="pb-10 space-y-4 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black">{language === 'ar' ? 'الإشعارات' : 'Notifications'}</h1>
        </div>
        <button onClick={onMarkAllRead} className="text-xs text-[#C8F000] font-bold">Tout lire</button>
      </div>

      <div className="px-5 space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={`p-4 rounded-2xl border ${n.unread ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200/80'} space-y-1`}>
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-slate-900">{n.title}</h4>
              <span className="text-[10px] text-slate-400">{n.date}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BackViewProps {
  onBack: ButtonHandler;
}

function AboutView({ onBack }: BackViewProps) {
  return (
    <div className="pb-10 space-y-6 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black">À propos d’ADESL</h1>
        </div>
      </div>

      <div className="px-5 space-y-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center space-x-3">
            <AdeslLogo className="w-8 h-8" color="#022C27" />
            <h2 className="text-sm font-black text-[#022C27]">Notre Mission</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            L’Association de Développement des Espaces Sportifs et Loisirs (ADESL) œuvrant à Casablanca (Sidi Bernoussi - Sidi Moumen) vise à moderniser la gestion des terrains de proximité et promouvoir la pratique sportive pour tous.
          </p>
        </div>

        <div className="bg-[#022C27] text-white p-5 rounded-3xl shadow-xl space-y-3">
          <h2 className="text-sm font-black text-[#C8F000]">Nos Engagements</h2>
          <ul className="text-xs text-emerald-200/90 space-y-2 list-disc pl-4">
            <li>Accessibilité pour la jeunesse et les familles</li>
            <li>Infrastructures sécurisées et entretenues</li>
            <li>Animation sportive continue et tournois d’intégration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FAQView({ onBack }: BackViewProps) {
  const faqs = [
    { q: "Comment réserver un terrain ?", a: "Accédez à l’onglet Réserver, choisissez la discipline, la date et le créneau horaire souhaité." },
    { q: "Comment annuler ma réservation ?", a: "Rendez-vous dans la rubrique Mes réservations depuis votre profil pour annuler avant le début de votre séance." },
    { q: "Les équipements sont-ils fournis ?", a: "Chaque espace est équipé selon les normes. Vous devez toutefois apporter vos ballons personnels." }
  ];

  return (
    <div className="pb-10 space-y-4 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black">Questions fréquentes</h1>
        </div>
      </div>

      <div className="px-5 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-black text-slate-900">{faq.q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactView({ onBack }: BackViewProps) {
  return (
    <div className="pb-10 space-y-4 bg-slate-50 min-h-full">
      <div className="bg-[#022C27] text-white p-5 rounded-b-3xl shadow-md">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <button onClick={onBack} className="p-2 bg-emerald-900/60 rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-black">Contactez-nous</h1>
        </div>
      </div>

      <div className="px-5 space-y-3">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs">
            <MapPin className="text-[#063B32]" size={18} />
            <div>
              <p className="font-bold text-slate-900">Adresse</p>
              <p className="text-slate-500">Sidi Bernoussi – Sidi Moumen, Casablanca</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs">
            <Phone className="text-[#063B32]" size={18} />
            <div>
              <p className="font-bold text-slate-900">Téléphone</p>
              <p className="text-slate-500">+212 522 00 00 00</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs">
            <Mail className="text-[#063B32]" size={18} />
            <div>
              <p className="font-bold text-slate-900">Email</p>
              <p className="text-slate-500">contact@adesl-bernoussi.ma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
