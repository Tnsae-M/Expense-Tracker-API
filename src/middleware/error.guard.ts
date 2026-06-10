import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => {
      field: issue.path.join(".");
      message: issue.message;
    });
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: formattedErrors,
    });
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
  console.log("unhandled error: ", err.message);
  return res.status(statusCode).json({
    success: false,
    message: "Something went wrong",
  });
}
