import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel.js";
import { jwtUtils } from "../utils/jwtUtils.js";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthController = {
  /**
   * Register a new user
   * POST /api/auth/register
   * Body: { email, password, name }
   */
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password || !name) {
        return res.status(400).json({
          error: "Email, password, and name are required",
        });
      }

      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserModel.create({ email, password_hash, name });

      // Generate token
      const token = jwtUtils.generateToken({ id: user.id, email: user.email });

      res.status(201).json({
        user,
        token,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Login user
   * POST /api/auth/login
   * Body: { email, password }
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
        });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Remove password_hash from response
      const { password_hash, ...userWithoutPassword } = user;

      // Generate token
      const token = jwtUtils.generateToken({
        id: user.id,
        email: user.email,
      });

      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get user profile (protected route)
   * GET /api/auth/profile
   * Requires: Authorization header with Bearer token
   */
  async profile(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
