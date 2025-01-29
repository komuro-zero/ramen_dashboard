import "@/app/globals.css";

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
      <body className="flex min-h-screen w-full bg-gray-100">
        <main className="flex-grow w-full p-6">{children}</main>
      </body>
    </html>
  );
}
