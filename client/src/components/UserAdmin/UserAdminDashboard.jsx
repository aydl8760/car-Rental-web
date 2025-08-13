"use client"; // if in app router and using hooks

import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarCheck,
  LayoutDashboard,
  List,
  ListPlus,
  Mail,
  MailCheck,
  Megaphone,
  Settings,
  User,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function UserAdminDashboard({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="w-full h-screen flex justify-between items-center">
      {/* left side */}
      <div className="w-[25%] h-full py-1 shadow">
        <div className="font-normal flex flex-col gap-1  cursor-pointer">
          <Link
            href="/admin/dashboard"
            className={`flex gap-2 items-center px-6 py-4 mt-5 hover:bg-blue-50 ${
              pathname.includes("list")
                ? "bg-blue-50 border-r-4 border-blue-700"
                : ""
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-gray-700" />
            <span>Dashboard</span>
          </Link>
          <Separator />
          <Link
            href="/admin/create"
            className={`flex gap-2 items-center px-6 py-4 hover:bg-blue-50  ${
              pathname.includes("create")
                ? "bg-blue-50 border-r-4 border-blue-700"
                : ""
            }`}
          >
            <ListPlus className="w-4 h-4 text-gray-700" />
            <span>Create-list</span>
          </Link>
          <Separator />
          <Link
            href="/admin/account"
            className={`flex gap-2 items-center px-6 py-4 hover:bg-blue-50   ${
              pathname.includes("account")
                ? "bg-blue-50 border-r-4 border-blue-700"
                : ""
            }`}
          >
            <Settings className="w-4 h-4 text-gray-700" />
            <span>Account</span>
          </Link>
          <Separator />
          <Link
            href="/admin/notification"
            className={`flex gap-2 items-center px-6 py-4 hover:bg-blue-50   ${
              pathname.includes("notification")
                ? "bg-blue-50 border-r-4 border-blue-700"
                : ""
            }`}
          >
            <MailCheck className="w-4 h-4 text-gray-700" />
            <span>Notification</span>
          </Link>
          <Separator />
        </div>
      </div>

      {/* right side */}
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
