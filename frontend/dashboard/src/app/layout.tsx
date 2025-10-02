import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import themes from "@/utils/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App Assistance",
  description: "By. Assistance",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className={inter.className}>{children}</body>
      <NextTopLoader
        color={themes.light.colors.primary}
        height={3}
        showSpinner={false}
        easing="ease"
        speed={400}
        zIndex={99999}
      />
    </html>
  );
}
