import type { Metadata } from "next";
import "./globals.css";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "Spencesa | Ek WerkHard",
    template: "%s | Spencesa",
  },
  description:
    "Essays, aantekeninge en nadenkings oor tegnologie, dissipline en die lewe.",
  openGraph: {
    siteName: "Spencesa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="af" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-ink-900 antialiased">
        <AuthProvider>
          <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
