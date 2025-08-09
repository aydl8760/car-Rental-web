"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";

import { ChevronLeft, LogOut, UserPen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function UserAdminHeader() {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(user);

  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto py-4">
      <Link href="/">
        <h1 className="font-bold text-sm sm:text-lg text-[#1E3A8A] flex flex-col ">
          <span className="text-base text-gray-600 font-medium">
            Welcome, {user?.name}!
          </span>
          carRental
        </h1>
      </Link>
      {/* todo */}

      <ul className="flex items-center gap-3 text-black font-normal">
        <Link href="/" className="">
          <li className="hidden md:inline text-gray-700 hover:underline hover:text-[#1E3A8A]">
            Home
          </li>
        </Link>
        <Link href="/" className="">
          <li
            onClick={signOut}
            className="hidden md:inline  text-gray-700 hover:underline hover:text-[#1E3A8A]"
          >
            Sign-out
          </li>
        </Link>

        {user && user?.role === "admin" ? (
          <>
            <ul>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <img
                    src={user?.image || "/user.jpg"}
                    className="size-10 rounded-full object-cover"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className="w-56">
                  <DropdownMenuLabel className="flex flex-col items-center justify-center">
                    <span>{user?.name}</span>
                    <span>{user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer"
                  >
                    <UserPen className="mr-2 w-4 h-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/">
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </ul>
          </>
        ) : (
          <Link href="/auth/sign-In">
            <li className="hidden md:inline text-[#1E3A8A] hover:underline hover:text-[#FACC15]">
              Signin
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
}
