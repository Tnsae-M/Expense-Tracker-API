import { Request, Response, NextFunction } from "express";
export const catchAsync = (fun: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fun(req, res, next).catch(next);
  };
};
