# 🏛️ OmniBank Systems — Enterprise Employee Management Portal

An enterprise-grade **Full-Stack Banking Employee Management System** built for commercial banking operations. It features a clean corporate light dashboard interface, real-time workforce analytics, dynamic search & multi-field filtering, full CRUD operations, and persistent relational database integration with automated Spring Data JPA ORM.

---

## 🚀 Tech Stack

### **Frontend**
- **React.js & Vite**: Modern single-page application (SPA) architecture with fast HMR.
- **Tailwind CSS**: Clean corporate light design system with high-contrast slate color palette.
- **Lucide Icons**: Crisp SVG icons for corporate UI actions and metrics.
- **Dynamic Views**: Table Directory View vs Grid Cards View toggle, interactive modals (Add/Edit Employee Form, Official Banking Identity Card).

### **Backend**
- **Java 17 & Spring Boot 3**: High-performance RESTful API service using Spring Web (`@RestController`).
- **Spring Data JPA & Hibernate ORM**: Repository pattern for automated SQL query generation, prepared statement execution, and database mapping.
- **Persistent Relational Database**: Persistent relational file-based database store with MySQL support.

---

## 📂 Project Architecture

```
OMNIBANK SYSTEMS
├── backend/                      # Java Spring Boot REST API Service
│   ├── pom.xml                   # Maven Build File (Java 17, Spring Boot 3)
│   └── src/main/
│       ├── java/com/apexbank/banking/
│       │   ├── BankingManagementApplication.java # Spring Boot Entry Point & Seed Runner
│       │   ├── model/Employee.java              # JPA Entity (@Entity, @Table)
│       │   ├── repository/EmployeeRepository.java# Spring Data JPA Repository
│       │   ├── service/EmployeeService.java    # Business Logic & Dashboard Analytics
│       │   └── controller/EmployeeController.java# REST Controller (@CrossOrigin)
│       └── resources/application.properties
│
├── client/                       # React + Vite Frontend Application
│   ├── index.html                # Single Page Application HTML Entry Point
│   ├── package.json              # React Dependencies & Scripts
│   ├── vite.config.js            # Vite Configuration
│   └── src/
│       ├── App.jsx               # Main Dashboard Component & Layout
│       ├── components/           # UI Components (Navbar, EmployeeTable, StatCard, etc.)
│       └── services/api.js       # Axios REST API Integration Layer
│
└── server/                       # Node.js Express REST API Service (Alternative Backend)
```

---

## 🛠️ How to Run the Project

### **1. Run Backend (Java Spring Boot)**
From the `backend` directory, run:
```cmd
cd backend
maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
- **REST API Base URL**: `http://localhost:8080/api/employees`
- **Dashboard Stats**: `http://localhost:8080/api/employees/stats`

### **2. Run Frontend (React + Vite)**
From the `client` directory, run:
```cmd
cd client
npm run dev
```
- Open browser at **`http://localhost:3000`**

---

## ✨ Key Features
- **Full CRUD Operations**: Create, view, edit, and delete employee credential records.
- **Workforce Analytics**: Live calculation of total monthly payroll spend, active branch counts, and department distributions.
- **Official Digital ID Card**: Interactive printable/viewable employee credential badge.
- **CSV Data Export**: Instant export of employee directory to CSV spreadsheet format.
