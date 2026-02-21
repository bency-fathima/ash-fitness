import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-[#E6EFEE] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        {/* 404 Number with artistic design */}
        <div className="relative">
          <h1 className="BricolageGrotesque font-bold text-[180px] md:text-[220px] text-[#9e5608] leading-none tracking-tight opacity-90">
            404
          </h1>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#FFD7A8] rounded-full opacity-60 blur-2xl"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#F4DBC7] rounded-full opacity-60 blur-2xl"></div>
        </div>

        {/* Message Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="BricolageGrotesque font-bold text-[32px] md:text-[40px] text-[#9e5608] leading-[118%] tracking-[-4%]">
            Oops! Page Not Found
          </h2>
          <p className="text-[16px] text-[#63716E] leading-[150%] max-w-md">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex gap-4 items-center justify-center">
          <div className="w-16 h-1 bg-[#9e5608] rounded-full"></div>
          <div className="w-8 h-1 bg-[#FFD7A8] rounded-full"></div>
          <div className="w-4 h-1 bg-[#F4DBC7] rounded-full"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-[#9e5608] text-[#9e5608] rounded-lg font-semibold text-[16px] hover:bg-[#9e5608] hover:text-white transition-all duration-300 shadow-sm"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#9e5608] text-white rounded-lg font-semibold text-[16px] hover:bg-[#9e5608]/90 transition-all duration-300 shadow-lg"
          >
            <Home size={20} />
            Home
          </button>
        </div>

        {/* Additional Info */}
        <p className="text-[12px] text-[#63716E] mt-4">
          Error Code: 404 • Page Not Found
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
