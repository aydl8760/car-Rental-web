import React from "react";

export default function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-[2px]  flex justify-end items-start z-50 pt-20 px-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-96 shadow-md"
        onClick={(e) => e.stopPropagation()} // prevent modal close on content click
      >
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        {/* Add form inputs here to edit profile */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
