import React from "react";
import { IoSparkles } from "react-icons/io5";
import { motion } from "framer-motion"; // Keeping consistency with common framer-motion naming
import { FcGoogle } from "react-icons/fc";
import { BsRobot } from "react-icons/bs";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const { displayName: name, email } = response.user;

      const result = await axios.post(
        `${serverUrl}/api/auth/google`,
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.error("Authentication Error:", error);
      dispatch(setUserData(null));
    }
  };

  return (
    <div
      className={`w-full selection:bg-indigo-100 ${
        isModel
          ? "py-2"
          : "min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 overflow-hidden relative"
      }`}
    >
      {/* Decorative Background for Full Page Mode */}
      {!isModel && (
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative z-10 w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 
          ${isModel ? "max-w-md p-8 rounded-[2rem]" : "max-w-lg p-10 md:p-14 rounded-[3rem]"}`}
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg shadow-slate-200 mb-4">
            <BsRobot size={24} />
          </div>
          <span className="font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">
            AceInterview Platform
          </span>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Elevate your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Career Journey
            </span>
          </h1>

          <div className="flex justify-center">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 border border-indigo-100 shadow-sm">
              <IoSparkles className="animate-pulse" />
              AI-DRIVEN PREPARATION
            </span>
          </div>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-[280px] mx-auto">
            Join thousands of professionals mastering their interview skills
            with real-time AI feedback.
          </p>
        </div>

        {/* Auth Button */}
        <div className="space-y-4">
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ y: -2, shadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          >
            <FcGoogle size={22} />
            Continue with Google
          </motion.button>

          <p className="text-[10px] text-center text-slate-400 px-8 uppercase tracking-widest font-medium">
            Secure, encrypted authentication
          </p>
        </div>

        {/* Subtle Footer for Auth */}
        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            By continuing, you agree to our <br />
            <span className="text-slate-600 underline cursor-pointer hover:text-indigo-600">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-slate-600 underline cursor-pointer hover:text-indigo-600">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;
