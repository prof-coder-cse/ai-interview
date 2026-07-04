import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Note: 'motion/react' is fine, but standard 'framer-motion' is more common. I'll keep your import logic.
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.error(error);
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      onStart({ ...result.data, username: userData?.name || "User" });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Info */}
        <div className="md:w-5/12 bg-slate-900 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <p className="animate-pulse" /> AI Powered
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Ace your next <span className="text-indigo-400">Interview.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              We analyze your background to generate industry-standard
              questions.
            </p>

            <div className="space-y-6">
              {[
                { icon: <FaUserTie />, text: "Tailored Scenarios" },
                { icon: <FaMicrophoneAlt />, text: "Real-time Feedback" },
                { icon: <FaChartLine />, text: "Detailed Analytics" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="p-3 rounded-lg bg-slate-800 group-hover:bg-indigo-600 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-slate-300 font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-500 italic">
              "The best way to predict the future is to create it."
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-10 md:p-14 bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Setup Session</h3>
            <p className="text-slate-500">Tell us about your target role.</p>
          </div>

          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Job Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Frontend Engineer"
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    onChange={(e) => setRole(e.target.value)}
                    value={role}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 Years"
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Interview Type
              </label>
              <div className="flex p-1 bg-slate-100 rounded-xl">
                {["Technical", "HR"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setMode(t)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      mode === t
                        ? "bg-white shadow-sm text-indigo-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t} Interview
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!analysisDone ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                  className="group relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                >
                  <FaFileUpload className="text-3xl mx-auto text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors" />
                  <input
                    type="file"
                    accept="application/pdf"
                    id="resumeUpload"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <p className="text-slate-600 font-medium">
                    {resumeFile
                      ? resumeFile.name
                      : "Upload Resume (Recommended)"}
                  </p>

                  {resumeFile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadResume();
                      }}
                      className="mt-3 px-6 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
                    >
                      {analyzing ? "Extracting Data..." : "Analyze Resume"}
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-3">
                    <FaCheckCircle /> Resume Processed
                  </div>
                  <div className="space-y-3">
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 8).map((s, i) => (
                          <span
                            key={i}
                            className="bg-white/60 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md border border-emerald-200 uppercase font-bold tracking-tight"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={
                !role || !experience || loading ? {} : { scale: 1.01 }
              }
              whileTap={!role || !experience || loading ? {} : { scale: 0.98 }}
              className="w-full bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-xl shadow-indigo-100 mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Launch Interview"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Step1SetUp;
