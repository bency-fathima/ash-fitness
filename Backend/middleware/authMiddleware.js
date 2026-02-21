import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";
import { refreshAccessToken } from "../utils/jwt.js";
import { AdminModel } from "../modules/admin/admin.model.js";
import { HeadsModel } from "../modules/Heads/heads.modal.js";
import { FounderModel } from "../seeds/createAdmin.js";
import { CoachModel } from "../modules/coach/coach.model.js";

const findUserById = async (id) => {
  return (
    (await User.findById(id).select("-password")) ||
    (await AdminModel.findById(id).select("-password")) ||
    (await HeadsModel.findById(id).select("-password")) ||
    (await FounderModel.findById(id).select("-password")) ||
    (await CoachModel.findById(id).select("-password"))
  );
};

export const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = auth.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Access token expired, attempting refresh...");
        const refreshedDecoded = await refreshAccessToken(req, res);
        if (!refreshedDecoded) {
          console.log("Refresh failed - no refresh token or invalid");
          
          res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          });

          return res.status(401).json({ message: "Token expired and refresh failed" });
        }
        console.log("Token refreshed successfully for user:", refreshedDecoded.id);
        decoded = refreshedDecoded;
      } else {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

