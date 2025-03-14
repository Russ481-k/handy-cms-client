import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import pool from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createInitialAdmin() {
  try {
    const connection = await pool.getConnection();

    try {
      // users 테이블이 없으면 생성
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // admin 계정이 있는지 확인
      const [users] = await connection.execute(
        "SELECT * FROM users WHERE username = ?",
        ["admin"]
      );

      if (Array.isArray(users) && users.length === 0) {
        // admin 계정이 없으면 생성
        const hashedPassword = await hashPassword("0000");
        await connection.execute(
          "INSERT INTO users (id, username, email, password, role) VALUES (UUID(), ?, ?, ?, ?)",
          ["admin", "admin@example.com", hashedPassword, "admin"]
        );
        console.log("Initial admin account created");
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating initial admin:", error);
    throw error;
  }
}

export async function validateUser(
  username: string,
  password: string
): Promise<User | null> {
  try {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      if (!Array.isArray(users) || users.length === 0) {
        return null;
      }

      const user = users[0] as any;
      const isValid = await comparePasswords(password, user.password);

      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error validating user:", error);
    throw error;
  }
}

export function generateToken(user: User): string {
  return sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): User {
  const decoded = verify(token, JWT_SECRET) as any;
  return {
    id: decoded.userId,
    username: decoded.username,
    email: decoded.email,
    role: decoded.role,
  };
}
