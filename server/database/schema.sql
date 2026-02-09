-- FAM Manga Database Schema
-- สร้างฐานข้อมูลสำหรับเว็บไซต์อ่านมังงะ

CREATE DATABASE IF NOT EXISTS fammanga CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fammanga;

-- ตาราง users: เก็บข้อมูลผู้ใช้และแอดมิน
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง manga: เก็บข้อมูลมังงะ
CREATE TABLE IF NOT EXISTS manga (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) DEFAULT NULL,
  author VARCHAR(100) DEFAULT NULL,
  artist VARCHAR(100) DEFAULT NULL,
  description TEXT,
  cover_image VARCHAR(255) DEFAULT NULL,
  status ENUM('ongoing', 'completed', 'hiatus') DEFAULT 'ongoing',
  genres JSON DEFAULT NULL,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_chapters INT DEFAULT 0,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title),
  INDEX idx_status (status),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง chapters: เก็บข้อมูลตอนของมังงะ
CREATE TABLE IF NOT EXISTS chapters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  manga_id INT NOT NULL,
  chapter_number DECIMAL(5, 1) NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  pages JSON NOT NULL COMMENT 'Array of image URLs',
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manga_id) REFERENCES manga(id) ON DELETE CASCADE,
  UNIQUE KEY unique_manga_chapter (manga_id, chapter_number),
  INDEX idx_manga_chapter (manga_id, chapter_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง user_reading_list: เก็บรายการ "สิ่งที่จะอ่าน"
CREATE TABLE IF NOT EXISTS user_reading_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  manga_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (manga_id) REFERENCES manga(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_manga (user_id, manga_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง user_wishlist: เก็บรายการ "สิ่งที่อยากได้"
CREATE TABLE IF NOT EXISTS user_wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  manga_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (manga_id) REFERENCES manga(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_manga_wish (user_id, manga_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง reading_progress: ติดตามความคืบหน้าการอ่าน
CREATE TABLE IF NOT EXISTS reading_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  manga_id INT NOT NULL,
  chapter_id INT NOT NULL,
  page_number INT DEFAULT 1,
  last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (manga_id) REFERENCES manga(id) ON DELETE CASCADE,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_manga_progress (user_id, manga_id),
  INDEX idx_user_manga (user_id, manga_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- สร้างผู้ใช้ admin เริ่มต้น (password: admin123)
-- Password hash สำหรับ "admin123" และ "test123" (bcrypt)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@fammanga.com', '$2b$10$Gr1PDqHNK1/VhGiqFdp7gOndSz/HUgM1ykdfddUDvX/J8OQzZEl4e', 'admin'),
('testuser', 'user@fammanga.com', '$2b$10$0FPNQLNo.3QK3B515C9wweq78/9kNZAmh/K08RHcBD28DjEA35KOq', 'user')
ON DUPLICATE KEY UPDATE password=VALUES(password);

-- เพิ่มข้อมูลตัวอย่างมังงะ
INSERT INTO manga (title, title_en, author, description, cover_image, status, genres, total_chapters) VALUES
('วันพีช', 'One Piece', 'Eiichiro Oda', 'เรื่องราวของมังกี้ ดี. ลูฟี่ ที่ออกผจญภัยเพื่อตามหาสมบัติวันพีช', 'https://via.placeholder.com/300x400?text=One+Piece', 'ongoing', '["adventure", "action", "comedy"]', 1000),
('นารูโตะ', 'Naruto', 'Masashi Kishimoto', 'เรื่องราวของอุซึมากิ นารูโตะ นินจาผู้ต้องการเป็นโฮคาเงะ', 'https://via.placeholder.com/300x400?text=Naruto', 'completed', '["action", "adventure", "ninja"]', 700),
('ดราก้อนบอล', 'Dragon Ball', 'Akira Toriyama', 'การผจญภัยของซงโงกูและเพื่อนๆ ในการตามหาดราก้อนบอล', 'https://via.placeholder.com/300x400?text=Dragon+Ball', 'completed', '["action", "adventure", "comedy"]', 519)
ON DUPLICATE KEY UPDATE title=title;

-- เพิ่มตัวอย่างตอนของมังงะ
INSERT INTO chapters (manga_id, chapter_number, title, pages) VALUES
(1, 1, 'ผมคือลูฟี่! ผู้ที่จะเป็นราชาโจรสลัด!', '["https://via.placeholder.com/800x1200?text=Page+1", "https://via.placeholder.com/800x1200?text=Page+2"]'),
(1, 2, 'พวกโจรสลัดนั้นเป็นเพื่อนกัน', '["https://via.placeholder.com/800x1200?text=Page+1", "https://via.placeholder.com/800x1200?text=Page+2"]'),
(2, 1, 'อุซึมากิ นารูโตะ', '["https://via.placeholder.com/800x1200?text=Page+1", "https://via.placeholder.com/800x1200?text=Page+2"]'),
(3, 1, 'บูลม่ากับซงโงกู', '["https://via.placeholder.com/800x1200?text=Page+1", "https://via.placeholder.com/800x1200?text=Page+2"]')
ON DUPLICATE KEY UPDATE title=title;
