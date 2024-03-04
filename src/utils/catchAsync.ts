import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync = (cb: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) =>
    cb(req, res, next).catch((error) => next(error));
};

export default catchAsync;
