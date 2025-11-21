import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { DialogProvider } from "@/context/DialogContext";
import Navigation from "@/components/common/Navigation";
import ToastsContainer from "@/components/common/ToastsContainer";

export const metadata: Metadata = {
  title: "Sports Shop Billing System",
  description: "Billing software for sports shop",
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
      <body className="bg-mesh">
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
