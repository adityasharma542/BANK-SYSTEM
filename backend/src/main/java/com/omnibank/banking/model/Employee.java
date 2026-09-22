package com.omnibank.banking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_id", unique = true, nullable = false)
    private String empId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "designation", nullable = false)
    private String designation;

    @Column(name = "salary", nullable = false)
    private Double salary;

    @Column(name = "branch_code", nullable = false)
    private String branchCode;

    @Column(name = "status", nullable = false)
    private String status = "Active";

    @Column(name = "joining_date", nullable = false)
    private String joiningDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Default Constructor
    public Employee() {}

    // Parameterized Constructor
    public Employee(String empId, String fullName, String email, String department, String designation, Double salary, String branchCode, String status, String joiningDate) {
        this.empId = empId;
        this.fullName = fullName;
        this.email = email;
        this.department = department;
        this.designation = designation;
        this.salary = salary;
        this.branchCode = branchCode;
        this.status = status;
        this.joiningDate = joiningDate;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public String getBranchCode() { return branchCode; }
    public void setBranchCode(String branchCode) { this.branchCode = branchCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getJoiningDate() { return joiningDate; }
    public void setJoiningDate(String joiningDate) { this.joiningDate = joiningDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
