import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

interface AccessTokenPayload {
  userId: string;
  email: string;
}

/**
 * Signs a JWT access token containing the user details, valid for 15 minutes.
 * @param payload Access token contents
 * @returns Signed JWT string
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

/**
 * Verifies the signature and validity of a JWT access token.
 * @param token Access token string
 * @returns Decoded access token payload
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

/**
 * Generates a cryptographically secure random refresh token string.
 * @returns 80-character hex string representing the raw refresh token
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex');
}

/**
 * Hashes a raw refresh token using SHA256 for secure database storage.
 * @param token Raw refresh token string
 * @returns Hex digest of the hashed token
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
