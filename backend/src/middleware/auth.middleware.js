import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../libs/db.js';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - no token provided',
      });
    }

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        // image: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - no token provided',
      error,
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'Access denied - Admins Only',
      });
    }
    next();
  } catch (error) {
    console.error('Error Checking Admin Role', error);
    res.status(500).json({ message: 'Error checking admin role' });
  }
};
