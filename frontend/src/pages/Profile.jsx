import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircle } from "lucide-react";

const Profile = () => {
  const { authUser, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [name, setName] = useState(authUser?.fullName || ""); 
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageBase64(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = { fullName: name, bio };
    if (imageBase64) {
      updateData.profilePic = imageBase64;
    }
    await updateProfile(updateData);
    setImageBase64(null); // Reset after successful update
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

          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl text-lg cursor-pointer transition-colors shadow-lg"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-xl text-lg cursor-pointer transition-colors shadow-lg"
            >
              Back to Chat
            </button>
          </div>
        </form>

        {/* Right Side Logo */}
        <div className="flex flex-col items-center gap-4 mx-10 max-sm:mt-10">
          <MessageCircle size={80} className="text-violet-500" />
          <h1 className="text-4xl font-bold tracking-wider text-white">Vibe</h1>
        </div>
      </div>
    </div>
  );
};

export default Profile;
