import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtsigningkey_change_me_in_production';

export function protect(req: Request, res: Response, next: NextFunction) {
  let token = '';

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please provide a valid token.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed. Unauthorized access.'
    });
  }
}

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user && user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. This action requires administrator permissions.'
    });
  }
}
