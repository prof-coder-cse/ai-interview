import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BsRobot,
  BsMic,
  BsBarChart,
  BsFileEarmarkText,
  BsArrowRight,
  BsShieldCheck,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import Footer from "../components/Footer";

// Asset imports remain the same
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleStart = (path) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Personalized Resume Analysis
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8"
          >
            Master your interview <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              with AI intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The world’s first AI mock interview platform that listens, analyzes,
            and coaches you through real-world job scenarios.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => handleStart("/interview")}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              Get Started for Free
              <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/history");
              }}
              className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 transition-all"
            >
              View My Progress
            </button>
          </motion.div>
        </div>
      </section>

      {/* Steps Section - Re-engineered for a 'Flow' look */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              {
                icon: <BsMic />,
                title: "Setup Profile",
                desc: "Select your target role and upload your resume for a custom session.",
              },
              {
                icon: <BsRobot />,
                title: "AI Interview",
                desc: "Engage in a voice-based dialogue with our intelligent interviewer.",
              },
              {
                icon: <BsBarChart />,
                title: "Get Insights",
                desc: "Receive a comprehensive scorecard and technical breakdown.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 text-2xl mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-7 left-20 w-full h-[2px] bg-gradient-to-r from-blue-100 to-transparent -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">
              Built for modern candidates.
            </h2>
            <p className="text-slate-500">
              Powerful tools to give you the competitive edge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                image: evalImg,
                title: "Precision Scoring",
                desc: "Our AI evaluates your pitch, technical accuracy, and keyword usage.",
                color: "bg-blue-50",
              },
              {
                image: resumeImg,
                title: "Contextual Awareness",
                desc: "Interviewers that actually read your resume and ask about your projects.",
                color: "bg-indigo-50",
              },
              {
                image: pdfImg,
                title: "Feedback Reports",
                desc: "Generate professional PDF summaries of every session to track growth.",
                color: "bg-slate-50",
              },
              {
                image: analyticsImg,
                title: "Growth Analytics",
                desc: "Visualize your improvement over time with detailed performance graphs.",
                color: "bg-emerald-50",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className={`group p-8 rounded-[2.5rem] ${feature.color} border border-transparent hover:border-slate-200 transition-all flex flex-col`}
              >
                <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-inner">
                  <img
                    src={feature.image}
                    alt=""
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 mb-6 flex-1">{feature.desc}</p>
                <div className="flex items-center text-blue-600 font-semibold gap-2 cursor-pointer">
                  Learn more <BsArrowRight />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Modes - Refined Horizontal Cards */}
      <section className="py-24 bg-slate-900 text-white rounded-[3rem] mx-4 mb-20">
        <div className="max-w-6xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold mb-4">
                Multiple Training Modes
              </h2>
              <p className="text-slate-400 text-lg">
                Whether you're prepping for behavioral rounds or coding
                deep-dives, we have a mode for you.
              </p>
            </div>
            <BsShieldCheck className="text-6xl text-blue-500 opacity-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                img: hrImg,
                title: "HR Behavioral",
                desc: "Focus on soft skills, culture fit, and situational leadership questions.",
              },
              {
                img: techImg,
                title: "Technical Deep-Dive",
                desc: "Rigorous testing of core fundamentals and problem-solving patterns.",
              },
              {
                img: confidenceImg,
                title: "Voice & Tone",
                desc: "Real-time detection of filler words, pace, and vocal confidence.",
              },
              {
                img: creditImg,
                title: "Pro Sessions",
                desc: "Unlock industry-specific mock rounds with our premium AI models.",
              },
            ].map((mode, idx) => (
              <div
                key={idx}
                className="flex gap-6 p-6 rounded-3xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">{mode.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
                <img
                  src={mode.img}
                  className="w-20 h-20 object-contain grayscale brightness-125"
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      {showAuth && <AuthModel onclose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Home;
