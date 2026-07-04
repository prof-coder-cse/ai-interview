import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Fixed: Standardized import from 'framer-motion'
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

  const plans = [
    {
      id: "free",
      name: "Free Pack",
      price: "₹0",
      credits: 100,
      description:
        "Perfect for beginners starting their interview preparation journey.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description:
        "Great for focused practice and consistent skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description:
        "Best value for serious candidates targeting top tier roles.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(
        serverUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "AceInterview",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          // Fixed a case-sensitivity bug on serverUrl / ServerUrl from original code snippet
          const verifypay = await axios.post(
            serverUrl + "/api/payment/verify",
            response,
            { withCredentials: true },
          );
          dispatch(setUserData(verifypay.data.user));

          alert("Payment Successful 🎉 Credits Added!");
          navigate("/");
        },
        theme: {
          color: "#2563eb", // Updated to match website's interactive blue
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6 font-sans">
      {/* Top Header Section */}
      <div className="max-w-6xl mx-auto mb-16 flex items-center justify-between relative">
        <button
          onClick={() => navigate("/")}
          className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-blue-600 shadow-sm hover:shadow transition absolute left-0"
        >
          <FaArrowLeft />
        </button>

        <div className="text-center w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
            Flexible Credit System
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight">
            Choose your plan
          </h1>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Flexible pricing options engineered to match your career and
            preparation goals.
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between border-2 bg-white
                ${
                  isSelected
                    ? "border-blue-600 shadow-xl ring-4 ring-blue-50"
                    : "border-gray-100 hover:border-gray-200 shadow-sm"
                }
                ${plan.default ? "cursor-default" : "cursor-pointer"}
              `}
            >
              <div>
                {/* Custom Badge / Tags */}
                {plan.badge && (
                  <div className="absolute top-6 right-6 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </div>
                )}

                {plan.default && (
                  <div className="absolute top-6 right-6 bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
                    Current Plan
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-[#0f172a]">
                  {plan.name}
                </h3>

                {/* Price & Credits Info */}
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#0f172a]">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">
                    one-time
                  </span>
                </div>

                <div className="mt-1 inline-block bg-blue-50/60 border border-blue-100/50 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm">
                  {plan.credits} Credits
                </div>

                {/* Description */}
                <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                  {plan.description}
                </p>

                {/* Divider */}
                <hr className="my-6 border-gray-100" />

                {/* Features List */}
                <div className="space-y-3.5 text-left">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <FaCheckCircle className="text-blue-600 text-sm mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase / Select Action Button */}
              <div>
                {plan.default ? (
                  <div className="w-full mt-8 py-3 rounded-xl font-semibold text-center bg-gray-50 text-gray-400 border border-gray-200/50 text-sm cursor-not-allowed">
                    Active Plan
                  </div>
                ) : (
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id);
                      } else {
                        handlePayment(plan);
                      }
                    }}
                    className={`w-full mt-8 py-3 rounded-xl font-bold tracking-wide shadow-sm text-sm transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                    }`}
                  >
                    {loadingPlan === plan.id
                      ? "Processing..."
                      : isSelected
                        ? "Proceed to Pay"
                        : "Select Plan"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;
