import mysql from "mysql2/promise";
import crypto from "crypto";

// 초기화 상태를 추적하는 전역 변수
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

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

// 데이터베이스 초기화
async function initializeDatabase() {
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

    // 기존 테이블 삭제
    await connection.execute("DROP TABLE IF EXISTS monitoring");
    await connection.execute("DROP TABLE IF EXISTS equipment");
    await connection.execute("DROP TABLE IF EXISTS menus");
    await connection.execute("DROP TABLE IF EXISTS users");
    console.log("[DB] Existing tables dropped");

    // Users 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        uuid VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'editor', 'user') NOT NULL DEFAULT 'user',
        status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
        last_login_at DATETIME,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created");

    // Menus 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type ENUM('LINK', 'FOLDER', 'BOARD', 'CONTENT') NOT NULL,
        url VARCHAR(255),
        target_id INT,
        display_position VARCHAR(50) NOT NULL,
        visible TINYINT(1) NOT NULL DEFAULT 1,
        sort_order INT NOT NULL DEFAULT 0,
        parent_id INT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE SET NULL
      )
    `);
    console.log("Menus table created");

    // Equipment 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS equipment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
        location VARCHAR(100),
        description TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Equipment table created");

    // Monitoring 테이블 생성
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS monitoring (
        id INT AUTO_INCREMENT PRIMARY KEY,
        equipment_id INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        temperature DECIMAL(5,2),
        humidity DECIMAL(5,2),
        pressure DECIMAL(10,2),
        timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
      )
    `);
    console.log("Monitoring table created");

    // 초기 관리자 계정 생성
    const [existingAdmin] = await connection.execute(
      "SELECT uuid FROM users WHERE username = 'admin'"
    );
    if (!(existingAdmin as any[]).length) {
      const hashedPassword = hashPassword("admin123");
      await connection.execute(
        `INSERT INTO users (uuid, username, name, password, email, role) 
         VALUES (UUID(), 'admin', 'Administrator', ?, 'admin@example.com', 'admin')`,
        [hashedPassword]
      );
      console.log("Initial admin account created");
    }

    // 초기 메뉴 생성
    const [existingMenus] = await connection.execute("SELECT id FROM menus");
    if (!(existingMenus as any[]).length) {
      // 대메뉴
      await connection.execute(`
        INSERT INTO menus (id, name, type, url, display_position, visible, sort_order) VALUES
        (1, '창업가꿈 소개', 'FOLDER', NULL, 'HEADER', 1, 1),
        (2, '창업기업 모집', 'FOLDER', NULL, 'HEADER', 1, 2),
        (3, '창업기업 소개', 'FOLDER', NULL, 'HEADER', 1, 3),
        (4, '커뮤니티', 'FOLDER', NULL, 'HEADER', 1, 4)
      `);

      // 창업가꿈 소개 하위 메뉴
      await connection.execute(`
        INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
        ('비전 및 목표', 'CONTENT', '/about/vision', 'HEADER', 1, 1, 1),
        ('주요프로그램', 'CONTENT', '/about/program', 'HEADER', 1, 2, 1),
        ('찾아오시는 길', 'CONTENT', '/about/location', 'HEADER', 1, 3, 1)
      `);

      // 창업기업 모집 하위 메뉴
      await connection.execute(`
        INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
        ('모집공고', 'CONTENT', '/recruit/notice', 'HEADER', 1, 1, 2),
        ('지원안내', 'CONTENT', '/recruit/guide', 'HEADER', 1, 2, 2),
        ('교육내용', 'CONTENT', '/recruit/education', 'HEADER', 1, 3, 2),
        ('FAQ', 'BOARD', '/recruit/faq', 'HEADER', 1, 4, 2)
      `);

      // 창업기업 소개 하위 메뉴
      await connection.execute(`
        INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
        ('참여기업', 'CONTENT', '/companies/participants', 'HEADER', 1, 1, 3),
        ('기업별 소개', 'FOLDER', NULL, 'HEADER', 1, 2, 3),
        ('참고자료실', 'BOARD', '/companies/resources', 'HEADER', 1, 3, 3)
      `);

      // 기업별 소개 하위 탭메뉴
      const [parentResult] = await connection.execute(
        "SELECT id FROM menus WHERE name = '기업별 소개' AND parent_id = 3"
      );
      const parentId = (parentResult as { id: number }[])[0].id;

      await connection.execute(
        `
        INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
        ('오늘의 이야기', 'LINK', '/companies/details/today-story', 'HEADER', 1, 1, ?),
        ('유니마스', 'LINK', '/companies/details/unimas', 'HEADER', 1, 2, ?),
        ('삼선택', 'LINK', '/companies/details/samseontaek', 'HEADER', 1, 3, ?),
        ('세로라', 'LINK', '/companies/details/serora', 'HEADER', 1, 4, ?)
      `,
        [parentId, parentId, parentId, parentId]
      );

      // 커뮤니티 하위 메뉴
      await connection.execute(`
        INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
        ('답변게시판', 'BOARD', '/community/qna', 'HEADER', 1, 1, 4)
      `);

      console.log("Initial menus created");
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
