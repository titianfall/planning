import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CS Career Compass",
  description: "컴퓨터공학부와 IT 전공 학생을 위한 진로 탐색 카탈로그입니다."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body>{children}</body>
    </html>
  );
}
