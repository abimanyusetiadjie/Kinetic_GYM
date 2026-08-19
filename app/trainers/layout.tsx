import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Personal Trainer 1-on-1 | KINETIC Gym',
  description: 'Konsultasi dan latihan bersama Personal Trainer bersertifikat. Bebas dari hard-selling dengan garansi 100% Zero-Harassment.',
};

export default function TrainersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
