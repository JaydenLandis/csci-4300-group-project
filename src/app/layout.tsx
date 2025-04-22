import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { auth } from "../auth";
import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <NavBar session={session} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
