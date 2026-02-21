import React, { useEffect, useState } from "react";
import { assets } from "../assets/asset";
import { login } from "@/redux/features/auth/auth.thunk";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  useEffect(() => {
    document.title = "Login | Twofit";
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const ROLE_REDIRECT = {
    founder: "/founder",
    head: "/head",
    admin: "/admin",
    expert: "/expert",
    user: "/client",
  };

  const resolveRole = (role) => {
    if (!role) return null;

    const normalizedRole = role.toLowerCase();

    if (["therapist", "dietician", "trainer"].includes(normalizedRole)) {
      return "expert";
    }

    return normalizedRole;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();

      const finalRole = resolveRole(result.user.role);

      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("role", finalRole);

      const redirectPath = ROLE_REDIRECT[finalRole];

      if (!redirectPath) {
        throw new Error("Unknown role");
      }

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.message || "Invalid email or password");
    }
  };

  return (
    <div className="h-[100vh] w-full flex items-center justify-center lg:justify-between overflow-hidden">
      {/* image */}
      <div className="hidden lg:flex lg:w-[50%] lg:h-full bg-[#9e5608] flex-col items-center justify-start pt-20 xl:pt-30 gap-16 xl:gap-12 px-12 xl:px-16.5">
        <h1 className="text-white font-bold text-[52px] xl:text-[60px] tracking-[-4%] text-center BricolageGrotesque leading-[100%]">
        Earn Your Results <br/> Every Rep Counts
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
          <img src={assets.NavBarLogo} alt="logo" className="w-[100px] sm:w-[120px] lg:w-[133px]" />
          <div className="flex items-center flex-col justify-center gap-2">
            <h2 className="font-bold text-[20px] sm:text-[22px] lg:text-[24px] tracking-[-4%] leading-[118%] text-[#9e5608] text-center">
              Login to Your Account
            </h2>
            <p className="text-[11px] sm:text-[12px] text-[#63716E] leading-[150%] text-center">
              Access your dashboard securely.
            </p>
          </div>
        </div>
        {/* form */}
        <div className="flex flex-col items-center w-full max-w-[500px] gap-6">
          <form onSubmit={handleLogin} className="flex flex-col w-full gap-5 sm:gap-6">
            <div className="flex flex-col items-start gap-2">
              <label htmlFor="email" className="text-[11px] font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="border w-full rounded-md h-10 sm:h-11 p-3 sm:p-4 text-[12px] sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#9e5608] focus:border-transparent"
                placeholder="yourname@example.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="relative flex flex-col items-start gap-2">
              <label htmlFor="password" className="text-[11px] font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="border w-full rounded-md h-10 sm:h-11 p-3 sm:p-4 pr-12 text-[12px] sm:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#9e5608] focus:border-transparent"
                placeholder="Enter your password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute bottom-2.5 sm:bottom-3 right-3 p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src={assets.HiddenIcon} alt="Toggle password visibility" className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 appearance-none rounded-[4px] border border-[#DBDEDD] bg-[#F0F0F0] cursor-pointer"
                />
                <label htmlFor="remember" className="text-[11px] sm:text-[12px] cursor-pointer">Remember me</label>
              </div>
              <button type="button" className="text-[11px] sm:text-[12px] font-semibold text-[#9e5608] hover:underline" onClick={()=>navigate("/forgot-password")}>
                Forgot Password?
              </button>
            </div>
            <div className="w-full">
              <button
                type="submit"
                className="bg-[#9e5608] w-full py-3 sm:py-3.5 rounded-lg text-white font-semibold text-[14px] sm:text-[15px] lg:text-[16px] hover:bg-[#9e6020] transition-colors duration-200 active:scale-[0.98]"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
