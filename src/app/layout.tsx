import type { Metadata, Viewport } from "next";
import { Jua, Gowun_Dodum } from "next/font/google";
import "./globals.css";
import { SITE } from "@/site.config";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-jua",
});

const dodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-dodum",
});

export const metadata: Metadata = {
  title: `${SITE.name} | 부르면 달려가는 전국 당일 꽃배달`,
  description: `축하화환·근조화환·꽃다발·꽃바구니·관엽화분·동서양란, 전화 한 통이면 ${SITE.name}이 전국 어디든 당일 달려갑니다. 주문·상담 ${SITE.phone}`,
};

export const viewport: Viewport = {
  themeColor: "#ff6f91",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`h-full antialiased ${jua.variable} ${dodum.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
