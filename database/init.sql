CREATE DATABASE IF NOT EXISTS metric_mind_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE metric_mind_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    target_value DECIMAL(10,2),
    unit VARCHAR(50),
    frequency ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
    user_id INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS habit_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habitId INT NOT NULL,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_habit_id (habitId),
    INDEX idx_date (date),
    FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS health_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    type ENUM('weight', 'blood_pressure', 'heart_rate', 'sleep_hours', 'water_intake', 'steps') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (userId),
    INDEX idx_type (type),
    INDEX idx_date (date),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

