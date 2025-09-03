import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-sm">
      {/* Logo or Brand */}
      <h1 className="text-xl font-bold text-[#021024]">AISystem</h1>

      {/* Links */}
      <div className="flex space-x-4">
        <Link
          href="/auth/login"
          className="px-4 py-2 rounded-lg shadow text-[#021024] hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 rounded-lg shadow text-white bg-[#021024] hover:bg-[#032845]"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
