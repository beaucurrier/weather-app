import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignIn = () => router.push("/auth/signin");
  const handleSignOut = () => signOut({ callbackUrl: "/" });

  return (
    <header className="w-full bg-gray-50 dark:bg-gray-900 p-4 shadow-md fixed top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-indigo-400"
        >
          My Weather App
        </Link>

        {/* Right side: Sign In or User Menu */}
        <div className="relative">
          {session ? (
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </button>
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    View Account Details
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="text-blue-600 dark:text-indigo-400 hover:underline"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}