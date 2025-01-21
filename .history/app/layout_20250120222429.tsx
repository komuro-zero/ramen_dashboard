import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle component

export const metadata = {
  title: "Ramen Dashboard",
  description: "Filter restaurants based on your preferences",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-bold">Ramen Dashboard</h1>
          <ThemeToggle />
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
