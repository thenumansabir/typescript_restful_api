import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.services";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer_token: any = req.headers.authorization;
  const token = bearer_token.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Unauthorized: Token is invalid" });
    }
    if (decoded) {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.headers.decoded_token = decoded;
    }
    next();
  });
};
