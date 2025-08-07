"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React, { useState } from "react";

const initialState = {
  userName: "",
  email: "",
  password: "",
  role: "",
};

export default function SignUp() {
  const [formData, setFormData] = useState(initialState);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = () => {};
  return (
    <div className="max-w-[550px] bg-[#ffffff] mx-auto mt-20 mb-10 p-5 border border-[#E2E8F0] rounded-lg">
      <h1 className="text-center text-2xl font-semibold text-gray-950 mb-5 ">
        Create New Account
      </h1>
      <Separator className="bg-gray-400" />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
        <div className="flex flex-col gap-1 ">
          <Label className="font-medium text-gray-600 text-[16px]">Name</Label>
          <Input
            placeholder="Enter your userName"
            type="text"
            name="name"
            value={formData.userName}
            onChange={handleInputChange}
            className="px-2 py-5 border border-[#94A3B8] rounded-md "
          />
        </div>
        <div className="flex flex-col gap-1 ">
          <Label className="font-medium text-gray-600 text-[16px]">Email</Label>
          <Input
            placeholder="Enter your email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border border-[#94A3B8] rounded-md px-2 py-5"
          />
        </div>
        <div className="flex flex-col gap-1 ">
          <Label className="font-medium text-gray-600 text-[16px]">
            Password
          </Label>
          <Input
            placeholder="Enter your password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="border border-[#94A3B8] rounded-md px-2 py-5 "
          />
        </div>

        <div className="flex flex-col gap-1  ">
          <Label className="font-medium text-gray-600 text-[16px]">Role</Label>
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                role: value,
              })
            }
            value={formData.role}
          >
            <SelectTrigger className="w-full px-2 py-5 border border-[#94A3B8] focus:outline-none focus:ring-0  focus-visible:ring-0 ">
              <SelectValue placeholder="select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Car Owner(approval)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="bg-[#1E3A8A] hover:bg-[#162E6B] mt-4 p-5 cursor-pointer">
          Sign-Up
        </Button>
      </form>
      <div className="flex gap-2 items-center mt-5">
        <p className="text-[15px]">Already have Account? </p>
        <Link
          href="/auth/sign-In"
          className="text-blue-600 font-medium hover:underline hover:text-blue-700"
        >
          SignIn
        </Link>
      </div>
    </div>
  );
}
