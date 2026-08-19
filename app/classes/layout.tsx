import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jadwal Kelas Studio | KINETIC Gym',
  description: 'Pesan kelas studio favorit Anda dengan fitur Interactive Spot Picker. Tersedia BodyPump, Cycling, Yoga, dan lainnya di KINETIC Gym.',
};

export default function ClassesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
