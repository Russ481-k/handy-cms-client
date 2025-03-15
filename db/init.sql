-- Users 테이블
CREATE TABLE IF NOT EXISTS users (
    uuid VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    avatar_url VARCHAR(255),
    created_by VARCHAR(36),
    created_ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_ip VARCHAR(45),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(uuid),
    FOREIGN KEY (updated_by) REFERENCES users(uuid)
);

-- Menus 테이블
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
);

-- 초기 메뉴 데이터
INSERT INTO menus (id, name, type, url, display_position, visible, sort_order) VALUES
(1, '홈', 'LINK', '/', 'HEADER', true, 1),
(2, '사업소개', 'FOLDER', NULL, 'HEADER', true, 2),
(3, '지원내용', 'FOLDER', NULL, 'HEADER', true, 3),
(4, '신청 및 절차', 'FOLDER', NULL, 'HEADER', true, 4),
(5, '입주기업', 'FOLDER', NULL, 'HEADER', true, 5),
(6, '커뮤니티', 'FOLDER', NULL, 'HEADER', true, 6);

-- 사업소개 하위 메뉴
INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
('사업개요', 'LINK', '/about/overview', 'HEADER', true, 1, 2),
('사업목적', 'LINK', '/about/purpose', 'HEADER', true, 2, 2),
('사업내용', 'LINK', '/about/contents', 'HEADER', true, 3, 2);

-- 지원내용 하위 메뉴
INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
('공간지원', 'LINK', '/support/space', 'HEADER', true, 1, 3),
('장비지원', 'LINK', '/support/equipment', 'HEADER', true, 2, 3),
('교육지원', 'LINK', '/support/education', 'HEADER', true, 3, 3);

-- 신청 및 절차 하위 메뉴
INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
('신청자격', 'LINK', '/apply/qualification', 'HEADER', true, 1, 4),
('신청절차', 'LINK', '/apply/process', 'HEADER', true, 2, 4),
('서류양식', 'LINK', '/apply/forms', 'HEADER', true, 3, 4);

-- 입주기업 하위 메뉴
INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
('스튜디오로컬', 'LINK', '/companies/studio-local', 'HEADER', true, 1, 5),
('S.V.D', 'LINK', '/companies/svd', 'HEADER', true, 2, 5),
('다이아몬드핸즈', 'LINK', '/companies/diamond-hands', 'HEADER', true, 3, 5),
('어스아워스', 'LINK', '/companies/earth-hours', 'HEADER', true, 4, 5),
('페더', 'LINK', '/companies/feather', 'HEADER', true, 5, 5);

-- 커뮤니티 하위 메뉴
INSERT INTO menus (name, type, url, display_position, visible, sort_order, parent_id) VALUES
('공지사항', 'BOARD', NULL, 'HEADER', true, 1, 6),
('갤러리', 'BOARD', NULL, 'HEADER', true, 2, 6),
('FAQ', 'LINK', '/community/faq', 'HEADER', true, 3, 6),
('QnA', 'BOARD', NULL, 'HEADER', true, 4, 6),
('입주기업신청', 'LINK', '/community/apply', 'HEADER', true, 5, 6);

-- 푸터 메뉴
INSERT INTO menus (name, type, url, display_position, visible, sort_order) VALUES
('이용약관', 'LINK', '/terms', 'FOOTER', true, 1),
('개인정보처리방침', 'LINK', '/privacy', 'FOOTER', true, 2),
('사이트맵', 'LINK', '/sitemap', 'FOOTER', true, 3);

-- Equipment 테이블
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
);

-- Monitoring 테이블
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
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_menus_parent_id ON menus(parent_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_monitoring_equipment ON monitoring(equipment_id);