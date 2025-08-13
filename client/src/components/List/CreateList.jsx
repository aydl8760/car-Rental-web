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
import { basicCarFormControls, rentalInfoFormControls } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const initialState = {
  make: "",
  model: "",
  year: "",
  transmission: "",
  fuelType: "",
  price: "",
  availableFrom: "",
  availableTo: "",
  location: "",
  phone: "",
  color: "",
  images: [],
};

export default function CreateList() {
  const [formData, setFormData] = useState(initialState);
  const [imageFiles, setImageFiles] = useState([]);
  const [isImageUploadError, setIsImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [uploadedImages, setUploadedImages] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageFiles = (event) => {
    const files = Array.from(event.target.files);
    if (files) {
      setImageFiles(files);
    }
  };

  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) {
      setIsImageUploadError("Please select at least one image.");
      return;
    } else if (
      imageFiles.length > 6 ||
      imageFiles.length + formData.images.length > 6
    ) {
      setIsImageUploadError("You can only upload max 6 image.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    imageFiles.forEach((file) => {
      data.append("myMultiFiles", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8081/api/list/uploadMultiImages",
        data
      );

      console.log(response);

      if (response?.data?.success) {
        setUploadedImages(response.data.images);
        setFormData((prev) => ({
          ...prev,
          images: prev.images.concat(response.data.images),
        }));
        setLoading(false);
        setIsImageUploadError(false);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setIsImageUploadError("image upload failed, please try again!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8081/api/list/create",
        formData,
        {
          withCredentials: true, // ✅ this sends cookies
        }
      );
      if (res) {
        console.log(res);
      }
    } catch (error) {
      console.log("error during list create", error);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong.";

      toast.error(message);

      // todo  Redirect only from frontend based on status
    }
  };

  console.log(formData);

  return (
    <div className="p-10">
      <div className="border h-full p-5 w-full  ">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-medium px-2 mb-5">Car Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {basicCarFormControls.map((control, index) => (
              <div key={control.id || index}>
                {control.componentType === "input" ? (
                  <div className="w-full">
                    <Input
                      id={control.name}
                      name={control.name}
                      type={control.type}
                      placeholder={control.label}
                      min={control.min}
                      onChange={handleChange}
                      value={formData[control.name] || ""}
                      className="border border-gray-300 rounded-lg p-6"
                    />
                  </div>
                ) : (
                  control.componentType === "select" && (
                    <div>
                      <Select
                        required
                        onValueChange={(value) =>
                          setFormData({ ...formData, [control.name]: value })
                        }
                        value={formData[control.name] || ""}
                      >
                        <SelectTrigger className="w-full border border-gray-300 rounded-lg p-6 focus:outline-none focus:ring-0  focus-visible:ring-0 placeholder-slate-200">
                          <SelectValue placeholder={control.label} />
                        </SelectTrigger>
                        <SelectContent>
                          {control.options?.length > 0
                            ? control.options.map((optionItem) => (
                                <SelectItem
                                  key={optionItem.id}
                                  value={optionItem.id}
                                >
                                  {optionItem.label}
                                </SelectItem>
                              ))
                            : null}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-medium px-2 mt-8 mb-5">Rental Info</h2>
            <div className="grid grid-cols-2 gap-4">
              {rentalInfoFormControls.map((control, index) => (
                <div key={control.id || index}>
                  {control.componentType === "input" && (
                    <div className="w-full">
                      <Label className="text-[14px] text-gray-700">
                        {control.label}
                      </Label>
                      <Input
                        id={control.name}
                        name={control.name}
                        type={control.type}
                        placeholder={control.label}
                        min={control.min}
                        onChange={handleChange}
                        value={formData[control.name] || ""}
                        className="border border-gray-300 rounded-lg p-6"
                      />
                    </div>
                  )}
                </div>
              ))}

              <div>
                <p className="text-gray-700 mb-1">
                  Images:
                  <span className="font-normal text-gray-600 ml-2">
                    The first image will be the cover
                  </span>
                </p>
                <div className="flex gap-4">
                  <input
                    className="border border-gray-300 rounded-lg p-2 cursor-pointer"
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageFiles}
                  />

                  <Button
                    onClick={uploadImagesToCloudinary}
                    type="button"
                    className="p-4 font-normal bg-transparent text-blue-700 border border-blue-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                  >
                    {loading ? "Loading..." : "Upload"}
                  </Button>
                </div>
                <p className="text-red-700">
                  {isImageUploadError && isImageUploadError}
                </p>
                {formData?.images?.length > 0 &&
                  formData?.images?.map((imageUrl, index) => (
                    <div
                      key={imageUrl}
                      className="flex justify-between p-3 border items-center"
                    >
                      <img
                        src={imageUrl}
                        alt="car images"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <Button
                        onClick={() => hanleDeleteImage(index)}
                        type="button"
                        className="p-3 bg-transparent text-red-700 rounded-lg uppercase hover:opacity-75"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full mt-10 flex justify-center items-center">
            <Button
              disabled={loading || loading || formData.images.length === 0}
              className="bg-blue-600 w-[50%] uppercase text-white p-6 rounded-lg hover:bg-blue-700 disabled:opacity-85 "
            >
              {loading ? "Creating..." : "Create List"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
