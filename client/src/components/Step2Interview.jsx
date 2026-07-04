import React, { useState, useRef, useEffect } from "react";
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash, FaWaveSquare } from "react-icons/fa";
import { BsArrowRight, BsStars } from "react-icons/bs";
import axios from "axios";
import { serverUrl } from "../App";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 120);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  /* ---------------- VOICE SETUP ---------------- */
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const femaleVoice = voices.find((v) =>
        ["zira", "samantha", "female", "google uk english female"].some(
          (name) => v.name.toLowerCase().includes(name),
        ),
      );
      const maleVoice = voices.find((v) =>
        ["david", "mark", "male", "google uk english male"].some((name) =>
          v.name.toLowerCase().includes(name),
        ),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
      } else if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
      } else {
        setSelectedVoice(voices[0]);
        setVoiceGender("female");
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  /* ---------------- SPEECH LOGIC ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      let resolved = false;
      const finish = () => {
        if (resolved) return;
        resolved = true;
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        if (isMicOn) startMic();
        setSubtitle("");
        resolve();
      };

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };
      utterance.onend = finish;
      utterance.onerror = finish; // 👈 handles failures, interruptions, cancel()

      // Safety net in case neither event fires (Chrome bug)
      setTimeout(finish, 15000);

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };
  /* ---------------- INTERVIEW FLOW ---------------- */
  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Welcome, ${userName}. I'm your AI interviewer for today.`,
        );
        await speakText("Let's jump into the first question. Ready?");
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        if (currentIndex === questions.length - 1)
          await speakText("Finally, let's wrap up with a challenging one.");
        await speakText(currentQuestion.question);
        if (isMicOn) startMic();
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  /* ---------------- RECOGNITION ---------------- */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying)
      try {
        recognitionRef.current.start();
      } catch {}
  };
  const stopMic = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };
  const toggleMic = () => {
    isMicOn ? stopMic() : startMic();
    setIsMicOn(!isMicOn);
  };

  /* ---------------- ACTIONS ---------------- */
  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: (currentQuestion.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true },
      );
      setFeedback(result.data.feedback);
      await speakText(result.data.feedback);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    setTimeLeft(questions[currentIndex + 1]?.timeLimit || 120); // ← optional safety reset
    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const finishInterview = async () => {
    stopMic();
    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/finish`,
        { interviewId },
        { withCredentials: true },
      );
      onFinish(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;
    setTimeLeft(currentQuestion.timeLimit || 120); // ← reset timer for new question
    const timer = setInterval(
      () => setTimeLeft((p) => (p > 0 ? p - 1 : 0)),
      1000,
    );
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]); // currentIndex in deps already — just add the reset

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-6 h-full max-h-[900px]">
        {/* LEFT: AI VISUALIZER (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="relative aspect-video lg:aspect-square bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-700 shadow-2xl">
            <video
              ref={videoRef}
              src={videoSource}
              muted
              playsInline
              className="w-full h-full object-cover brightness-90"
            />

            {/* Overlay UI */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6">
              <AnimatePresence>
                {subtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl"
                  >
                    <p className="text-sm font-medium leading-relaxed italic text-white/90">
                      "{subtitle}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Status Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-indigo-600 rounded-full shadow-lg">
              <div
                className={`w-2 h-2 rounded-full ${isAIPlaying ? "bg-white animate-pulse" : "bg-white/50"}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                {isAIPlaying ? "AI Interacting" : "AI Listening"}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-3xl text-center">
              <p className="text-xs text-slate-500 mb-1">Progress</p>
              <p className="text-xl font-bold text-white">
                {currentIndex + 1}/{questions.length}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-3xl text-center flex flex-col items-center justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
                isDark={true}
              />
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-3xl text-center">
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <div className="flex justify-center italic text-sm text-indigo-400 font-medium">
                {isIntroPhase ? "Warmup" : "Interview"}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTION AREA (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-[3rem] p-8 flex flex-col relative overflow-hidden">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
              <BsStars /> Technical Evaluation
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              {isIntroPhase
                ? "Preparing your session..."
                : currentQuestion?.question}
            </h2>
          </div>

          <div className="flex-1 relative group">
            <textarea
              placeholder={
                isMicOn
                  ? "Listening to your voice..."
                  : "Type your professional response..."
              }
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-[2rem] p-8 text-lg text-slate-300 outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-600"
            />

            {isMicOn && !isAIPlaying && (
              <div className="absolute top-6 right-6 flex gap-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      delay: i * 0.1,
                    }}
                    className="w-1 bg-indigo-500 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={toggleMic}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all ${
                isMicOn
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {isMicOn ? (
                <FaMicrophone size={24} />
              ) : (
                <FaMicrophoneSlash size={24} />
              )}
            </button>

            {!feedback ? (
              <button
                onClick={submitAnswer}
                disabled={isSubmitting || !answer.trim()}
                className="flex-1 h-16 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Answer <BsArrowRight />
                  </>
                )}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex gap-4"
              >
                <div className="flex-1 h-16 flex items-center px-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-sm font-medium italic overflow-hidden whitespace-nowrap text-ellipsis">
                  Feedback received?
                </div>
                <button
                  onClick={handleNext}
                  className="px-10 h-16 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2"
                >
                  Next <BsArrowRight />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
