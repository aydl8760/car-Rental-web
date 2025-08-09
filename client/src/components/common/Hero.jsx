import React from "react";
import Search from "./Search";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center h-[800px]">
      <div className="flex flex-col justify-center items-center">
        <h1 className="font-bold text-5xl text-gray-900">
          Car Rental & <span>Sharing Hub</span>
        </h1>

        <Search />
      </div>
      <div className="w-full bg-gray-100 mt-16">
        <img src="/SideModelpage.jpg" className="w-full h-96" />
      </div>
    </section>
  );
}
