import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lato, Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from '@/context/StoreContext';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dhanlaxmi Saree Sadan - Premium Indian Sarees",
  description: "Discover our exclusive collection of handwoven Indian sarees. From Banarasi silk to designer sarees, find your perfect ethnic wear.",
  keywords: "sarees, indian sarees, banarasi sarees, silk sarees, designer sarees, ethnic wear, handwoven sarees",
  authors: [{ name: "Dhanlaxmi Saree Sadan" }],
  openGraph: {
    title: "Dhanlaxmi Saree Sadan - Premium Indian Sarees",
    description: "Discover our exclusive collection of handwoven Indian sarees. From Banarasi silk to designer sarees, find your perfect ethnic wear.",
    type: "website",
    locale: "en_IN",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${poppins.variable} ${cormorant.variable}`}>
      <body className="font-lato text-gray-800 bg-gray-50 antialiased">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
