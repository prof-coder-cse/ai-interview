import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-10 pb-10">
      <div className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 py-10 px-6 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={16} />
          </div>
          <h2 className="font-semibold text-lg">AceInterview</h2>
        </div>

        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
          An AI-powered interview preparation platform that helps you practice
          real interview scenarios, improve communication skills, and build
          strong technical confidence.
        </p>

        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} AceInterview.AI All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
