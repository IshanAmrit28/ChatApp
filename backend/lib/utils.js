import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent XSS attacks
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "strict", // required for cross-domain cookies
    secure: process.env.NODE_ENV !== "development", // required for sameSite="none"
  });

  return token;
};
