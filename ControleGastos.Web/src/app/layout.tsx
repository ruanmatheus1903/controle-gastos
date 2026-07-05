import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Controle de Gastos',
  description: 'Sistema de controle de gastos residenciais',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
