import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harga Paket Membership | KINETIC Gym',
  description: 'Pilih paket keanggotaan KINETIC Gym yang paling sesuai untuk Anda. Bebas biaya admin, dapat di-freeze kapan saja, dan akses instan.',
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
