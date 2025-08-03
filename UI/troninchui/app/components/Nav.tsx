"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Nav = () => {
  return (
    <nav className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition"
          >
            TronInch
          </Link>

          {/* Connect Button */}
          <div className="flex items-center">
            <div className="border border-gray-500 rounded-lg px-2 py-1">
              <appkit-button />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
