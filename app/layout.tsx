import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { DialogProvider } from "@/context/DialogContext";
import Navigation from "@/components/common/Navigation";
import ToastsContainer from "@/components/common/ToastsContainer";

export const metadata: Metadata = {
  title: "Sports Shop — Premium Billing System",
  description: "Premium billing software for sports equipment retail",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-mesh font-body">
        <div className="grain-overlay" aria-hidden="true" />
        <DialogProvider>
          <ToastProvider>
            <CartProvider>
              <Navigation />
              <main className="min-h-screen relative pt-24">{children}</main>
              <ToastsContainer />
            </CartProvider>
          </ToastProvider>
        </DialogProvider>
      </body>
    </html>
  );
}
