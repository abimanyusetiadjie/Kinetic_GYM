export interface Club {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  currentCrowd: 'LOW' | 'MODERATE' | 'BUSY';
  currentOccupancyPct: number;
  openHours: string;
  facilities: string[];
  distanceKm: number;
  hourlyForecast: { hour: number; occupancyPct: number; isBestTime: boolean }[];
}

export const CLUBS_DATA: Club[] = [
  {
    id: 'cl_1',
    name: 'KINETIC Sudirman SCBD',
    slug: 'sudirman-scbd',
    city: 'Jakarta Pusat',
    address: 'Equity Tower Lt. 3, Jl. Jend. Sudirman Kav 52-53',
    currentCrowd: 'BUSY',
    currentOccupancyPct: 82,
    openHours: '24 Jam (Non-Stop)',
    facilities: ['Sauna', 'Smart Locker', 'Studio Pilates', 'Free Weights', 'Cycling Room', 'Cafe'],
    distanceKm: 0.8,
    hourlyForecast: [
      { hour: 6, occupancyPct: 40, isBestTime: false },
      { hour: 8, occupancyPct: 70, isBestTime: false },
      { hour: 11, occupancyPct: 45, isBestTime: false },
      { hour: 14, occupancyPct: 25, isBestTime: true },
      { hour: 15, occupancyPct: 28, isBestTime: true },
      { hour: 18, occupancyPct: 85, isBestTime: false },
      { hour: 20, occupancyPct: 65, isBestTime: false },
      { hour: 22, occupancyPct: 30, isBestTime: true },
    ],
  },
  {
    id: 'cl_2',
    name: 'KINETIC Senopati Lounge',
    slug: 'senopati-lounge',
    city: 'Jakarta Selatan',
    address: 'Jl. Senopati No. 78, Kebayoran Baru',
    currentCrowd: 'LOW',
    currentOccupancyPct: 28,
    openHours: '06:00 - 23:00',
    facilities: ['Sauna', 'Hot Shower', 'Smart Locker', 'Free Weights', 'Functional Area'],
    distanceKm: 1.4,
    hourlyForecast: [
      { hour: 6, occupancyPct: 35, isBestTime: true },
      { hour: 9, occupancyPct: 55, isBestTime: false },
      { hour: 12, occupancyPct: 40, isBestTime: false },
      { hour: 14, occupancyPct: 20, isBestTime: true },
      { hour: 17, occupancyPct: 60, isBestTime: false },
      { hour: 19, occupancyPct: 75, isBestTime: false },
      { hour: 21, occupancyPct: 35, isBestTime: true },
    ],
  },
  {
    id: 'cl_3',
    name: 'KINETIC Kuningan Mega',
    slug: 'kuningan-mega',
    city: 'Jakarta Selatan',
    address: 'Mall Ambassador Lt. 5, Jl. Prof. DR. Satrio',
    currentCrowd: 'MODERATE',
    currentOccupancyPct: 54,
    openHours: '06:00 - 22:00',
    facilities: ['Shower', 'Smart Locker', 'Studio 1', 'Cycling Studio', 'Free Weights'],
    distanceKm: 2.1,
    hourlyForecast: [
      { hour: 6, occupancyPct: 30, isBestTime: true },
      { hour: 12, occupancyPct: 65, isBestTime: false },
      { hour: 15, occupancyPct: 35, isBestTime: true },
      { hour: 18, occupancyPct: 80, isBestTime: false },
      { hour: 20, occupancyPct: 50, isBestTime: false },
    ],
  },
  {
    id: 'cl_4',
    name: 'KINETIC Bandung Dago',
    slug: 'bandung-dago',
    city: 'Bandung',
    address: 'Jl. Ir. H. Juanda No. 120, Coblong',
    currentCrowd: 'LOW',
    currentOccupancyPct: 32,
    openHours: '24 Jam',
    facilities: ['Sauna', 'Cold Plunge', 'Smart Locker', 'Free Weights', 'Studio Yoga'],
    distanceKm: 142.0,
    hourlyForecast: [
      { hour: 7, occupancyPct: 25, isBestTime: true },
      { hour: 10, occupancyPct: 40, isBestTime: false },
      { hour: 14, occupancyPct: 22, isBestTime: true },
      { hour: 18, occupancyPct: 65, isBestTime: false },
    ],
  },
  {
    id: 'cl_5',
    name: 'KINETIC Surabaya Pakuwon',
    slug: 'surabaya-pakuwon',
    city: 'Surabaya',
    address: 'Pakuwon Mall Lt. 2, Jl. Mayjend. Jonosewojo No. 2',
    currentCrowd: 'MODERATE',
    currentOccupancyPct: 58,
    openHours: '06:00 - 22:00',
    facilities: ['Shower', 'Studio Pilates', 'Free Weights', 'Cycling Room', 'Parking'],
    distanceKm: 780.0,
    hourlyForecast: [
      { hour: 8, occupancyPct: 35, isBestTime: true },
      { hour: 13, occupancyPct: 30, isBestTime: true },
      { hour: 19, occupancyPct: 78, isBestTime: false },
    ],
  },
  {
    id: 'cl_6',
    name: 'KINETIC Bali Seminyak',
    slug: 'bali-seminyak',
    city: 'Bali',
    address: 'Jl. Kayu Aya No. 9, Seminyak, Kuta',
    currentCrowd: 'BUSY',
    currentOccupancyPct: 79,
    openHours: '24 Jam',
    facilities: ['Sauna', 'Ice Bath', 'Outdoor Area', 'Smoothie Bar', 'Free Weights'],
    distanceKm: 1150.0,
    hourlyForecast: [
      { hour: 7, occupancyPct: 50, isBestTime: false },
      { hour: 11, occupancyPct: 30, isBestTime: true },
      { hour: 15, occupancyPct: 40, isBestTime: true },
      { hour: 17, occupancyPct: 85, isBestTime: false },
    ],
  },
];

export interface StudioSpot {
  id: number;
  label: string;
  row: number;
  col: number;
  type: 'FRONT_ROW' | 'STANDARD' | 'CORNER_AC';
  isBooked: boolean;
  bookedByName?: string;
}

export interface ClassScheduleItem {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Dance' | 'Yoga' | 'Cycling' | 'Boxing';
  instructor: {
    name: string;
    photoInitial: string;
    rating: number;
  };
  time: string;
  durationMins: number;
  clubName: string;
  studioName: string;
  intensity: 'Beginner' | 'Intermediate' | 'Advanced';
  maxCapacity: number;
  bookedCount: number;
  spots: StudioSpot[];
}

export const CLASS_SCHEDULES_DATA: ClassScheduleItem[] = [
  {
    id: 'sch_1',
    name: 'Les Mills BodyPump',
    category: 'Strength',
    instructor: { name: 'Coach Sarah Jenkins', photoInitial: 'SJ', rating: 4.9 },
    time: '18:30 - 19:25',
    durationMins: 55,
    clubName: 'KINETIC Sudirman SCBD',
    studioName: 'Studio 1 (Barbell Zone)',
    intensity: 'Intermediate',
    maxCapacity: 12,
    bookedCount: 10,
    spots: [
      { id: 1, label: 'Mat A1', row: 1, col: 1, type: 'FRONT_ROW', isBooked: true },
      { id: 2, label: 'Mat A2', row: 1, col: 2, type: 'FRONT_ROW', isBooked: true },
      { id: 3, label: 'Mat A3', row: 1, col: 3, type: 'FRONT_ROW', isBooked: true },
      { id: 4, label: 'Mat A4', row: 1, col: 4, type: 'FRONT_ROW', isBooked: true },
      { id: 5, label: 'Mat B1', row: 2, col: 1, type: 'STANDARD', isBooked: true },
      { id: 6, label: 'Mat B2', row: 2, col: 2, type: 'STANDARD', isBooked: false },
      { id: 7, label: 'Mat B3', row: 2, col: 3, type: 'STANDARD', isBooked: true },
      { id: 8, label: 'Mat B4', row: 2, col: 4, type: 'STANDARD', isBooked: false },
      { id: 9, label: 'Mat C1', row: 3, col: 1, type: 'CORNER_AC', isBooked: true },
      { id: 10, label: 'Mat C2', row: 3, col: 2, type: 'STANDARD', isBooked: true },
      { id: 11, label: 'Mat C3', row: 3, col: 3, type: 'STANDARD', isBooked: true },
      { id: 12, label: 'Mat C4', row: 3, col: 4, type: 'CORNER_AC', isBooked: true },
    ],
  },
  {
    id: 'sch_2',
    name: 'RPM Glow Cycling',
    category: 'Cycling',
    instructor: { name: 'Coach Dimas Prasetyo', photoInitial: 'DP', rating: 4.8 },
    time: '19:30 - 20:15',
    durationMins: 45,
    clubName: 'KINETIC Sudirman SCBD',
    studioName: 'Cycling Cave (Surround Sound)',
    intensity: 'Advanced',
    maxCapacity: 8,
    bookedCount: 5,
    spots: [
      { id: 1, label: 'Bike #01', row: 1, col: 1, type: 'FRONT_ROW', isBooked: true },
      { id: 2, label: 'Bike #02', row: 1, col: 2, type: 'FRONT_ROW', isBooked: true },
      { id: 3, label: 'Bike #03', row: 1, col: 3, type: 'FRONT_ROW', isBooked: false },
      { id: 4, label: 'Bike #04', row: 1, col: 4, type: 'FRONT_ROW', isBooked: false },
      { id: 5, label: 'Bike #05', row: 2, col: 1, type: 'STANDARD', isBooked: true },
      { id: 6, label: 'Bike #06', row: 2, col: 2, type: 'STANDARD', isBooked: true },
      { id: 7, label: 'Bike #07', row: 2, col: 3, type: 'STANDARD', isBooked: false },
      { id: 8, label: 'Bike #08', row: 2, col: 4, type: 'CORNER_AC', isBooked: true },
    ],
  },
  {
    id: 'sch_3',
    name: 'Vinyasa Flow Yoga',
    category: 'Yoga',
    instructor: { name: 'Coach Ayu Lestari', photoInitial: 'AL', rating: 5.0 },
    time: '07:30 - 08:30',
    durationMins: 60,
    clubName: 'KINETIC Senopati Lounge',
    studioName: 'Zen Sanctuary Studio',
    intensity: 'Beginner',
    maxCapacity: 10,
    bookedCount: 6,
    spots: [
      { id: 1, label: 'Mat Zen 1', row: 1, col: 1, type: 'FRONT_ROW', isBooked: true },
      { id: 2, label: 'Mat Zen 2', row: 1, col: 2, type: 'FRONT_ROW', isBooked: true },
      { id: 3, label: 'Mat Zen 3', row: 1, col: 3, type: 'FRONT_ROW', isBooked: false },
      { id: 4, label: 'Mat Zen 4', row: 2, col: 1, type: 'STANDARD', isBooked: true },
      { id: 5, label: 'Mat Zen 5', row: 2, col: 2, type: 'STANDARD', isBooked: false },
      { id: 6, label: 'Mat Zen 6', row: 2, col: 3, type: 'STANDARD', isBooked: true },
      { id: 7, label: 'Mat Zen 7', row: 3, col: 1, type: 'STANDARD', isBooked: false },
      { id: 8, label: 'Mat Zen 8', row: 3, col: 2, type: 'CORNER_AC', isBooked: true },
      { id: 9, label: 'Mat Zen 9', row: 3, col: 3, type: 'CORNER_AC', isBooked: false },
      { id: 10, label: 'Mat Zen 10', row: 3, col: 4, type: 'STANDARD', isBooked: true },
    ],
  },
];

export interface TrainerProfile {
  id: string;
  name: string;
  title: string;
  homeClub: string;
  rating: number;
  reviewsCount: number;
  completedSessions: number;
  hourlyRate: number;
  specializations: string[];
  certifications: string[];
  imageUrl?: string;
  introVideoDescription: string;
  bio: string;
  reviews: {
    userName: string;
    rating: number;
    text: string;
    verifiedSessions: number;
    date: string;
  }[];
}

export const TRAINERS_DATA: TrainerProfile[] = [
  {
    id: 'tr_1',
    name: 'Coach Sarah Jenkins, CSCS',
    title: 'Certified Strength & Hypertrophy Specialist',
    homeClub: 'KINETIC Sudirman SCBD',
    rating: 4.9,
    reviewsCount: 42,
    completedSessions: 380,
    hourlyRate: 350000,
    specializations: ['Body Recomposition', 'Hypertrophy', 'Posture Correction', 'Fat Loss'],
    certifications: ['NSCA-CSCS', 'NASM Certified Personal Trainer', 'Precision Nutrition L1'],
    imageUrl: '/images/trainer-sarah.jpg',
    introVideoDescription: 'Fokus pada teknik angkat beban terperiodisasi tanpa cedera. 0% rayuan sales, 100% hasil.',
    bio: 'Berpengalaman 7+ tahun melatih profesional sibuk mencapai komposisi tubuh optimal dengan pola latihan berbasis data.',
    reviews: [
      {
        userName: 'Budi Santoso',
        rating: 5,
        text: 'Coach Sarah sangat teliti form angkat beban saya. Turun 6kg fat dalam 8 minggu tanpa drama.',
        verifiedSessions: 24,
        date: '12 Agt 2026',
      },
      {
        userName: 'Jessica Tania',
        rating: 5,
        text: 'Tidak pernah dipaksa beli suplemen atau sesi tambahan. Sangat profesional dan menyenangkan!',
        verifiedSessions: 16,
        date: '02 Agt 2026',
      },
    ],
  },
  {
    id: 'tr_2',
    name: 'Coach Dimas Prasetyo',
    title: 'Athletic Conditioning & Mobility Coach',
    homeClub: 'KINETIC Senopati Lounge',
    rating: 4.8,
    reviewsCount: 35,
    completedSessions: 290,
    hourlyRate: 300000,
    specializations: ['Functional HIIT', 'Cardio Endurance', 'Boxing', 'Mobility'],
    certifications: ['ACE Certified Trainer', 'TRX Suspension Master', 'Animal Flow L1'],
    imageUrl: '/images/trainer-david.jpg',
    introVideoDescription: 'Latihan fungsional untuk stamina tinggi dan kelincahan atletis.',
    bio: 'Mantan atlet taekwondo nasional yang berdedikasi membangun stamina dan mobilitas fungsional sehari-hari.',
    reviews: [
      {
        userName: 'Raditya Putra',
        rating: 5,
        text: 'Sesi latihan cardio dan mobility-nya gila, tapi sangat nagih. Stamina lari 10K saya membaik drastis.',
        verifiedSessions: 12,
        date: '28 Jul 2026',
      },
    ],
  },
  {
    id: 'tr_3',
    name: 'Coach Ayu Lestari',
    title: 'Mind-Body & Reformer Pilates Specialist',
    homeClub: 'KINETIC Kuningan Mega',
    rating: 5.0,
    reviewsCount: 58,
    completedSessions: 510,
    hourlyRate: 320000,
    specializations: ['Reformer Pilates', 'Spine Alignment', 'Prenatal Fitness', 'Flexibility'],
    certifications: ['STOTT Pilates Certified', 'Yoga Alliance RYT-500', 'Polestar Pilates'],
    imageUrl: 'https://i.pravatar.cc/300?img=47',
    introVideoDescription: 'Memperbaiki postur duduk kerja bungkuk dan menguatkan core stabilitas.',
    bio: 'Spesialis rehabilitasi postur dan penguatan core otot dalam untuk mencegah nyeri pinggang pekerja kantoran.',
    reviews: [
      {
        userName: 'Nadia Permata',
        rating: 5,
        text: 'Nyeri punggung bawah akibat duduk kantor 9 jam hilang setelah 6 sesi latihan bareng Coach Ayu.',
        verifiedSessions: 32,
        date: '10 Agt 2026',
      },
    ],
  },
];
