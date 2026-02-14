import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cedar Floodplain Agent',
  description: 'Agentic floodplain risk assessment for development teams'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
