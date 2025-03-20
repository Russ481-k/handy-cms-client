import mysql from "mysql2/promise";
import crypto from "crypto";
import {
  createUsersTable,
  createMenusTable,
  createEquipmentTable,
  createMonitoringTable,
} from "./schema";
import { createInitialMenus } from "./seed";

// MySQL 연결 설정 (초기에는 데이터베이스를 지정하지 않음)
const initialPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 에러 핸들링 함수
function handlePoolError(err: Error) {
  console.error("[DB] Pool error:", err);
}

// 풀에 에러 핸들러 추가
initialPool
  .on("acquire", () => {})
  .on("connection", () => {})
  .on("release", () => {});
process.on("uncaughtException", handlePoolError);

// 비밀번호 해시 함수
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

interface TableResult {
  insertId: number;
}

export async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });

  try {
    // 데이터베이스 생성
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "cms_new"}`
    );
    console.log(`[DB] Using database ${process.env.DB_NAME || "cms_new"}`);

    // 데이터베이스 선택
    await connection.execute(`USE ${process.env.DB_NAME || "cms_new"}`);

    // 테이블 존재 여부 확인
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");
    const tablesExist = (tables as unknown[]).length > 0;

    if (!tablesExist) {
      console.log("[DB] Tables do not exist. Starting initialization...");

      // Users 테이블 생성
      await connection.execute(createUsersTable);
      console.log("[DB] Users table created");

      // Menus 테이블 생성
      await connection.execute(createMenusTable);
      console.log("[DB] Menus table created");

      // Equipment 테이블 생성
      await connection.execute(createEquipmentTable);
      console.log("[DB] Equipment table created");

      // Monitoring 테이블 생성
      await connection.execute(createMonitoringTable);
      console.log("[DB] Monitoring table created");

      // 초기 관리자 계정 생성
      const hashedPassword = hashPassword("admin123");
      await connection.execute(
        `INSERT INTO users (uuid, username, name, password, email, role) 
         VALUES (UUID(), 'admin', 'Administrator', ?, 'admin@example.com', 'admin')`,
        [hashedPassword]
      );
      console.log("[DB] Initial admin account created");

      // 초기 메뉴 생성
      const { mainMenus, subMenus, companySubMenus } = createInitialMenus();

      // 메인 메뉴 삽입
      for (const menu of mainMenus) {
        const [result] = await connection.execute(
          "INSERT INTO menus (name, type, url, display_position, visible, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
          [
            menu.name,
            menu.type,
            menu.url,
            menu.display_position,
            menu.is_visible ? 1 : 0,
            menu.sort_order,
          ]
        );
        const parentId = (result as TableResult).insertId;

        // 하위 메뉴 삽입
        for (const subMenu of subMenus) {
          const [subResult] = await connection.execute(
            "INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              subMenu.name,
              subMenu.type,
              subMenu.url,
              subMenu.display_position,
              subMenu.is_visible ? 1 : 0,
              subMenu.sort_order,
              parentId,
            ]
          );

          // 기업별 소개 하위 메뉴인 경우 추가 하위 메뉴 삽입
          if (subMenu.name === "기업별 소개") {
            const companyParentId = (subResult as TableResult).insertId;
            for (const companySubMenu of companySubMenus) {
              await connection.execute(
                "INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                  companySubMenu.name,
                  companySubMenu.type,
                  companySubMenu.url,
                  companySubMenu.display_position,
                  companySubMenu.is_visible ? 1 : 0,
                  companySubMenu.sort_order,
                  companyParentId,
                ]
              );
            }
          }
        }
      }
      console.log("[DB] Initial menus created");
    } else {
      console.log("[DB] Tables already exist. Skipping initialization.");
    }

    console.log("[DB] Database initialization completed");
  } finally {
    await connection.end();
  }
}

// 데이터베이스 초기화 실행
initializeDatabase().catch((error) => {
  console.error("[DB] Database initialization failed:", error);
  process.exit(1);
});

// 데이터베이스가 초기화된 후의 연결 풀 생성
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "cms_new",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 메인 풀에도 에러 핸들러 추가
dbPool
  .on("acquire", () => {})
  .on("connection", () => {})
  .on("release", () => {});
process.on("uncaughtException", handlePoolError);

export default dbPool;
