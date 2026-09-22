# 🏛️ Apex Banking Corp — Advanced Java Full Stack Employee Management System

A high-performance, enterprise-grade **Java Full Stack Banking Employee Management System** built for technical interview demonstrations. It features a modern dark glassmorphism dashboard, real-time workforce analytics, dynamic search & filtering, full CRUD operations, and MySQL relational database integration with automated Spring Data JPA ORM.

---

## 🚀 Tech Stack

### **Frontend**
- **HTML5 & CSS3**: Custom dark glassmorphic UI system using Tailwind CSS utilities, Google Fonts (Inter & Outfit), and FontAwesome icons.
- **Vanilla JavaScript (ES6+)**: Pure JS architecture using `async/await` and modern `fetch` API for RESTful backend communication.
- **Dynamic Views**: Table Directory view vs Grid Cards view toggle, interactive modals (Add/Edit Form, Official Banking Identity Card, Interview Cheat Sheet).

### **Backend**
- **Java 17 & Spring Boot 3.2**: High-throughput REST API using Spring Web (`@RestController`).
- **Spring Data JPA & Hibernate ORM**: Repository pattern for automated SQL query generation, prepared statement execution, and database mapping.
- **Resilient Database Layer**: Automatic connection management to **MySQL** (`banking_db`) with fallback to **H2 In-Memory Database** to guarantee zero-downtime during interview live demos.

### **Database**
- **MySQL Database**: `banking_db` schema with indexed fields (`emp_id`, `department`, `status`).

---

## 📂 Project Architecture

```
d:\EMPLOYEE BANKING MANAGMENT SYSTEM
├── database.sql                  # MySQL Database Creation & Seed Script
├── README.md                     # Comprehensive Setup & Interview Guide
├── backend/                      # Java Spring Boot REST API Service
│   ├── pom.xml                   # Maven Build File (Java 17, Spring Boot 3)
│   ├── maven/                    # Embedded Portable Apache Maven
│   └── src/main/
│       ├── java/com/apexbank/banking/
│       │   ├── BankingManagementApplication.java # Spring Boot Entry Point & Seed Runner
│       │   ├── model/Employee.java              # JPA Entity (@Entity, @Table)
│       │   ├── repository/EmployeeRepository.java# Spring Data JPA Repository
│       │   ├── service/EmployeeService.java    # Business Logic & Dashboard Analytics
│       │   ├── controller/EmployeeController.java# REST Controller (@CrossOrigin)
│       │   └── config/
│       │       ├── CorsConfig.java               # Global Web CORS Configuration
│       │       └── DatabaseConfig.java           # Resilient MySQL Connection Tester
│       └── resources/application.properties
└── frontend/                     # Pure HTML5, CSS3, Vanilla JS Client
    ├── index.html                # Single Page Application Dashboard Layout
    ├── css/style.css             # Glassmorphism Utilities & Themes
    └── js/
        ├── app.js                # Core JS logic & REST API Integration
        └── interview-guide.js    # Interactive Interview Guide Modal
```

---

## 🛠️ How to Run the Project

### **1. Run Backend (Java Spring Boot)**
In root terminal, execute:
```cmd
cd backend
maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
- **REST API Base URL**: `http://localhost:8080/api/employees`
- **Dashboard Stats**: `http://localhost:8080/api/employees/stats`

### **2. Run Frontend (HTML/CSS/JS)**
In root terminal, execute:
```cmd
cmd.exe /c "npx http-server frontend -p 3000"
```
- Open browser at **`http://localhost:3000`**

---

## 🎤 Interview Presentation Script (30-Second Elevator Pitch)

> *"Sir, I have developed an Enterprise Banking Employee Management System using Java Full Stack architecture.*
> *The backend is built using Java 17 and Spring Boot 3 REST API with Spring Data JPA and Hibernate ORM, connected to a MySQL database.*
> *The frontend is built with pure HTML5, CSS3, and JavaScript featuring a modern dark glassmorphic UI. It communicates asynchronously via REST APIs.*
> *Key features include full CRUD operations, live workforce analytics calculation, multi-criteria filtering by department and status, real-time search, official banking digital ID cards, and parameterized SQL query execution to prevent SQL injection."*

---

## ❓ Frequently Asked Interview Questions & Answers

### **Q1: Why did you choose Spring Boot & Spring Data JPA for the backend?**
- **Answer**: Spring Boot provides production-ready REST API features with minimal configuration. Spring Data JPA abstracts JDBC query logic through `JpaRepository`, reducing boilerplate SQL while supporting complex derived query methods and prepared statements.

### **Q2: How do you prevent SQL Injection in your Java application?**
- **Answer**: Spring Data JPA and Hibernate use **Prepared Statements** with parameterized inputs (`?` placeholders). User input is never concatenated directly into raw SQL strings.

### **Q3: How is CORS handled between Frontend & Java Backend?**
- **Answer**: I added `@CrossOrigin(origins = "*")` on the `EmployeeController` and configured a global `WebMvcConfigurer` bean in Java to allow HTTP `GET`, `POST`, `PUT`, and `DELETE` methods from the web browser.

### **Q4: How does the Database Fallback work?**
- **Answer**: `DatabaseConfig.java` tests the connection to MySQL on startup. If local MySQL is running, it connects to MySQL. If MySQL is offline or unconfigured on the demo machine, it automatically switches to an in-memory database so the application runs without errors during live evaluation.
