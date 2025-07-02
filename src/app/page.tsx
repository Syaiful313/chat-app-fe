"use client";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to the Chat App</h1>

        <p className="mt-4 text-lg">
          {data
            ? `Hello, ${data.user?.name || data.user?.firstName}!`
            : "Please log in."}
        </p>
      </div>
    </>
  );
}
