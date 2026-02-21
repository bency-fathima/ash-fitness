import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/features/auth/auth.selectores";
import { Button } from "../components/ui/button";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { changePassword, editProfile, refreshProfile } from "@/redux/features/auth/auth.thunk";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangePasswordMode, setIsChangePasswordMode] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
      .replace(/\//g, ".");
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleEditProfile = () => {
    setProfileForm({
      name: user?.name || "",
      dob: formatDateForInput(user?.dob) || "",
      gender: user?.gender || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditMode(true);
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(editProfile(profileForm)).unwrap();
      await dispatch(refreshProfile({id:user?._id, role:user.role})).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error(error?.message || "Failed to update profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      toast.success("Password changed successfully!");
      setIsChangePasswordMode(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPassword({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (error) {
      toast.error(error?.message || "Failed to change password. Please try again.");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className=" bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Personal Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {user?.name || "User Name"}
              </h1>
              <Button
                variant="outline"
                onClick={handleEditProfile}
                className="text-sm font-medium bg-[#EBF3F2] border-0 hover:bg-[#d4e3e1]"
              >
                Edit Profile
              </Button>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#9e5608] mb-6">
                Personal Info
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                  <span className="text-sm text-gray-600 font-normal">
                    Date of Birth
                  </span>
                  <span className="text-sm text-gray-900 font-normal text-right">
                    {formatDate(user?.dob)}
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                  <span className="text-sm text-gray-600 font-normal">
                    Gender
                  </span>
                  <span className="text-sm text-gray-900 font-normal text-right">
                    {user?.gender || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                  <span className="text-sm text-gray-600 font-normal">
                    Email Address
                  </span>
                  <span className="text-sm text-gray-900 font-normal text-right break-all">
                    {user?.email || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                  <span className="text-sm text-gray-600 font-normal">
                    Phone Number
                  </span>
                  <span className="text-sm text-gray-900 font-normal text-right">
                    {user?.phone || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600 font-normal">
                    Address
                  </span>
                  <span className="text-sm text-gray-900 font-normal text-right max-w-xs">
                    {user?.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-[#9e5608]">
                Account Info
              </h2>
              <Button
                variant="outline"
                onClick={() => setIsChangePasswordMode(true)}
                className="text-sm font-medium bg-[#EBF3F2] border-0 hover:bg-[#d4e3e1]"
              >
                Change Password
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-normal text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value="**********"
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer */}
      {isEditMode && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsEditMode(false)}
          />

          {/* Drawer */}
          <div className="relative w-full sm:w-[500px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsEditMode(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Date of Birth
                  </label>
                  <input
                    required
                    type="date"
                    name="dob"
                    value={profileForm.dob}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Gender
                  </label>
                  <select
                    required
                    name="gender"
                    value={profileForm.gender}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    readOnly
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Address
                  </label>
                  <textarea
                    required
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button
                type="submit"
                onClick={handleProfileSubmit}
                className="flex-1 bg-[#9e5608] text-white hover:bg-[#083d38]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Drawer */}
      {isChangePasswordMode && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsChangePasswordMode(false)}
          />

          {/* Drawer */}
          <div className="relative w-full sm:w-[500px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Change Password
              </h2>
              <button
                onClick={() => setIsChangePasswordMode(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="flex-1 overflow-y-auto p-6"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword.currentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword.newPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword.confirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <Button
                type="submit"
                onClick={handlePasswordSubmit}
                className="flex-1 bg-[#9e5608] text-white hover:bg-[#083d38]"
              >
                Update Password
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
