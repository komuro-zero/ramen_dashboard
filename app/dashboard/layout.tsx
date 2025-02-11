import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">
        <SidebarProvider>
          <Sidebar />
        </SidebarProvider>
        <main className="flex-grow p-6">{children}</main>
      </body>
    </html>
  );
}
