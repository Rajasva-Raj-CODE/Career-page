import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-providers";
import { Toaster } from "sonner";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Opportunities | Guidona Softpedia Pvt Ltd",
  description:
    "Explore exciting career opportunities at Guidona Softpedia Pvt Ltd. Join our team and grow your career in a dynamic, innovative environment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
          <Toaster position="bottom-right" richColors />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
     
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}