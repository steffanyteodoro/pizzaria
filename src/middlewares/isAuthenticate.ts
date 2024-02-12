import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface PayLoad {
  sub: string;
}

export default function isAuthenticate(req: Request, res: Response, next: NextFunction) {
  // Receber o Token 
  const authToken = req.headers.authorization;

  if(!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(" ");

  try{
    // Validando o token
    const {sub} = verify(
      token,
      process.env.JWT_SECRET
    ) as PayLoad;

    req.user_id = sub;
   
    return next();

  } catch(err) {
    return res.status(401).end();
  }
}