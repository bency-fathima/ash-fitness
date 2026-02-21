import redisClient from "../../redis/redisClient.js";
import * as service from "./auth.service.js";

export const createUserByAdmin = async (req, res) => {
  try {
    const user = await service.adminCreateUser(req.body);
    res.status(201).json({
      success: true,
      message: "Client account created successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const loginController = async (req, res) => {
  try {
    let data = await service.loginUser(req.body);


    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    delete data.refreshToken;

    res.json({ success: true, message: "Login successful", data });
  } catch (err) {

    res.status(400).json({ success: false, message: err.message });
  }
};

export const adminLoginController = async (req, res) => {
  try {
    let data = await service.adminLogin(req.body);

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    delete data.refreshToken;

    res.json({ success: true, message: "Admin Login successful", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    const userId = req.user.id;
    await redisClient.del(`refresh:${userId}`);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await service.forgotPassword(email);

    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await service.verifyOTP({ email, otp });
    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required"
      });
    }

    const result = await service.resetPassword({ email, otp, newPassword });

    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const editProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    const updatedUser = await service.editUserProfile(userId, updateData);

    res.json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const editPasswordController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const result = await service.changeUserPassword(userId, currentPassword, newPassword);
    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};