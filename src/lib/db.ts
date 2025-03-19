import mysql from "mysql2/promise";
import { hashPassword } from "./auth-utils";

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

// 데이터베이스 초기화
async function initializeDatabase() {
  // 이미 초기화가 진행 중이면 해당 Promise를 반환
  if (initializationPromise) {
    return initializationPromise;
  }

  // 이미 초기화되었다면 바로 반환
  if (isInitialized) {
    return Promise.resolve();
  }

  // 새로운 초기화 Promise 생성
  initializationPromise = (async () => {
    try {
      const connection = await initialPool.getConnection();
      console.log("[DB] Connected to MySQL server");

      try {
        // 데이터베이스 존재 여부 확인
        const [databases] = await connection.query(
          "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'cms_new'"
        );

        if (Array.isArray(databases) && databases.length === 0) {
          // 데이터베이스가 없으면 생성
          await connection.query(
            "CREATE DATABASE cms_new CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
          );
          console.log("[DB] Database cms_new created");
        }

        // 데이터베이스 사용
        await connection.query("USE cms_new");
        console.log("[DB] Using database cms_new");

        // 테이블 존재 여부 확인
        const [tables] = await connection.query(
          "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = 'cms_new'"
        );
        const existingTables = (tables as { TABLE_NAME: string }[]).map((t) =>
          t.TABLE_NAME.toLowerCase()
        );
        console.log("[DB] Existing tables:", existingTables);

        // Users 테이블이 없으면 생성
        if (!existingTables.includes("users")) {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
              uuid VARCHAR(36) PRIMARY KEY,
              username VARCHAR(50) NOT NULL UNIQUE,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              role VARCHAR(20) NOT NULL,
              status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
              avatar_url VARCHAR(255),
              created_by VARCHAR(36),
              created_ip VARCHAR(45),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_by VARCHAR(36),
              updated_ip VARCHAR(45),
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (created_by) REFERENCES users(uuid),
              FOREIGN KEY (updated_by) REFERENCES users(uuid)
            )
          `);
          console.log("Users table created");
        }

        // Menus 테이블이 없으면 생성
        if (!existingTables.includes("menus")) {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS menus (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              type ENUM('LINK', 'FOLDER', 'BOARD', 'CONTENT') NOT NULL,
              url VARCHAR(255),
              target_id INT,
              display_position VARCHAR(50) NOT NULL,
              visible BOOLEAN DEFAULT true,
              sort_order INT NOT NULL,
              parent_id INT,
              created_by VARCHAR(36),
              created_ip VARCHAR(45),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_by VARCHAR(36),
              updated_ip VARCHAR(45),
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE SET NULL,
              FOREIGN KEY (created_by) REFERENCES users(uuid),
              FOREIGN KEY (updated_by) REFERENCES users(uuid)
            )
          `);
          console.log("Menus table created");
        }

        // Equipment 테이블이 없으면 생성
        if (!existingTables.includes("equipment")) {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS equipment (
              id VARCHAR(36) PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              status VARCHAR(50) NOT NULL,
              temperature DECIMAL(5,2),
              last_check TIMESTAMP,
              created_by VARCHAR(36),
              created_ip VARCHAR(45),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_by VARCHAR(36),
              updated_ip VARCHAR(45),
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (created_by) REFERENCES users(uuid),
              FOREIGN KEY (updated_by) REFERENCES users(uuid)
            )
          `);
          console.log("Equipment table created");
        }

        // Monitoring 테이블이 없으면 생성
        if (!existingTables.includes("monitoring")) {
          await connection.query(`
            CREATE TABLE IF NOT EXISTS monitoring (
              id VARCHAR(36) PRIMARY KEY,
              equipment_id VARCHAR(36) NOT NULL,
              status VARCHAR(50) NOT NULL,
              last_update TIMESTAMP,
              created_by VARCHAR(36),
              created_ip VARCHAR(45),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_by VARCHAR(36),
              updated_ip VARCHAR(45),
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
              FOREIGN KEY (created_by) REFERENCES users(uuid),
              FOREIGN KEY (updated_by) REFERENCES users(uuid)
            )
          `);
          console.log("Monitoring table created");
        }

        // 초기 데이터 삽입 여부 확인
        const [userCount] = await connection.query(
          "SELECT COUNT(*) as count FROM users"
        );
        const isEmpty = (userCount as { count: number }[])[0].count === 0;

        if (isEmpty) {
          // admin 계정 생성
          const hashedPassword = await hashPassword("0000");
          await connection.query(
            "INSERT INTO users (uuid, username, name, email, password, role, status) VALUES (UUID(), ?, ?, ?, ?, ?, ?)",
            [
              "admin",
              "Administrator",
              "admin@example.com",
              hashedPassword,
              "ADMIN",
              "ACTIVE",
            ]
          );
          console.log("Initial admin account created");

          // 초기 메뉴 데이터 생성
          // 대메뉴
          await connection.query(`
            INSERT INTO menus (id, name, type, url, display_position, visible, sort_order) VALUES
            (1, '창업가꿈 소개', 'FOLDER', NULL, 'HEADER', true, 1),
            (2, '창업기업 모집', 'FOLDER', NULL, 'HEADER', true, 2),
            (3, '창업기업 소개', 'FOLDER', NULL, 'HEADER', true, 3),
            (4, '커뮤니티', 'FOLDER', NULL, 'HEADER', true, 4)
          `);

          // 창업가꿈 소개 하위 메뉴
          await connection.query(`
            INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
            ('비전 및 목표', 'CONTENT', '/about/vision', 'HEADER', true, 1, 1),
            ('주요프로그램', 'CONTENT', '/about/program', 'HEADER', true, 2, 1),
            ('찾아오시는 길', 'CONTENT', '/about/location', 'HEADER', true, 3, 1)
          `);

          // 창업기업 모집 하위 메뉴
          await connection.query(`
            INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
            ('모집공고', 'CONTENT', '/recruit/notice', 'HEADER', true, 1, 2),
            ('지원안내', 'CONTENT', '/recruit/guide', 'HEADER', true, 2, 2),
            ('교육내용', 'CONTENT', '/recruit/education', 'HEADER', true, 3, 2),
            ('FAQ', 'BOARD', '/recruit/faq', 'HEADER', true, 4, 2)
          `);

          // 창업기업 소개 하위 메뉴
          await connection.query(`
            INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
            ('참여기업', 'CONTENT', '/companies/participants', 'HEADER', true, 1, 3),
            ('기업별 소개', 'FOLDER', NULL, 'HEADER', true, 2, 3),
            ('참고자료실', 'BOARD', '/companies/resources', 'HEADER', true, 3, 3)
          `);

          // 기업별 소개 하위 탭메뉴
          const [parentResult] = await connection.query(
            "SELECT id FROM menus WHERE name = '기업별 소개' AND parent_id = 3"
          );
          const parentId = (parentResult as { id: number }[])[0].id;

          await connection.query(
            `
            INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
            ('오늘의 이야기', 'LINK', '/companies/details/today-story', 'HEADER', true, 1, ?),
            ('유니마스', 'LINK', '/companies/details/unimas', 'HEADER', true, 2, ?),
            ('삼선택', 'LINK', '/companies/details/samseontaek', 'HEADER', true, 3, ?),
            ('세로라', 'LINK', '/companies/details/serora', 'HEADER', true, 4, ?)
          `,
            [parentId, parentId, parentId, parentId]
          );

          // 커뮤니티 하위 메뉴
          await connection.query(`
            INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
            ('답변게시판', 'BOARD', '/community/qna', 'HEADER', true, 1, 4)
          `);

          console.log("Initial menus created");
        }

        // 초기화 완료 표시
        isInitialized = true;
        console.log("[DB] Database initialization completed");
      } catch (error) {
        console.error("[DB] Error during database initialization:", error);
        // 에러를 throw하지 않고 로그만 남김
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("[DB] Error connecting to database:", error);
      // 에러를 throw하지 않고 로그만 남김
    } finally {
      // 초기화가 완료되면 Promise 참조 제거
      initializationPromise = null;
    }
  })();

  return initializationPromise;
}

// 서버 시작 시 데이터베이스 초기화 실행 (에러가 발생해도 계속 진행)
initializeDatabase().catch((error) => {
  console.error("[DB] Failed to initialize database:", error);
  // process.exit(1) 제거
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
