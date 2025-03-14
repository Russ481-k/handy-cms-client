import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import pool from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

export interface User {
  uuid: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface DBUser extends User {
  password: string;
  created_at: Date;
  updated_at: Date;
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
          uuid VARCHAR(36) PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL,
          avatar_url VARCHAR(255),
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
          "INSERT INTO users (uuid, username, name, email, password, role) VALUES (UUID(), ?, ?, ?, ?, ?)",
          [
            "admin",
            "Administrator",
            "admin@example.com",
            hashedPassword,
            "admin",
          ]
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

      const user = users[0] as DBUser;
      const isValid = await comparePasswords(password, user.password);

      if (!isValid) {
        return null;
      }

      return {
        uuid: user.uuid,
        username: user.username,
        name: user.name,
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
      uuid: user.uuid,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): User {
  const decoded = verify(token, JWT_SECRET) as User;
  return {
    uuid: decoded.uuid,
    username: decoded.username,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
  };
}
