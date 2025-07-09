import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata = {
  title: 'Dhanlaxmi Saree Sadan',
  description: 'Premium Indian sarees for every occasion',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <ErrorBoundary>
          <SessionProvider>
            <StoreProvider>
              {children}
            </StoreProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
