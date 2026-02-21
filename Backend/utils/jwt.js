import jwt from 'jsonwebtoken'
import redisClient from '../redis/redisClient.js';

export const generateAccessToken = (user) => {
  const id = user._id || user.id;
  return jwt.sign(
    { id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
};

export const generateRefreshToken = (user) => {
  const id = user._id || user.id;
  return jwt.sign({ id, role: user.role, email: user.email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  });
};


export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("No refresh token in cookies");
    return null;
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Ensure Redis is connected
    if (!redisClient.isOpen) {
      console.log("Redis client disconnected, attempting to reconnect...");
      await redisClient.connect();
    }

    // Get stored token from Redis
    const storedToken = await redisClient.get(`refresh:${decoded.id}`);

    if (!storedToken) {
      console.log("No stored refresh token found in Redis for user:", decoded.id);
      return null;
    }

    if (storedToken !== refreshToken) {
      console.log("Refresh token mismatch for user:", decoded.id);
      return null;
    }

    const userPayload = { id: decoded.id, role: decoded.role, email: decoded.email };

    // Generate NEW Access Token
    const newAccessToken = generateAccessToken(userPayload);

    // Check if refresh token needs rotation (if < 3 days remaining)
    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = decoded.exp - now;
    const ROTATION_THRESHOLD = 3 * 24 * 60 * 60; // 3 days

    if (timeRemaining < ROTATION_THRESHOLD) {
      // Like strict rotation: Generate NEW tokens
      const newRefreshToken = generateRefreshToken(userPayload);

      // Update Redis
      await redisClient.set(`refresh:${decoded.id}`, newRefreshToken, {
        EX: 7 * 24 * 60 * 60, // 7 days
      });

      // Set new Cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
    }

    res.setHeader("x-access-token", newAccessToken);

    return userPayload; // Return the decoded payload so authMiddleware can fetch the user
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return null;
  }
};