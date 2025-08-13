"use client";
import React from "react";

import { FaMapMarkerAlt, FaRegEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function ListItem({ list }) {
  const pathname = usePathname();
  return (
    <Card className="flex flex-col h-full p-0 ">
      <div className="h-[200px] overflow-hidden">
        <img
          src={list?.images[0]}
          alt=""
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      <CardContent className="flex-grow">
        <h3 className="font-bold text-xl  truncate">{list?.model}</h3>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm">{list?.price} /day</p>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-blue-700 size-3" />
            <p className="truncate">{list?.location}</p>
          </div>
        </div>
      </CardContent>

      {pathname.includes("admin/dashboard") && (
        <CardFooter className="flex items-end justify-end mb-4">
          <div className="flex gap-2 items-center">
            <Link href={`/admin/dashboard/update/${list?._id}`}>
              <FaRegEdit />
            </Link>
            <span>
              <FaTrash className="text-red-500 cursor-pointer" />
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
