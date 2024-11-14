import jwt from 'jsonwebtoken';
import { AUTH_SETTINGS } from '../../../settings/app.settings';

export class JwtService {
  createAccessJWTToken(userId: string) {
    return jwt.sign({ userId: userId }, AUTH_SETTINGS.JWT.JWT_SECRET, {
      expiresIn: AUTH_SETTINGS.JWT.TIME.ACCESS,
    });
  }

  getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, AUTH_SETTINGS.JWT.JWT_SECRET);
      return result.userId;
    } catch (e) {
      return null;
    }
  }

  createRefreshJWTToken(userId: string, deviceId: string) {
    return jwt.sign(
      { userId: userId, deviceId: deviceId },
      AUTH_SETTINGS.JWT.JWT_SECRET,
      { expiresIn: AUTH_SETTINGS.JWT.TIME.REFRESH },
    );
  }

  getTokenIatNExp(token: string) {
    try {
      const result: any = jwt.verify(token, AUTH_SETTINGS.JWT.JWT_SECRET);
      return {
        iat: result.iat,
        exp: result.exp,
      };
    } catch (e) {
      return null;
    }
  }

  getDeviceIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, AUTH_SETTINGS.JWT.JWT_SECRET);
      return result.deviceId;
    } catch (e) {
      return null;
    }
  }
}
