import "@/app/globals.css";
import Link from "next/link";

export const metadata = {
  title: "Ramen Dashboard",
  description: "Filter restaurants and manage ramen information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <header className="w-full bg-white shadow-md p-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            <h1 className="text-xl font-bold text-gray-800">
              🍜 Ramen Dashboard
            </h1>
          </Link>
          <Link href="/login">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Login
            </button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full p-6">{children}</main>
      </body>
    </html>
  );
}
