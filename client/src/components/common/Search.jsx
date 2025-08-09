"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/list/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 rounded-lg flex items-center mt-5 shadow-sm"
    >
      <input
        placeholder="Search ....."
        name="keyword"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-3 focus:outline-none w-[580px]  "
      />
      <button className="text-[#1E3A8A]  rounded-r-lg h-full   font-semibold px-4 py-2">
        <FaSearch />
      </button>
    </form>
  );
}
