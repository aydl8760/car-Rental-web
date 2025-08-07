import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="bg-blue-950 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4">
        <Link href="/">
          <h1 className="font-bold text-sm sm:text-xl text-white ">
            CarRental
          </h1>
        </Link>
        <ul className="flex items-center gap-3 text-black">
          <Link href="/" className="">
            <li className="hidden md:inline text-[#edf0f5] hover:underline hover:text-[#FACC15]">
              Home
            </li>
          </Link>

          <Link href="/about" className="">
            <li className="hidden md:inline text-[#edf0f5] hover:underline hover:text-[#FACC15]">
              About
            </li>
          </Link>

          <Link href="/auth/sign-up">
            <li className="hidden md:inline text-[#edf0f5] hover:underline hover:text-[#FACC15]">
              Signin
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
