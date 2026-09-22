const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let pool = null;
let isMySQLConnected = false;

// Initial Mock Seed Data (used for fallback or MySQL auto-seeding)
const initialSeedEmployees = [
  {
    emp_id: 'EMP-1001',
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@omnibank.com',
    department: 'Retail Banking',
    designation: 'Senior Branch Manager',
    salary: 95000.00,
    branch_code: 'BR-MUM-01',
    status: 'Active',
    joining_date: '2021-03-15'
  },
  {
    emp_id: 'EMP-1002',
    full_name: 'Priya Patel',
    email: 'priya.patel@omnibank.com',
    department: 'Risk & Compliance',
    designation: 'Chief Compliance Officer',
    salary: 120000.00,
    branch_code: 'BR-DEL-02',
    status: 'Active',
    joining_date: '2019-08-10'
  },
  {
    emp_id: 'EMP-1003',
    full_name: 'Vikramaditya Singh',
    email: 'vikram.singh@omnibank.com',
    department: 'Corporate Banking',
    designation: 'Relationship Officer',
    salary: 78000.00,
    branch_code: 'BR-BLR-04',
    status: 'Active',
    joining_date: '2022-01-20'
  },
  {
    emp_id: 'EMP-1004',
    full_name: 'Ananya Deshmukh',
    email: 'ananya.d@omnibank.com',
    department: 'IT & Cybersecurity',
    designation: 'Lead Security Architect',
    salary: 135000.00,
    branch_code: 'BR-MUM-01',
    status: 'Active',
    joining_date: '2020-05-12'
  },
  {
    emp_id: 'EMP-1005',
    full_name: 'Amit Kumar',
    email: 'amit.kumar@omnibank.com',
    department: 'Loan Processing',
    designation: 'Senior Credit Analyst',
    salary: 68000.00,
    branch_code: 'BR-HYD-05',
    status: 'On Leave',
    joining_date: '2021-11-01'
  },
  {
    emp_id: 'EMP-1006',
    full_name: 'Sneha Reddy',
    email: 'sneha.reddy@omnibank.com',
    department: 'Forex & Investment',
    designation: 'Treasury Operations Head',
    salary: 110000.00,
    branch_code: 'BR-MUM-01',
    status: 'Active',
    joining_date: '2018-04-18'
  },
  {
    emp_id: 'EMP-1007',
    full_name: 'Rohan Mehta',
    email: 'rohan.mehta@omnibank.com',
    department: 'Retail Banking',
    designation: 'Teller / Desk Executive',
    salary: 45000.00,
    branch_code: 'BR-PUN-03',
    status: 'Active',
    joining_date: '2023-02-14'
  },
  {
    emp_id: 'EMP-1008',
    full_name: 'Kavita Verma',
    email: 'kavita.v@omnibank.com',
    department: 'Risk & Compliance',
    designation: 'Fraud Analyst',
    salary: 72000.00,
    branch_code: 'BR-DEL-02',
    status: 'Suspended',
    joining_date: '2022-07-09'
  }
];

// In-Memory Backup Store if MySQL server is off
let inMemoryStore = initialSeedEmployees.map((emp, index) => ({
  id: index + 1,
  ...emp,
  created_at: new Date().toISOString()
}));

async function initializeDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    port: process.env.DB_PORT || 3306
  };

  try {
    // 1. Try connecting to MySQL Server without specific database first
    const connection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME || 'banking_db';

    // 2. Create Database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    // 3. Create Connection Pool with Database selected
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const testConn = await pool.getConnection();
    console.log(`✅ [MySQL Database] Connected successfully to '${dbName}' on ${dbConfig.host}:${dbConfig.port}`);
    testConn.release();

    // 4. Ensure table exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS \`employees\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`emp_id\` VARCHAR(20) NOT NULL UNIQUE,
        \`full_name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(100) NOT NULL UNIQUE,
        \`department\` VARCHAR(50) NOT NULL,
        \`designation\` VARCHAR(60) NOT NULL,
        \`salary\` DECIMAL(12, 2) NOT NULL,
        \`branch_code\` VARCHAR(20) NOT NULL,
        \`status\` ENUM('Active', 'On Leave', 'Suspended') DEFAULT 'Active',
        \`joining_date\` DATE NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.query(createTableQuery);

    // 5. Seed initial data if table is empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM employees');
    if (rows[0].count === 0) {
      console.log('🌱 [MySQL Database] Seeding initial banking employees data...');
      for (const emp of initialSeedEmployees) {
        await pool.query(
          `INSERT INTO employees (emp_id, full_name, email, department, designation, salary, branch_code, status, joining_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [emp.emp_id, emp.full_name, emp.email, emp.department, emp.designation, emp.salary, emp.branch_code, emp.status, emp.joining_date]
        );
      }
      console.log('✅ [MySQL Database] Initial seed data inserted successfully!');
    }

    isMySQLConnected = true;
  } catch (error) {
    console.warn(`⚠️ [MySQL Database Warning]: Unable to connect to MySQL database (${error.message}).`);
    console.warn(`💡 [Fallback Active]: Using Smart In-Memory Store. All APIs & CRUD functions will work 100% smoothly for demonstration.`);
    isMySQLConnected = false;
  }
}

function getPool() {
  return pool;
}

function getStatus() {
  return {
    isMySQLConnected,
    mode: isMySQLConnected ? 'MySQL Database' : 'In-Memory Store (Demo Fallback)',
    dbName: process.env.DB_NAME || 'banking_db',
    host: process.env.DB_HOST || 'localhost'
  };
}

module.exports = {
  initializeDatabase,
  getPool,
  getStatus,
  inMemoryStore
};
