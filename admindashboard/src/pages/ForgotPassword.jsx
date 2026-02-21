import React, { useEffect, useState, useRef } from "react";
import { assets } from "../assets/asset";
import { useDispatch } from "react-redux";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword, verifyOTP } from "@/redux/features/auth/auth.thunk";
import { toast } from "react-toastify";

const ForgotPasswordEmail = () => {
  useEffect(() => {
    document.title = "Forgot Password | fitness";
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", ""],
    newPassword: "",
    confirmPassword: "",
  });

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Send OTP to email
      await dispatch(forgotPassword({ email: formData.email })).unwrap();
      setStep(2);
    } catch (err) {
      setError(err || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d$/.test(value)) return; // Only allow numbers

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const otpCode = formData.otp.join("");
    if (otpCode.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    setLoading(true);
    try {
      await dispatch(verifyOTP({ email: formData.email, otp: otpCode })).unwrap();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const otpCode = formData.otp.join("");
      await dispatch(resetPassword({ email: formData.email, otp: otpCode, newPassword: formData.newPassword })).unwrap(); 
      
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="h-screen w-full flex items-center justify-center lg:justify-between overflow-hidden">
      {/* image */}
      <div className="hidden lg:flex lg:w-[50%] lg:h-full bg-[#9e5608] flex-col items-center justify-start pt-20 xl:pt-30 gap-16 xl:gap-25 px-12 xl:px-16.5">
        <h1 className="text-white font-bold text-[52px] xl:text-[60px] tracking-[-4%] text-center BricolageGrotesque leading-[100%]">
          Your <br /> Transformation <br /> Starts Now
        </h1>
        <div className="w-full pb-0 p-[3px] bg-[#FFCDFD33] rounded-t-xl overflow-hidden flex justify-center">
          <img
            src={assets.loginPageImg}
            alt="login page image"
            className="rounded-t-xl object-cover object-center w-full"
          />
        </div>
      </div>
      {/* content */}
      <div className="w-full lg:w-[50%] h-full flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-8 md:px-16 lg:px-20 xl:px-30 py-8 sm:py-12 lg:py-0">
        {/* heading */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[500px]">
          <img
            src={assets.NavBarLogo}
            alt="logo"
            className="w-[100px] sm:w-[120px] lg:w-[133px]"
          />
          <div className="flex items-center flex-col justify-center gap-2">
            <h2 className="font-bold text-[20px] sm:text-[22px] lg:text-[24px] tracking-[-4%] leading-[118%] text-[#9e5608] text-center">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Password reset"}
              {step === 3 && "Set new password"}
            </h2>
            <p className="text-[11px] sm:text-[12px] text-[#63716E] leading-[150%] text-center">
              {step === 1 && "No worries, we'll send you reset instructions."}
              {step === 2 && `We sent a code to ${formData.email}`}
              {step === 3 && "Must be at least 8 characters."}
            </p>
          </div>
        </div>
        {/* form */}
        <div className="flex flex-col items-center w-full max-w-[500px] gap-6">
          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col w-full gap-5 sm:gap-6"
            >
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="email" className="text-[11px] font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  className="border w-full rounded-md h-10 sm:h-11 p-3 sm:p-4 text-[12px] sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#9e5608] focus:border-transparent"
                  placeholder="yourname@example.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#9e5608] w-full py-3 sm:py-3.5 rounded-lg text-white font-semibold text-[14px] sm:text-[15px] lg:text-[16px] hover:bg-[#083d38] transition-colors duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Reset Password"}
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <GoArrowLeft className="w-5 h-5" />
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-bold cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <form
              onSubmit={handleOtpSubmit}
              className="flex flex-col w-full gap-5 sm:gap-6"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-3 justify-center w-full">
                  {formData.otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl sm:text-3xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9e5608] focus:border-[#9e5608] transition-all"
                      required
                    />
                  ))}
                </div>
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#9e5608] w-full py-3 sm:py-3.5 rounded-lg text-white font-semibold text-[14px] sm:text-[15px] lg:text-[16px] hover:bg-[#083d38] transition-colors duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="flex gap-2 mt-2 w-full justify-center">
                <p className="text-gray-500">Didn't receive the email? </p>
                <p className="font-bold underline cursor-pointer" onClick={handleEmailSubmit}>Click to resend</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <GoArrowLeft className="w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-bold cursor-pointer"
                >
                  Back to Email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password Input */}
          {step === 3 && (
            <form
              onSubmit={handlePasswordReset}
              className="flex flex-col w-full gap-5 sm:gap-6"
            >
              <div className="relative flex flex-col items-start gap-2">
                <label htmlFor="newPassword" className="text-[11px] font-medium">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  required
                  value={formData.newPassword}
                  className="border w-full rounded-md h-10 sm:h-11 p-3 sm:p-4 pr-12 text-[12px] sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#9e5608] focus:border-transparent"
                  placeholder="Enter new password"
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute bottom-2.5 sm:bottom-3 right-3 p-1 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={assets.HiddenIcon}
                    alt="Toggle password visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              <div className="relative flex flex-col items-start gap-2">
                <label htmlFor="confirmPassword" className="text-[11px] font-medium">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  className="border w-full rounded-md h-10 sm:h-11 p-3 sm:p-4 pr-12 text-[12px] sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#9e5608] focus:border-transparent"
                  placeholder="Confirm new password"
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute bottom-2.5 sm:bottom-3 right-3 p-1 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={assets.HiddenIcon}
                    alt="Toggle password visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#9e5608] w-full py-3 sm:py-3.5 rounded-lg text-white font-semibold text-[14px] sm:text-[15px] lg:text-[16px] hover:bg-[#083d38] transition-colors duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                <GoArrowLeft className="w-5 h-5" />
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-bold cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
