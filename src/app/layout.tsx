import type { Metadata } from "next";
import "./globals.css";
import DisableContextMenu from "@/components/DisableContextMenu";

export const metadata: Metadata = {
  title: "Event Website",
  description: "Static event website with 5 pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DisableContextMenu />
        <div className="page-transition">
          {children}
        </div>
      </body>
    </html>
  );
}
