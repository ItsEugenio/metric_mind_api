import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { JwtPayload } from '../types';

export class JwtUtils {
  static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload as object, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as any);
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
