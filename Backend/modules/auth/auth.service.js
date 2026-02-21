import bcrypt from "bcryptjs";
import User from "./auth.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import redisClient from "../../redis/redisClient.js";
import { generatePassword } from "../../utils/password.js";
import { AdminModel } from "../../modules/admin/admin.model.js";
import { HeadsModel } from "../Heads/heads.modal.js";
import { CoachModel } from "../coach/coach.model.js";
import { FounderModel } from "../../seeds/createAdmin.js";
import { calculateExtraClientIncentive } from "../incentive/incentive.service.js";
import { sendEmail } from "../../utils/email.js";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";

export const adminCreateUser = async (userData) => {
 try {
   const exists = await User.findOne({ email: userData.email });
   if (exists) throw new Error("Email already exists");
   const password = generatePassword();
   console.log("Generated Password for User:", password);
   const hashed = await bcrypt.hash(password, 10);

   const initialWeight = userData.currentWeight;
   const user = await User.create({
     name: capitalizeFirst(userData.fullname),
     email: userData.email,
     password: hashed,
     role: "user",
     status: "Active",
     dob: userData.dob,
     gender: userData.gender,
     phone: userData.phone,
     address: userData.address,
     currentWeight: initialWeight,
     targetWeight: userData.targetWeight,
     weightHistory: initialWeight
       ? [
           {
             weight: initialWeight,
             date: new Date(),
             isInitial: true,
           },
         ]
       : [],
     medicalConditions: userData.medicalconditions,
     allergies: userData.allergy,
     goals: userData.fitnessGoal,
     foodPreferences: userData.foodPreference,
     profileImage: userData?.profileImage || "",
     programType: userData.programType,
     therapyType: userData.therapyType || null,
     duration: userData.duration,
     programEndDate: userData.endDate,
     programStartDate: userData.startDate,
     dietition: userData.dietician || null,
     trainer: userData.trainer || null,
     therapist: userData.therapist || null,
     autoSendGuide: userData.autoSendGuide || false,
     automatedReminder: userData.automatedReminder || false,
     autoSendWelcome: userData.autoSendWelcome || false,
   });
   const coaches = [
     userData.dietician,
     userData.trainer,
     userData.therapist,
   ].filter(Boolean);

   for (const coachId of coaches) {
     await CoachModel.findByIdAndUpdate(
       coachId,
       { $addToSet: { assignedUsers: user._id } },
       { new: true },
     );

     // Recalculate extra client incentive
     await calculateExtraClientIncentive(coachId);
   }

   await sendEmail({
    to: userData.email,
    subject: "Welcome to TwoFit - Your Login Credentials",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9e5608; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials-box { background-color: white; border-left: 5px solid #9e5608; padding: 20px; margin: 20px 0; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to TwoFit!</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${userData.fullname}</strong>,</p>
            <p>Your User account has been successfully created. Here are your login credentials:</p>
            
            <div class="credentials-box">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${userData.email}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
            </div>
            
            <p>Please log in and change your password immediately for security purposes.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/login" style="background-color: #9e5608; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TwoFit. All rights reserved.</p>
            <p>This email was sent to ${userData.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
   });

   return user;
 } catch (error) {
   throw error;
 }
};

export const loginUser = async ({ email, password }) => {
  const user =
    (await User.findOne({ email }).select("+password")) ||
    (await AdminModel.findOne({ email }).select("+password")) ||
    (await HeadsModel.findOne({ email }).select("+password")) ||
    (await FounderModel.findOne({ email }).select("+password")) ||
    (await CoachModel.findOne({ email }).select("+password"));

  if (!user) throw new Error("Invalid credentials");
  if (user.status !== "Active")
    throw new Error("Your account is inactive. Contact admin.");
  const roles = Array.isArray(user.role) ? user.role : [user.role];

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Ensure Redis is connected before storing
  if (!redisClient.isOpen) {
    console.error("Redis not connected, attempting to connect...");
    await redisClient.connect();
  }

  await redisClient.set(`refresh:${user._id}`, refreshToken, {
    EX: 7 * 24 * 60 * 60, // 7 days
  });

  console.log("Refresh token stored in Redis for user:", user._id);

  return { user, accessToken, refreshToken };
};

export const forgotPassword = async (email) => {
  const user =
    (await User.findOne({ email })) ||
    (await AdminModel.findOne({ email })) ||
    (await HeadsModel.findOne({ email })) ||
    (await FounderModel.findOne({ email })) ||
    (await CoachModel.findOne({ email }));

  if (!user) {
    throw new Error("User is not registered");
  }

  const rateLimitKey = `otp:ratelimit:${email}`;
  const requestCount = await redisClient.get(rateLimitKey);

  if (requestCount && parseInt(requestCount) >= 100) {
    throw new Error("Too many OTP requests. Please try again after 1 hour");
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const hashedOTP = await bcrypt.hash(otp, 10);

  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, hashedOTP, {
    EX: 15 * 60, // 15 minutes
  });

  await redisClient.set(`otp:user:${email}`, user._id.toString(), {
    EX: 15 * 60,
  });

  if (!requestCount) {
    await redisClient.set(rateLimitKey, "1", { EX: 60 * 60 }); // 1 hour
  } else {
    await redisClient.incr(rateLimitKey);
  }

  await sendEmail({
    to: user.email,
    subject: "TwoFit - Password Reset OTP",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9e5608; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-box { background-color: white; border: 2px dashed #9e5608; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; }
          .warning { color: #d32f2f; font-size: 14px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TwoFit Password Reset</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${user.name || "User"}</strong>,</p>
            <p>We received a request to reset your password. Use the OTP below to verify your identity:</p>
            <div class="otp-box">${otp}</div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP is valid for <strong>15 minutes</strong></li>
              <li>Do not share this OTP with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
            <div class="warning">
              ⚠️ This is an automated security email. If you didn't request a password reset, your account may be at risk. Please contact support immediately.
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} TwoFit. All rights reserved.</p>
            <p>This email was sent to ${user.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  return { message: "OTP has been sent" };
};

export const verifyOTP = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  if (!/^\d{4}$/.test(otp)) {
    throw new Error("OTP must be 4 digits");
  }

  // Check for brute force attempts
  const attemptKey = `otp:attempts:${email}`;
  const attempts = await redisClient.get(attemptKey);

  if (attempts && parseInt(attempts) >= 5) {
    throw new Error("Too many failed attempts. Please request a new OTP");
  }

  const otpKey = `otp:${email}`;
  const storedHashedOTP = await redisClient.get(otpKey);

  if (!storedHashedOTP) {
    throw new Error("OTP expired or not found. Please request a new one");
  }

  const isValid = await bcrypt.compare(otp, storedHashedOTP);

  if (!isValid) {
    if (!attempts) {
      await redisClient.set(attemptKey, "1", { EX: 15 * 60 });
    } else {
      await redisClient.incr(attemptKey);
    }

    const remainingAttempts = 5 - parseInt(attempts || 0) - 1;
    throw new Error(`Invalid OTP. ${remainingAttempts} attempts remaining`);
  }

  await redisClient.set(`otp:verified:${email}`, "true", { EX: 5 * 60 }); // 5 minutes to complete password reset

  await redisClient.del(attemptKey);

  return { message: "OTP verified successfully" };
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  try {
    if (!email || !otp || !newPassword) {
      throw new Error("Email, OTP, and new password are required");
    }

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const verifiedKey = `otp:verified:${email}`;
    const isVerified = await redisClient.get(verifiedKey);

    if (!isVerified) {
      throw new Error("OTP not verified. Please verify OTP first");
    }

    const otpKey = `otp:${email}`;
    const storedHashedOTP = await redisClient.get(otpKey);

    if (!storedHashedOTP) {
      throw new Error("OTP expired. Please request a new one");
    }

    const isValidOTP = await bcrypt.compare(otp, storedHashedOTP);
    if (!isValidOTP) {
      throw new Error("Invalid OTP");
    }

    const user =
      (await User.findOne({ email })) ||
      (await AdminModel.findOne({ email })) ||
      (await HeadsModel.findOne({ email })) ||
      (await FounderModel.findOne({ email })) ||
      (await CoachModel.findOne({ email }));

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await redisClient.del(`refresh:${user._id}`);

    await redisClient.del(otpKey);
    await redisClient.del(verifiedKey);
    await redisClient.del(`otp:user:${email}`);
    await redisClient.del(`otp:attempts:${email}`);

    await sendEmail({
      to: user.email,
      subject: "TwoFit - Password Reset Successful",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #9e5608; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .success { color: #2e7d32; font-size: 18px; font-weight: bold; margin: 20px 0; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${user.name || "User"}</strong>,</p>
              <div class="success">✓ Your password has been successfully reset!</div>
              <p>You can now log in to your TwoFit account using your new password.</p>
              <div class="warning">
                <strong>Security Notice:</strong><br>
                If you did not perform this password reset, please contact our support team immediately at support@twofit.com
              </div>
              <p>For your security:</p>
              <ul>
                <li>All active sessions have been logged out</li>
                <li>You will need to log in again with your new password</li>
                <li>Never share your password with anyone</li>
              </ul>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} TwoFit. All rights reserved.</p>
              <p>Password reset completed at ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return {
      message:
        "Password reset successfully. Please login with your new password",
    };
  } catch (err) {
    console.error("Password reset error:", err);
    throw err;
  }
};

export const editUserProfile = async (userId, profileData) => {
    const user =
      (await User.findById(userId)) ||
      (await AdminModel.findById(userId)) ||
      (await HeadsModel.findById(userId)) ||
      (await FounderModel.findById(userId)) ||
      (await CoachModel.findById(userId));
  if (!user) {
    throw new Error("User not found");
  }

  Object.keys(profileData).forEach((key) => {
    if (user[key] === undefined) {
      user.set(key, profileData[key]);
    } else {
      user[key] = profileData[key];
    }
  });

  await user.save();
  return user;
};


export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const user =
    (await User.findById(userId).select("+password")) ||
    (await AdminModel.findById(userId).select("+password")) ||
    (await HeadsModel.findById(userId).select("+password")) ||
    (await FounderModel.findById(userId).select("+password")) ||
    (await CoachModel.findById(userId).select("+password"));

  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }
  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password changed successfully" };
}