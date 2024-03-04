import { Response } from "express";

const sendReponse = (
  res: Response,
  statusCode: number,
  data: any,
  message: string = "success"
) => {
  res.status(statusCode).json({ status: message, data });
};

export default sendReponse;
