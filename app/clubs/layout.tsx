import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cabang KINETIC Gym | Temukan Gym Terdekat',
  description: 'Cari dan temukan cabang KINETIC Gym terdekat dari lokasi Anda. Pantau live crowd secara real-time dan cek fasilitas lengkap setiap cabang.',
};

export default function ClubsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
