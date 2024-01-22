// import { allowedOrigins } from "../config/allowedOrigins";
import { Request, Response, NextFunction } from "express";

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  // if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Origin', origin);
  // }
  next()
}

export {credentials}