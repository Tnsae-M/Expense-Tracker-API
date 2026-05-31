import { Request, Response, NextFunction } from "express";
import { appError } from "../utils/appError";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  // //handle
  // if(err.code='P2002'){
  //     return res.status(409).json({
  //         success:false,
  //         message:`Duplicate field value entered: ${err.meta?.target}`
  //     })
  // }
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
