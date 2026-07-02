import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { hashPassword, comparePassword } from '../utils/hash';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '../utils/token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
};

/**
 * Handle new user registration.
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        currency: true,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const rawRefreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(rawRefreshToken);
    
    // Save refresh token in database
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', rawRefreshToken, COOKIE_OPTIONS);

    return res.status(201).json({
      success: true,
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle user credentials login.
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const rawRefreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(rawRefreshToken);

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('refreshToken', rawRefreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currency: user.currency,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle retrieving authenticated user context.
 */
export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle rotation of refresh token to issue a new access token.
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const rawToken = req.cookies?.refreshToken;
    if (!rawToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    const tokenHash = hashRefreshToken(rawToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Generate new token pair
    const accessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
    });
    
    const newRawRefreshToken = generateRefreshToken();
    const newHash = hashRefreshToken(newRawRefreshToken);

    // Delete or revoke old token, write new token
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { id: storedToken.id } }),
      prisma.refreshToken.create({
        data: {
          tokenHash: newHash,
          userId: storedToken.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    res.cookie('refreshToken', newRawRefreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handle user logout, revoking database refresh records.
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const rawToken = req.cookies?.refreshToken;
    if (rawToken) {
      const tokenHash = hashRefreshToken(rawToken);
      
      // Revoke token in database
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true },
      }).catch(() => {}); // Suppress errors if token doesn't exist
    }

    res.clearCookie('refreshToken', {
      ...COOKIE_OPTIONS,
      maxAge: 0,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}
