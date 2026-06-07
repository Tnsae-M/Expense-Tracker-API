import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
const authReqLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  // skip: (req, res) => res.statusCode === 200,
  message:
    "Too many authentication requests. please try again after 15 minutes",
  legacyHeaders: false,
  standardHeaders: true,
});
export { globalLimiter, authReqLimiter };
