import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'BuildCast — Construction Weather Intelligence',
  description:
    'Know before you go. Construction-grade weather intelligence for job sites. Get go/no-go verdicts for concrete pours, painting, roofing, crane operations, and more.',
  keywords: [
    'construction weather',
    'job site weather',
    'concrete pour forecast',
    'construction forecast',
    'weather intelligence',
    'go no-go weather',
    'contractor weather app',
  ],
  openGraph: {
    title: 'BuildCast — Construction Weather Intelligence',
    description:
      'Know before you go. Get instant go/no-go weather verdicts for concrete pours, painting, roofing, crane operations, and more.',
    type: 'website',
    siteName: 'BuildCast',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildCast — Construction Weather Intelligence',
    description:
      'Know before you go. Get instant go/no-go weather verdicts for concrete pours, painting, roofing, crane operations, and more.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
