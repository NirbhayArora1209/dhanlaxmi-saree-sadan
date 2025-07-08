import './globals.css';
import { StoreProvider } from '../context/StoreContext';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export const metadata = {
  title: 'Dhanlaxmi Saree Sadan',
  description: 'Premium Indian sarees for every occasion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <ErrorBoundary>
          <StoreProvider>
            {children}
          </StoreProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
