-- Users 테이블
CREATE TABLE users (
    uuid VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menus 테이블
CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('LINK', 'FOLDER', 'BOARD', 'CONTENT') NOT NULL,
    url VARCHAR(255),
    target_id INT,
    display_position VARCHAR(50) NOT NULL,
    visible BOOLEAN DEFAULT true,
    sort_order INT NOT NULL,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE SET NULL
);

-- Equipment 테이블
CREATE TABLE equipment (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    temperature DECIMAL(5,2),
    last_check TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Monitoring 테이블
CREATE TABLE monitoring (
    id VARCHAR(36) PRIMARY KEY,
    equipment_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_menus_parent_id ON menus(parent_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_monitoring_equipment ON monitoring(equipment_id);