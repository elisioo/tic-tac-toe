import "./globals.css";

export const metadata = {
  title: "Cosmic Clash | A Space Arcade Tic-Tac-Toe",
  description:
    "Rocket versus UFO. Nine sectors, two pilots, one galaxy. Play the free two-player space arcade game.",
  openGraph: {
    title: "Cosmic Clash — Space Arcade",
    description: "Rocket vs. UFO in a neon galaxy tic-tac-toe battle.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
