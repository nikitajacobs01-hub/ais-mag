import Sidebar from "../../components/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-white text-[#021024]">
        <Sidebar />
        <main className="flex-1 ml-16 transition-all duration-300 p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
