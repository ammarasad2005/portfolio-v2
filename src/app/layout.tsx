import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://ammarasad.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Ammar Asad — Full-Stack Engineer",
    template: "%s · Ammar Asad",
  },
  description:
    "Full-stack engineer building production web apps with TypeScript, React, Next.js, and Node.js. CS undergrad at FAST-NUCES Islamabad. Ships real systems used by real people.",
  keywords: [
    "Muhammad Ammar Asad",
    "Ammar Asad",
    "full-stack developer",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Islamabad",
    "FAST-NUCES",
    "Pakistan",
    "Chrome extension",
    "agentic AI",
    "Supabase",
    "MongoDB",
  ],
  authors: [{ name: "Muhammad Ammar Asad", url: siteUrl }],
  creator: "Muhammad Ammar Asad",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ammar Asad — Portfolio",
    title: "Muhammad Ammar Asad — Full-Stack Engineer",
    description:
      "Full-stack engineer building production web apps with TypeScript, React, Next.js, and Node.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Ammar Asad — Full-Stack Engineer",
    description:
      "Full-stack engineer building production web apps. CS undergrad at FAST-NUCES Islamabad.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Muhammad Ammar Asad",
              url: siteUrl,
              email: "mailto:ammarasad321993@gmail.com",
              jobTitle: "Full-Stack Engineer",
              knowsAbout: [
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Express",
                "PostgreSQL",
                "MongoDB",
                "OAuth 2.0",
                "Serverless",
                "Chrome Extension",
                "Agentic AI",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Islamabad",
                addressCountry: "Pakistan",
              },
              sameAs: [
                "https://github.com/ammarasad2005",
                "https://linkedin.com/in/muhammad-ammar-asad",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
