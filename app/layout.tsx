import "./globals.css";

export const metadata = {
  title: "EvidenceHire",
  description: "Evidence-first recruiting for modern sourcing teams."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
