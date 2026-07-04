import React from "react";
import {
  FaArrowLeft,
  FaDownload,
  FaAward,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 text-lg font-medium">
          Analyzing interview metrics...
        </p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    {
      label: "Confidence",
      value: confidence,
      color: "bg-indigo-600",
      text: "text-indigo-600",
    },
    {
      label: "Communication",
      value: communication,
      color: "bg-purple-600",
      text: "text-purple-600",
    },
    {
      label: "Correctness",
      value: correctness,
      color: "bg-blue-600",
      text: "text-blue-600",
    },
  ];

  const getPerformanceConfig = (score) => {
    if (score >= 8) {
      return {
        text: "Ready for job opportunities.",
        tagline: "Excellent clarity and structured responses.",
        color: "text-blue-600",
        bgColor: "bg-blue-50/60 border-blue-100",
        icon: <FaAward className="text-blue-600 text-xl" />,
        advice:
          "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.",
      };
    } else if (score >= 5) {
      return {
        text: "Needs minor improvement before interviews.",
        tagline: "Good foundation, refine articulation.",
        color: "text-amber-600",
        bgColor: "bg-amber-50/60 border-amber-100",
        icon: <FaCheckCircle className="text-amber-500 text-xl" />,
        advice:
          "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.",
      };
    } else {
      return {
        text: "Significant improvement required.",
        tagline: "Work on clarity and confidence.",
        color: "text-rose-600",
        bgColor: "bg-rose-50/60 border-rose-100",
        icon: <FaExclamationTriangle className="text-rose-500 text-xl" />,
        advice:
          "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.",
      };
    }
  };

  const performance = getPerformanceConfig(finalScore);
  const percentage = (finalScore / 10) * 100;

  // PDF Generator updated with AceInterview corporate styling
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;

    // Brand Title Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900 (Deep Navy)
    doc.text("AceInterview Performance Report", margin, currentY);

    currentY += 4;
    doc.setDrawColor(37, 99, 235); // Accent Blue
    doc.setLineWidth(0.75);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    // Score Summary Callout Box
    currentY += 15;
    doc.setFillColor(239, 246, 255); // Light Blue-50 background
    doc.roundedRect(margin, currentY, contentWidth, 22, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(29, 78, 216); // Blue-700 text
    doc.text(
      `Overall Assessment Score: ${finalScore} / 10`,
      pageWidth / 2,
      currentY + 13,
      { align: "center" },
    );

    // Sub-Metrics
    currentY += 32;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(margin, currentY, contentWidth, 32, 4, 4, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `• Confidence Evaluation: ${confidence}/10`,
      margin + 10,
      currentY + 10,
    );
    doc.text(
      `• Communication Breakdown: ${communication}/10`,
      margin + 10,
      currentY + 18,
    );
    doc.text(
      `• Technical Correctness: ${correctness}/10`,
      margin + 10,
      currentY + 26,
    );

    // AI Advice Text Area
    currentY += 42;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(
      "Personalized Coaching Recommendations",
      margin + 8,
      currentY + 10,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const splitAdvice = doc.splitTextToSize(
      performance.advice,
      contentWidth - 16,
    );
    doc.text(splitAdvice, margin + 8, currentY + 18);

    // Question Analytics Table Matrix
    currentY += 45;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Interview Question", "Score", "AI Feedback Analysis"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question || "N/A",
        `${q.score ?? 0}/10`,
        q.feedback || "Metrics look solid across all answer indices.",
      ]),
      styles: { fontSize: 9, cellPadding: 5, valign: "top" },
      headStyles: { fillColor: [15, 23, 42], textColor: 255, halign: "left" }, // deep navy theme head
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 60 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(
      `AceInterview_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
    );
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-8 text-slate-900 antialiased">
      {/* Top Brand Context Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className="p-3 rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
            aria-label="Back"
          >
            <FaArrowLeft className="text-sm" />
          </button>
          <div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Analytics Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Interview Performance Insights
            </h1>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-sm font-semibold text-sm self-start md:self-auto transition-colors duration-200"
        >
          <FaDownload /> Download PDF Report
        </button>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Hand Metrics Module */}
        <div className="space-y-6">
          {/* Circular Score Widget */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-sm"
          >
            <h3 className="text-slate-400 font-bold tracking-wider uppercase text-xs mb-6">
              Overall Score
            </h3>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${finalScore}/10`}
                styles={buildStyles({
                  textSize: "20px",
                  fontWeight: "700",
                  pathColor: "#2563eb", // Ace Brand Blue
                  textColor: "#0f172a", // Ace Brand Navy
                  trailColor: "#f1f5f9",
                })}
              />
            </div>

            <div
              className={`mt-6 p-4 rounded-xl border ${performance.bgColor} flex items-start gap-3 text-left`}
            >
              <div className="mt-0.5">{performance.icon}</div>
              <div>
                <p className={`font-bold text-sm ${performance.color}`}>
                  {performance.text}
                </p>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  {performance.tagline}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Core Skill Bars Widget */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-900 mb-5">
              Skill Metrics Breakdown
            </h3>

            <div className="space-y-5">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5 text-sm">
                    <span className="font-medium text-slate-600">
                      {s.label}
                    </span>
                    <span className={`font-bold ${s.text}`}>{s.value}/10</span>
                  </div>

                  <div className="bg-slate-100 h-2.5 w-full rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value * 10}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${s.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Hand Detailed Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recharts Analytics Progression */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Performance Curve Map
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={questionScoreData}
                  margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="aceBlueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      color: "#fff",
                      border: "none",
                    }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#aceBlueGradient)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Structured QA Breakdown List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm"
          >
            <h3 className="text-sm font-bold text-slate-900 mb-5">
              Granular Prompt & AI Evaluation
            </h3>
            <div className="space-y-4">
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-slate-50/60 p-4 sm:p-5 rounded-xl border border-slate-200/60 hover:border-blue-200/60 transition-colors duration-150"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Question {i + 1}
                      </span>
                      <p className="font-semibold text-slate-900 text-sm sm:text-base mt-0.5 leading-snug">
                        {q.question || "Untitled Question Block"}
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-xs sm:text-sm whitespace-nowrap self-start">
                      {q.score ?? 0} / 10
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/60 rounded-lg p-3.5 shadow-sm">
                    <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wide mb-1">
                      AI Feedback Engine
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {q.feedback?.trim()
                        ? q.feedback
                        : "No structured critique issues flagged for this answer sequence."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Step3Report;
