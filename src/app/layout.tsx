import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SupabaseStatusBanner } from "@/components/supabase-status-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Refocus - Foco, Abstinência e Saúde Mental",
  description: "Aplicativo para ajudar pessoas a reduzir ou abandonar o consumo de álcool e cigarro, usando estratégias baseadas em psicologia comportamental e IA.",
  keywords: ["abstinência", "saúde mental", "foco", "bem-estar", "psicologia", "IA"],
  authors: [{ name: "Refocus Team" }],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <SupabaseStatusBanner />
        {children}
      </body>
    </html>
  );
}
