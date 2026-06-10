import { Request, Response, NextFunction } from "express";
type asyncReqHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;
export const catchAsync = (fun: asyncReqHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fun(req, res, next)).catch(next);
  };
};
