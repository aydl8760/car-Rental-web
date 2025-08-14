"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";

import { ChevronLeft, LogOut, UserPen } from "lucide-react";

import { usePathname } from "next/navigation";

import toast from "react-hot-toast";
import ProfileModal from "./Modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAdminHeader from "../UserAdmin/UserAdminHeader";

export default function Header() {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  console.log(user);

  const handleDashboardClick = (e) => {
    if (user && user.role === "admin" && !user.isApproved) {
      e.preventDefault();
      toast.error(
        "Your account is not approved yet. Please wait for approval."
      );
    }
  };

  return (
    <>
      {!pathname.includes("super-admin") && (
        <header
          className={` ${
            pathname.startsWith("/admin")
              ? "bg-[#edf0f5] shadow-sm"
              : "bg-blue-950 shadow-lg"
          }`}
        >
          {pathname.startsWith("/admin") ? (
            <UserAdminHeader />
          ) : (
            <div className="flex justify-between items-center max-w-6xl mx-auto py-4">
              <Link href="/">
                <h1 className="font-bold text-sm sm:text-xl text-white ">
                  CarRental
                </h1>
              </Link>
              {/* todo */}

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

                {user && user?.role === "user" ? (
                  <>
                    <>
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
                      <ProfileModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        user={user}
                      />
                    </>
                  </>
                ) : user && user?.role === "admin" ? (
                  <>
                    <Link href="/auth/sign-In" className="">
                      <li
                        onClick={signOut}
                        className="hidden md:inline text-[#edf0f5] hover:underline hover:text-[#FACC15]"
                      >
                        sign-out
                      </li>
                    </Link>
                    <Link
                      href={user.isApproved ? "/admin/dashboard" : "#"}
                      onClick={handleDashboardClick}
                      className="flex items-center gap-2 bg-[#facc15] hover:bg-yellow-400 text-[#1E3A8A] text-[16px]  font-semibold rounded-md px-4 py-2 cursor-pointer"
                    >
                      Dashboard
                      <ChevronLeft
                        strokeWidth={3}
                        className="size-4 transform rotate-180 text-[#1E3A8A] font-semibold"
                      />
                    </Link>
                  </>
                ) : (
                  <Link href="/auth/sign-In">
                    <li className="hidden md:inline text-[#edf0f5] hover:underline hover:text-[#FACC15]">
                      Signin
                    </li>
                  </Link>
                )}
              </ul>
            </div>
          )}
        </header>
      )}
    </>
  );
}
