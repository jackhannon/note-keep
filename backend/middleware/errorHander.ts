/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { AppError } from "./appErr";

const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => { 
  const status = error.status || 500;
  const message = error.message || "Something went wrong"
  res.status(status).send(message);
};

export { errorHandler };