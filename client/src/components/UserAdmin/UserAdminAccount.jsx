"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { LogOut, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserAdminAccount() {
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, signOut, setUser } = useAuth();
  const fileRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
      }));
    }
  }, [user]);

  function handleImageFile(event) {
    console.log(event.target.files);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
    }
  }

  async function uploadImageCloudnary() {
    try {
      setUploading(true);
      const data = new FormData();
      data.append("myFile", imageFile);
      const response = await axios.post(
        "http://localhost:5009/api/user/uploadImage",
        data
      );
      console.log(response, "response");
      if (response?.data) {
        console.log(response);

        setFormData((prev) => ({ ...prev, image: response.data.result.url }));
        setUploading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageCloudnary();
  }, [imageFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:8081/api/user/update/${user?._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response) {
        console.log(response);

        toast.success(response?.data?.message);
        setUser(response?.data?.user);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error during update", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    router("/auth/sign-In");
  };

  console.log(formData);

  return (
    <div className="flex justify-center items-center">
      <div className="w-[500px] flex flex-col justify-between">
        <div className="flex flex-col justify-center items-center">
          <form
            onSubmit={handleUpdateSubmit}
            className="flex flex-col gap-4 w-full mt-10 "
          >
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleImageFile}
              className="hidden"
            />

            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center">
                <span
                  onClick={() => fileRef.current.click()}
                  className="text-center cursor-pointer"
                >
                  Edit
                </span>

                <img
                  onClick={() => fileRef.current.click()}
                  src={formData?.image || "/user.jpg"}
                  alt="profile"
                  className="rounded-full size-28  object-cover cursor-pointer self-center"
                />
              </div>
              {uploading && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Uploading...
                </p>
              )}
            </div>

            <div className="text-center mt-2">
              <h2 className="text-xl font-semibold">{user?.email}</h2>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <input
                type="text"
                name="email"
                disabled
                placeholder="Enter your Email..."
                className="p-3 rounded-lg border shadow-sm"
                value={formData?.email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="name"
                placeholder="Enter your Name..."
                className="p-3 rounded-lg border shadow-sm"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="*******"
                className="p-3 rounded-lg border shadow-sm"
                value={formData?.password}
                onChange={handleInputChange}
              />
            </div>

            <Button
              disabled={isLoading}
              className="bg-blue-900 hover:bg-blue-800 uppercase disabled:opacity-80 p-6 rounded-lg"
            >
              {isLoading ? "Loading..." : "Update Profile"}
            </Button>
          </form>
        </div>

        <div className="flex justify-between mt-6 text-sm px-2">
          <span
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-700 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log out
          </span>
        </div>
      </div>
    </div>
  );
}
