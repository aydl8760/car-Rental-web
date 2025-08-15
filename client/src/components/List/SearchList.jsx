"use client";
import ListItem from "@/components/List/ListItem";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchOptions, sortOptions } from "@/config";
import axios from "axios";
import { ArrowUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function SearchList() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchResult, setSearchResult] = useState();
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    selectValues: {},
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleInputChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      selectValues: {
        ...prev.selectValues,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    const searchTermFromUrl = searchParams.get("searchTerm");
    console.log("Search Term:", searchTermFromUrl);

    const newSelectValues = {};
    searchOptions.forEach((option) => {
      const value = searchParams.get(option.name);
      if (value) {
        newSelectValues[option.name] = value;
      }
    });

    if (searchTermFromUrl || Object.keys(newSelectValues).length > 0) {
      setFilters((prev) => ({
        ...prev,
        searchTerm: searchTermFromUrl || "",
        selectValues: newSelectValues,
      }));
    }

    const fetchListing = async () => {
      const searchQuery = searchParams.toString();
      try {
        const res = await axios.get(
          `http://localhost:8081/api/list/get?${searchQuery}`
        );
        if (res) {
          console.log("Fetched Listings:", res);
          const fetched = res?.data?.lists || [];
          setSearchResult(fetched);

          // ✅ Show "Show More" only if there are likely more results
          if (fetched.length >= 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchListing();
  }, [searchParams]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", filters.searchTerm);

    Object.entries(filters.selectValues).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value);
      }
    });

    urlParams.set("sortBy", sort);
    const searchQuery = urlParams.toString();
    router.push(`/list/search?${searchQuery}`);
  };

  const handleSort = (value) => {
    setSort(value);

    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set("sortBy", value);

    router.push(`/list/search?${urlParams.toString()}`);
  };

  const handleShowMoreClick = async () => {
    const numberOfListings = searchResult.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set("startIndex", startIndex);

    const searchQuery = urlParams.toString();

    try {
      const res = await axios.get(
        `http://localhost:8081/api/list/get?${searchQuery}`
      );
      if (res?.data) {
        const listing = res?.data?.lists;
        if (listing.length < 9) {
          setShowMore(false);
        }
        console.log("show Listings:", res);
        setSearchResult([...searchResult, ...listing]);
      }
    } catch (error) {}
  };
  return (
    <main>
      <div className="flex flex-col relative">
        <div className="bg-blue-950 h-52 md:h-80 flex justify-center items-center mt-14 md:mt-0  ">
          <form onSubmit={handleOnSubmit} className="max-w-7xl mx-auto p-3">
            <div className="flex flex-wrap gap-3 justify-center items-center w-full">
              <Input
                type="text"
                name="searchTerm"
                placeholder="Search by anything..."
                className="bg-white  md:w-40 rounded-xl p-5 sm:p-6 w-32 sm:w-52 lg:w-60 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none"
                value={filters.searchTerm}
                onChange={handleInputChange}
              />
              {searchOptions.map((control) => (
                <div key={control.name}>
                  <Select
                    className="w-36 lg:w-40 focus:outline-none"
                    value={filters.selectValues[control.name] || ""} // controlled
                    onValueChange={(value) =>
                      handleSelectChange(control.name, value)
                    }
                  >
                    <SelectTrigger className="w-36 lg:w-40 bg-white rounded-xl p-5 sm:p-6 focus:ring-2 focus:ring-green-500">
                      <SelectValue placeholder={control.label} />
                    </SelectTrigger>
                    <SelectContent className="max-h-40 overflow-y-auto">
                      {control.options?.map((optionItem) => (
                        <SelectItem key={optionItem.id} value={optionItem.id}>
                          {optionItem.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-950 px-8 py-5 sm:py-6  rounded text-base cursor-pointer   ">
                Search
              </Button>
            </div>
          </form>
        </div>

        <div className="md:max-w-4xl lg:max-w-6xl mx-auto md:rounded-lg md:shadow-lg md:border flex flex-col gap-8 max-h-[90rem] overflow-y-auto absolute left-0 right-0 top-0 md:top-auto md:bottom-[-35px] bg-white ">
          <div className="py-3 md:py-4 px-10 border-b flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-slate-900">
              All Lists
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">Lists</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={handleSort}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <p className="text-center text-2xl mt-20 md:mt-28">Loading...</p>
      )}
      {!isLoading && searchResult?.length === 0 && (
        <p className="text-2xl text-gray-800 mt-28 text-center">
          No listing found!
        </p>
      )}
      <div className="pt-8 lg:pt-20 sm:max-w-6xl mx-auto  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
          {!isLoading && searchResult && searchResult.length > 0
            ? searchResult.map((listItem) => (
                <ListItem list={listItem} key={listItem._id} />
              ))
            : null}
        </div>
      </div>

      {!isLoading && showMore && (
        <Button
          className="text-blue-500 bg-white hover:bg-white shadow-none border-none text-lg text-center w-full hover:underline cursor-pointer p-7"
          onClick={handleShowMoreClick}
        >
          Show more
        </Button>
      )}
    </main>
  );
}
