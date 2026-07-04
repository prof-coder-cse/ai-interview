import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/interview/get-interview",
          { withCredentials: true },
        );
        setInterviews(result.data);
      } catch (error) {
        console.error("Error fetching historical interview index:", error);
      } finally {
        setLoading(false);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-white py-10 text-slate-900 antialiased">
      <div className="w-[90vw] lg:w-[70vw] max-w-5xl mx-auto">
        {/* Navigation & Header Section */}
        <div className="mb-10 w-full flex items-start gap-4 flex-wrap border-b border-slate-100 pb-6">
          <button
            onClick={() => navigate("/")}
            className="p-3 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
            aria-label="Back to landing"
          >
            <FaArrowLeft className="text-sm" />
          </button>

          <div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Performance Log
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Interview History
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track past mock instances, structural reviews, and archived score
              sheets
            </p>
          </div>
        </div>

        {/* Dynamic State Rendering Block */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-slate-400 text-sm font-medium">
              Retrieving past records...
            </p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="bg-slate-50/50 border border-slate-200/60 p-12 rounded-2xl text-center max-w-xl mx-auto">
            <p className="text-slate-500 font-medium">
              No interview records logged yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
            >
              Start Your First Mock
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {interviews.map((item, index) => (
              <div
                key={item._id || index}
                onClick={() => navigate(`/report/${item._id}`)}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.role || "General Assessment Profile"}
                    </h3>

                    {/* Metadata Sub-Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <FaBriefcase className="text-slate-400 text-xs" />
                        {item.experience || "Entry"} Level
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1.5 capitalize">
                        <FaGraduationCap className="text-slate-400 text-sm" />
                        {item.mode || "standard"} Mode
                      </span>
                    </div>

                    {/* Datetime Stamp Container */}
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <FaCalendarAlt />
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Quantitative Badge Deck */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-lg sm:text-xl font-black text-blue-600 tracking-tight">
                        {item.finalScore || 0}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          / 10
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Overall Score
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        item.status === "completed"
                          ? "bg-blue-50 border border-blue-100 text-blue-700"
                          : "bg-amber-50 border border-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;
