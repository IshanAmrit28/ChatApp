import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, MessageCircle } from "lucide-react";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignupRoute = location.pathname === "/signup";
  const currentState = isSignupRoute ? "Sign Up" : "Login";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login, signup, isCheckingAuth } = useAuthStore();
  const isLoading = isCheckingAuth; // We could add isLoggingIn or isSigningUp to auth store for better UX

  useEffect(() => {
    setIsDataSubmitted(false);
  }, [location.pathname]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currentState === "Sign Up") {
      if (!isDataSubmitted) {
        setIsDataSubmitted(true);
        return;
      } else {
        await signup({ fullName, email, password, bio });
      }
    } else {
      await login({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left Side */}
      <div className="flex flex-col items-center gap-4 w-[min(30vw,250px)]">
        <MessageCircle size={100} className="text-violet-500" />
        <h1 className="text-5xl font-bold tracking-wider text-white">Vibe</h1>
      </div>

      {/* Right Side */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-grey-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && currentState === "Sign Up" && (
            <img
              src={assets.arrow_icon}
              alt="back"
              className="w-5 cursor-pointer rotate-180"
              onClick={() => setIsDataSubmitted(false)}
            />
          )}
        </h2>

        {/* Full Name (only for Signup + before data submit) */}
        {currentState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-grey-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {/* Email + Password */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="p-2 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black bg-white"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black bg-white"
            />
          </>
        )}

        {/* Bio (only after first step of signup) */}
        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black bg-white"
            placeholder="Provide a short bio..."
            required
          ></textarea>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
          {currentState === "Sign Up" && !isDataSubmitted ? "Next" : currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-grey-600">
              Already having an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-sm text-grey-600">
              Dont have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
