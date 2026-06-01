import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useAuthStore } from "../store/useAuthStore";

const Profile = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser?.fullName || ""); 
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ fullName: name, bio });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        {/* Left Form Side */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile Details</h3>

          {/* Image Upload */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              id="avatar"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="profile"
              className={`w-12 h-12 object-cover rounded-full`}
            />
            Upload profile image
          </label>

          {/* Name Input */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
            required
            className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-violet-500 opacity-70 text-black bg-white"
          />

          {/* Bio Input */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-violet-500 opacity-70 text-black bg-white"
          ></textarea>

          <button
            type="submit"
            className="bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Back to Chat
          </button>
        </form>

        {/* Right Side Logo */}
        <img
          src={assets.logo_icon}
          alt="logo"
          className="max-w-36 aspect-square rounded-full mx-10 max-sm:mt-10"
        />
      </div>
    </div>
  );
};

export default Profile;
