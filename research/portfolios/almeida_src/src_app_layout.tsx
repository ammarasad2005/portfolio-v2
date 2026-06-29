import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppinsSans = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppi-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Matheus Almeida - Software Engineer Front End",
    template: "%s | Matheus Almeida",
  },
  description:
    "Software Engineer Front-End specialized in Vue, React, TypeScript, Tailwind, Node.js and Firebase. I transform ideas into modern, accessible, and high-performance digital experiences.",
  authors: [{ name: "Matheus Almeida", url: "https://almeida-matheus.com" }],
  creator: "Matheus Almeida",
  publisher: "Matheus Almeida",
  metadataBase: new URL("https://almeida-matheus.com"),
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Matheus Almeida",
    "Frontend",
    "Software Engineer",
    "Desenvolvedor Frontend",
    "Frontend Developer",
    "Vue",
    "React",
    "Tailwind",
    "JavaScript",
    "Next.js",
    "HTML",
    "CSS",
    "Express",
    "MongoBD",
    "Firebase",
    "Programador Frontend",
    "Engenheiro de Software",
    "Web Developer",
    "Micro-SaaS",
    "UI Developer",
    "Developer Portfolio",
  ],
  openGraph: {
    title:
      "Matheus Almeida - Software Engineer Front End | Vue, React, Tailwind",
    description:
      "Software Engineer Front-End specialized in Vue, React, TypeScript, Tailwind, Node.js and Firebase. I transform ideas into modern, accessible, and high-performance digital experiences.",
    url: "https://almeida-matheus.com",
    siteName: "Matheus Almeida",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  category: "technology",
  classification: "Software Engineer",
  applicationName: "Matheus Almeida Portfolio",
  verification: {
    google: "zLhULd-U4o_BOSFwid6TZQZacqB-hte1fgytIbGqVMY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsSans.variable} antialiased`}>
        <Toaster position="bottom-center" toastOptions={{ duration: 5000 }} />
        {children}
      </body>
    </html>
  );
}
