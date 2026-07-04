import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { BsRobot, BsCoin, BsClockHistory, BsChevronDown } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);

  const handlelogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm px-6 py-3 flex justify-between items-center"
          >
            {/* Logo Section */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-indigo-100">
                <BsRobot size={20} />
              </div>
              <span className="font-bold text-slate-800 text-xl tracking-tight hidden sm:block">
                Ace<span className="text-indigo-600">Interview</span>
              </span>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Credits Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!userData) return setShowAuth(true);
                    setShowCreditPopup(!showCreditPopup);
                    setShowUserPopup(false);
                  }}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors group"
                >
                  <BsCoin
                    className="text-amber-500 group-hover:scale-110 transition-transform"
                    size={18}
                  />
                  <span className="font-bold text-slate-700 text-sm">
                    {userData?.credits || 0}
                  </span>
                </button>

                <AnimatePresence>
                  {showCreditPopup && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white shadow-2xl shadow-slate-200 border border-slate-100 rounded-2xl p-5 z-[110]"
                    >
                      <h4 className="font-bold text-slate-800 mb-1">
                        Top up Credits
                      </h4>
                      <p className="text-xs text-slate-500 mb-4">
                        Your current balance is {userData?.credits || 0}. Get
                        more to unlock technical deep-dives.
                      </p>
                      <button
                        onClick={() => {
                          navigate("/pricing");
                          setShowCreditPopup(false);
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-100"
                      >
                        Upgrade Now
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!userData) return setShowAuth(true);
                    setShowUserPopup(!showUserPopup);
                    setShowCreditPopup(false);
                  }}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-10 h-10 bg-slate-900 ring-2 ring-slate-50 text-white rounded-xl flex items-center justify-center font-bold shadow-md overflow-hidden transition-all group-hover:shadow-indigo-100">
                    {userData ? (
                      userData.name.charAt(0).toUpperCase()
                    ) : (
                      <FaUserAstronaut size={18} />
                    )}
                  </div>
                  <BsChevronDown
                    className={`text-slate-400 text-xs transition-transform duration-300 ${showUserPopup ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showUserPopup && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white shadow-2xl shadow-slate-200 border border-slate-100 rounded-2xl overflow-hidden z-[110]"
                    >
                      <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Account
                        </p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {userData?.name}
                        </p>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate("/history");
                            setShowUserPopup(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                        >
                          <BsClockHistory size={16} />
                          Interview History
                        </button>

                        <button
                          onClick={handlelogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                        >
                          <HiOutlineLogout size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>

      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;
