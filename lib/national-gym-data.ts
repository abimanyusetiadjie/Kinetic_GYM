export interface NationalClub {
  id: string;
  name: string;
  city: string;
  zone: string;
  address: string;
  crowdLevel: 'LOW' | 'MODERATE' | 'BUSY';
  capacityPct: number;
  openHours: string;
  facilities: string[];
  distanceKm: number;
}

export const INDONESIA_50_CLUBS: NationalClub[] = [
  // JABODETABEK (25 Cabang)
  { id: 'cl_jkt_01', name: 'KINETIC Sudirman SCBD', city: 'Jakarta Selatan', zone: 'DKI Jakarta', address: 'Pacific Century Place Lt. B1, SCBD Lot 10, Jl. Jend. Sudirman', crowdLevel: 'MODERATE', capacityPct: 54, openHours: '24 Jam (Non-Stop)', facilities: ['Sauna', 'Studio Pilates', 'Hot Shower', 'Free Weight Zone', 'Water Station', 'Smart Locker'], distanceKm: 0.8 },
  { id: 'cl_jkt_02', name: 'KINETIC Senopati Suites', city: 'Jakarta Selatan', zone: 'DKI Jakarta', address: 'Jl. Senopati No. 41, Kebayoran Baru', crowdLevel: 'LOW', capacityPct: 28, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower', 'Cafe & Shake Bar'], distanceKm: 1.4 },
  { id: 'cl_jkt_03', name: 'KINETIC Kuningan City', city: 'Jakarta Selatan', zone: 'DKI Jakarta', address: 'Kuningan City Mall Lt. 3, Jl. Prof. Dr. Satrio', crowdLevel: 'BUSY', capacityPct: 88, openHours: '24 Jam (Non-Stop)', facilities: ['Sauna', 'Boxing Ring', 'Hot Shower', 'Smart Locker'], distanceKm: 2.1 },
  { id: 'cl_jkt_04', name: 'KINETIC Kemang Icon', city: 'Jakarta Selatan', zone: 'DKI Jakarta', address: 'Jl. Kemang Raya No. 18, Bangka', crowdLevel: 'LOW', capacityPct: 32, openHours: '06:00 - 23:00', facilities: ['Studio Pilates', 'Functional Turf', 'Hot Shower', 'Parking'], distanceKm: 4.2 },
  { id: 'cl_jkt_05', name: 'KINETIC Kelapa Gading Mall', city: 'Jakarta Utara', zone: 'DKI Jakarta', address: 'Mall Kelapa Gading 3 Lt. 2, Jl. Boulevard Raya', crowdLevel: 'MODERATE', capacityPct: 62, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower', 'Valet Parking'], distanceKm: 8.5 },
  { id: 'cl_jkt_06', name: 'KINETIC PIK Avenue', city: 'Jakarta Utara', zone: 'DKI Jakarta', address: 'PIK Avenue Lt. 2, Pantai Indah Kapuk', crowdLevel: 'BUSY', capacityPct: 82, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Hot Shower', 'Studio Pilates', 'Smart Locker'], distanceKm: 12.1 },
  { id: 'cl_jkt_07', name: 'KINETIC Pondok Indah', city: 'Jakarta Selatan', zone: 'DKI Jakarta', address: 'Street Gallery PIM Lt. 2, Pondok Pinang', crowdLevel: 'MODERATE', capacityPct: 58, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower', 'Free Weight Zone'], distanceKm: 6.7 },
  { id: 'cl_jkt_08', name: 'KINETIC Central Park', city: 'Jakarta Barat', zone: 'DKI Jakarta', address: 'Central Park Mall Lt. LG, Jl. Letjen S. Parman', crowdLevel: 'BUSY', capacityPct: 85, openHours: '24 Jam (Non-Stop)', facilities: ['Sauna', 'Hot Shower', 'Smart Locker', 'Functional Turf'], distanceKm: 5.3 },
  { id: 'cl_jkt_09', name: 'KINETIC Puri Indah', city: 'Jakarta Barat', zone: 'DKI Jakarta', address: 'Puri Indah Mall Lt. 1, Kembangan Selatan', crowdLevel: 'LOW', capacityPct: 34, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Smart Locker', 'Free Weight Zone'], distanceKm: 9.1 },
  { id: 'cl_jkt_10', name: 'KINETIC Menteng HOS', city: 'Jakarta Pusat', zone: 'DKI Jakarta', address: 'Jl. H.O.S. Cokroaminoto No. 78, Menteng', crowdLevel: 'LOW', capacityPct: 22, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Hot Shower', 'Studio Pilates', 'Cafe'], distanceKm: 3.5 },
  { id: 'cl_tng_01', name: 'KINETIC BSD Green Office Park', city: 'Tangerang Selatan', zone: 'Banten', address: 'GOP 9 Ground Floor, BSD City, Serpong', crowdLevel: 'LOW', capacityPct: 31, openHours: '24 Jam (Non-Stop)', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower', 'Free Parking'], distanceKm: 18.0 },
  { id: 'cl_tng_02', name: 'KINETIC Bintaro Xchange', city: 'Tangerang Selatan', zone: 'Banten', address: 'Bintaro Jaya Xchange Mall 2 Lt. 1, Pondok Aren', crowdLevel: 'MODERATE', capacityPct: 65, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Hot Shower', 'Smart Locker'], distanceKm: 14.2 },
  { id: 'cl_tng_03', name: 'KINETIC Alam Sutera', city: 'Tangerang', zone: 'Banten', address: 'Mall @ Alam Sutera Lt. 2, Jl. Jalur Sutera Barat', crowdLevel: 'MODERATE', capacityPct: 52, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower'], distanceKm: 16.5 },
  { id: 'cl_tng_04', name: 'KINETIC Gading Serpong', city: 'Tangerang', zone: 'Banten', address: 'Summarecon Mall Serpong Lt. 2, Kelapa Dua', crowdLevel: 'BUSY', capacityPct: 79, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Functional Turf', 'Boxing Ring'], distanceKm: 19.4 },
  { id: 'cl_bks_01', name: 'KINETIC Summarecon Bekasi', city: 'Bekasi', zone: 'Jawa Barat', address: 'Summarecon Mall Bekasi Lt. 2, Jl. Bulevar Ahmad Yani', crowdLevel: 'MODERATE', capacityPct: 60, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Hot Shower', 'Smart Locker'], distanceKm: 17.5 },
  { id: 'cl_bks_02', name: 'KINETIC Harapan Indah', city: 'Bekasi', zone: 'Jawa Barat', address: 'Commercial Park 8 No. 12, Kota Harapan Indah', crowdLevel: 'LOW', capacityPct: 35, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Free Weight Zone'], distanceKm: 21.0 },
  { id: 'cl_dpk_01', name: 'KINETIC Margonda Raya', city: 'Depok', zone: 'Jawa Barat', address: 'Margo City Lt. 2, Jl. Margonda Raya No. 358', crowdLevel: 'BUSY', capacityPct: 86, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Hot Shower', 'Cycling Studio'], distanceKm: 16.0 },
  { id: 'cl_bgr_01', name: 'KINETIC Bogor Pajajaran', city: 'Bogor', zone: 'Jawa Barat', address: 'Jl. Raya Pajajaran No. 28, Babakan', crowdLevel: 'LOW', capacityPct: 29, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Sauna', 'Parking'], distanceKm: 38.0 },

  // JAWA BARAT - BANDUNG (6 Cabang)
  { id: 'cl_bdg_01', name: 'KINETIC Bandung Dago', city: 'Bandung', zone: 'Jawa Barat', address: 'Jl. Ir. H. Juanda No. 128, Dago', crowdLevel: 'MODERATE', capacityPct: 64, openHours: '24 Jam (Non-Stop)', facilities: ['Sauna', 'Studio Pilates', 'Hot Shower', 'Free Weight Zone'], distanceKm: 120.0 },
  { id: 'cl_bdg_02', name: 'KINETIC Paris Van Java', city: 'Bandung', zone: 'Jawa Barat', address: 'PVJ Mall Resort Level, Jl. Sukajadi No. 137', crowdLevel: 'BUSY', capacityPct: 81, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower'], distanceKm: 122.0 },
  { id: 'cl_bdg_03', name: 'KINETIC Buah Batu', city: 'Bandung', zone: 'Jawa Barat', address: 'Jl. Buah Batu No. 210, Cijagra', crowdLevel: 'LOW', capacityPct: 35, openHours: '06:00 - 23:00', facilities: ['Hot Shower', 'Free Weight Zone', 'Water Station'], distanceKm: 125.0 },
  { id: 'cl_bdg_04', name: 'KINETIC 23 Paskal', city: 'Bandung', zone: 'Jawa Barat', address: '23 Paskal Shopping Center Lt. 3, Jl. Pasir Kaliki', crowdLevel: 'MODERATE', capacityPct: 59, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Hot Shower', 'Smart Locker'], distanceKm: 121.0 },

  // JAWA TIMUR - SURABAYA & MALANG (8 Cabang)
  { id: 'cl_sby_01', name: 'KINETIC Surabaya HR Muhammad', city: 'Surabaya', zone: 'Jawa Timur', address: 'Jl. Mayjen HR. Muhammad No. 88, Pradahkalikendal', crowdLevel: 'MODERATE', capacityPct: 55, openHours: '24 Jam (Non-Stop)', facilities: ['Sauna', 'Hot Shower', 'Free Weight Zone', 'Smart Locker'], distanceKm: 680.0 },
  { id: 'cl_sby_02', name: 'KINETIC Pakuwon Mall', city: 'Surabaya', zone: 'Jawa Timur', address: 'Pakuwon Mall Lt. 1, Jl. Mayjend Jonosewojo', crowdLevel: 'BUSY', capacityPct: 87, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Studio Pilates', 'Hot Shower', 'Cycling Studio'], distanceKm: 682.0 },
  { id: 'cl_sby_03', name: 'KINETIC Tunjungan Plaza 6', city: 'Surabaya', zone: 'Jawa Timur', address: 'TP 6 Lt. 4, Jl. Embong Malang No. 32', crowdLevel: 'MODERATE', capacityPct: 68, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower'], distanceKm: 678.0 },
  { id: 'cl_sby_04', name: 'KINETIC Galaxy Mall 3', city: 'Surabaya', zone: 'Jawa Timur', address: 'Galaxy Mall 3 Lt. 2, Jl. Dharmahusada Indah Timur', crowdLevel: 'LOW', capacityPct: 38, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Free Weight Zone'], distanceKm: 685.0 },
  { id: 'cl_mlg_01', name: 'KINETIC Malang Ijen', city: 'Malang', zone: 'Jawa Timur', address: 'Jl. Besar Ijen No. 54, Oro-oro Dowo', crowdLevel: 'LOW', capacityPct: 30, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Sauna', 'Free Parking'], distanceKm: 740.0 },

  // BALI (4 Cabang)
  { id: 'cl_dps_01', name: 'KINETIC Bali Seminyak', city: 'Badung / Seminyak', zone: 'Bali', address: 'Jl. Kayu Aya No. 22B, Seminyak, Kuta', crowdLevel: 'BUSY', capacityPct: 89, openHours: '24 Jam (Non-Stop)', facilities: ['Sauna', 'Ice Bath', 'Outdoor Functional Turf', 'Hot Shower', 'Shake Bar'], distanceKm: 980.0 },
  { id: 'cl_dps_02', name: 'KINETIC Bali Canggu', city: 'Badung / Canggu', zone: 'Bali', address: 'Jl. Pantai Batu Bolong No. 68, Canggu', crowdLevel: 'BUSY', capacityPct: 92, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Ice Bath', 'Hot Shower', 'Studio Yoga'], distanceKm: 985.0 },
  { id: 'cl_dps_03', name: 'KINETIC Bali Sunset Road', city: 'Denpasar', zone: 'Bali', address: 'Jl. Sunset Road No. 108, Kuta', crowdLevel: 'LOW', capacityPct: 36, openHours: '06:00 - 23:00', facilities: ['Sauna', 'Hot Shower', 'Free Weight Zone'], distanceKm: 978.0 },
  { id: 'cl_dps_04', name: 'KINETIC Bali Ubud', city: 'Gianyar / Ubud', zone: 'Bali', address: 'Jl. Raya Pengosekan, Ubud', crowdLevel: 'MODERATE', capacityPct: 52, openHours: '06:30 - 21:30', facilities: ['Yoga Shala', 'Sauna', 'Hot Shower'], distanceKm: 995.0 },

  // SUMATERA - MEDAN & PALEMBANG (4 Cabang)
  { id: 'cl_mdn_01', name: 'KINETIC Medan Sun Plaza', city: 'Medan', zone: 'Sumatera Utara', address: 'Sun Plaza Lt. 3, Jl. KH. Zainul Arifin No. 7', crowdLevel: 'MODERATE', capacityPct: 61, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Hot Shower', 'Smart Locker', 'Cycling Studio'], distanceKm: 1400.0 },
  { id: 'cl_mdn_02', name: 'KINETIC Medan Centre Point', city: 'Medan', zone: 'Sumatera Utara', address: 'Mall Centre Point Lt. 3A, Jl. Jawa No. 8', crowdLevel: 'LOW', capacityPct: 33, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Free Weight Zone'], distanceKm: 1402.0 },
  { id: 'cl_plb_01', name: 'KINETIC Palembang Icon', city: 'Palembang', zone: 'Sumatera Selatan', address: 'Palembang Icon Mall Lt. 2, Jl. POM IX', crowdLevel: 'LOW', capacityPct: 40, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Hot Shower', 'Free Weight Zone'], distanceKm: 560.0 },

  // JAWA TENGAH & DIY (3 Cabang)
  { id: 'cl_smg_01', name: 'KINETIC Semarang Paragon', city: 'Semarang', zone: 'Jawa Tengah', address: 'Pollux Mall Paragon Lt. 2, Jl. Pemuda No. 118', crowdLevel: 'LOW', capacityPct: 42, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Hot Shower', 'Free Weight Zone'], distanceKm: 440.0 },
  { id: 'cl_jog_01', name: 'KINETIC Jogja Pakuwon Mall', city: 'Sleman / Yogyakarta', zone: 'DI Yogyakarta', address: 'Pakuwon Mall Jogja Lt. 2, Jl. Ring Road Utara', crowdLevel: 'MODERATE', capacityPct: 67, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Cycling Studio', 'Hot Shower'], distanceKm: 520.0 },

  // SULAWESI - MAKASSAR (2 Cabang)
  { id: 'cl_mks_01', name: 'KINETIC Makassar TSM', city: 'Makassar', zone: 'Sulawesi Selatan', address: 'Trans Studio Mall Lt. 1, Jl. Metro Tanjung Bunga', crowdLevel: 'MODERATE', capacityPct: 58, openHours: '06:00 - 22:00', facilities: ['Sauna', 'Hot Shower', 'Free Weight Zone'], distanceKm: 1420.0 },
  { id: 'cl_mks_02', name: 'KINETIC Makassar Nipah', city: 'Makassar', zone: 'Sulawesi Selatan', address: 'Nipah Park Lt. 2, Jl. Urip Sumoharjo', crowdLevel: 'LOW', capacityPct: 37, openHours: '06:00 - 22:00', facilities: ['Hot Shower', 'Smart Locker'], distanceKm: 1425.0 },
];
