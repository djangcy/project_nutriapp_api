import crypto from 'crypto';
import jwt, { JsonWebTokenError, Secret } from 'jsonwebtoken';
import Config from '../config';
import AppError from '../utils/app_error';

// private method
function getJwtSecret(): string {
  const jwtSecret: Secret | undefined = Config.jwtSecret;

  if (!jwtSecret || jwtSecret.length === 0) {
    throw AppError.internal({
      message: "Undefined value for 'JWT_SECRET' environment variable.",
      isOperational: false,
    });
  }

  return jwtSecret;
}

export function verifyToken(token: string): string | jwt.JwtPayload {
  if (!token || token.length === 0) {
    throw AppError.badRequest('Missing authentication token.');
  }

  let decoded: string | jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
    });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      switch (error.message) {
        case 'invalid token':
          throw AppError.unauthorized('Invalid Token');
      }
    }

    throw AppError.unauthorized();
  }

  if (typeof decoded !== 'string') {
    if (
      'exp' in decoded &&
      decoded.exp &&
      new Date(decoded.exp * 1000) > new Date()
    ) {
      throw AppError.unauthorized('Token Expired');
    }

    if ('purpose' in decoded && decoded.purpose === 'refresh') {
      throw AppError.unauthorized('Invalid Token');
    }
  }

  return decoded;
}

function generateKey(length: number = 16): string {
  const token = crypto.randomBytes(length).toString('hex');
  return token;
}

function buildAccessToken(): string {
  const options: jwt.SignOptions = { algorithm: 'HS256' };
  const token = jwt.sign(
    {
      iat: Date.now() / 1000,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      access_token: generateKey(32),
    },
    getJwtSecret(),
    options
  );

  return token;
}

export function generateApiKey(): {
  access_token: string;
  type: string;
} {
  const result = {
    access_token: buildAccessToken(),
    type: 'Bearer',
  };

  return result;
}
