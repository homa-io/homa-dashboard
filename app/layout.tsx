import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { DashboardLayoutWrapper } from "../src/components/DashboardLayoutWrapper"
import { AuthProvider } from "../src/contexts/AuthContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Homa Dashboard",
  description: "Modern dashboard built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
                  if (darkMode) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <AuthProvider>
          <DashboardLayoutWrapper>
            {children}
          </DashboardLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
