import type { Metadata } from "next";
import "./globals.css";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
// Font preconnect is handled via <link> tags below

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ background: "var(--bg)" }}>
        <AuthProvider>
          <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
