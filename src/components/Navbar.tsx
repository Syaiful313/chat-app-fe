"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data } = useSession();
  const user = data?.user;

  const logout = () => {
    signOut({
      redirectTo: "/",
    });
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="font-serif text-2xl font-bold">
            Chat App
          </Link>

          <div className="flex items-center gap-8 font-sans font-medium">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <Link href="/login" className="hover:text-primary">
                Login
              </Link>
            )}

            {user && (
              <button onClick={logout} className="hover:text-primary">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
