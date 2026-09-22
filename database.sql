-- ====================================================================
-- OMNIBANK SYSTEMS - JAVA FULL STACK EMPLOYEE MANAGEMENT SYSTEM
-- MYSQL DATABASE CREATION & SEED DATA SCRIPT
-- ====================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS `banking_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `banking_db`;

-- 2. Create Employees Table (Spring Data JPA will also map to this entity)
DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `emp_id` VARCHAR(20) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `department` VARCHAR(50) NOT NULL,
  `designation` VARCHAR(60) NOT NULL,
  `salary` DOUBLE NOT NULL,
  `branch_code` VARCHAR(20) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Active',
  `joining_date` VARCHAR(20) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX `idx_emp_id` (`emp_id`),
  INDEX `idx_department` (`department`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Insert Initial Banking Employee Seed Data
INSERT INTO `employees` (`emp_id`, `full_name`, `email`, `department`, `designation`, `salary`, `branch_code`, `status`, `joining_date`) VALUES
('EMP-1001', 'Rahul Sharma', 'rahul.sharma@omnibank.com', 'Retail Banking', 'Senior Branch Manager', 95000.00, 'BR-MUM-01', 'Active', '2021-03-15'),
('EMP-1002', 'Priya Patel', 'priya.patel@omnibank.com', 'Risk & Compliance', 'Chief Compliance Officer', 120000.00, 'BR-DEL-02', 'Active', '2019-08-10'),
('EMP-1003', 'Vikramaditya Singh', 'vikram.singh@omnibank.com', 'Corporate Banking', 'Relationship Officer', 78000.00, 'BR-BLR-04', 'Active', '2022-01-20'),
('EMP-1004', 'Ananya Deshmukh', 'ananya.d@omnibank.com', 'IT & Cybersecurity', 'Lead Security Architect', 135000.00, 'BR-MUM-01', 'Active', '2020-05-12'),
('EMP-1005', 'Amit Kumar', 'amit.kumar@omnibank.com', 'Loan Processing', 'Senior Credit Analyst', 68000.00, 'BR-HYD-05', 'On Leave', '2021-11-01'),
('EMP-1006', 'Sneha Reddy', 'sneha.reddy@omnibank.com', 'Forex & Investment', 'Treasury Operations Head', 110000.00, 'BR-MUM-01', 'Active', '2018-04-18'),
('EMP-1007', 'Rohan Mehta', 'rohan.mehta@omnibank.com', 'Retail Banking', 'Teller / Desk Executive', 45000.00, 'BR-PUN-03', 'Active', '2023-02-14'),
('EMP-1008', 'Kavita Verma', 'kavita.v@omnibank.com', 'Risk & Compliance', 'Fraud Analyst', 72000.00, 'BR-DEL-02', 'Suspended', '2022-07-09');

-- 4. Verification Select Query
SELECT * FROM employees ORDER BY id DESC;
