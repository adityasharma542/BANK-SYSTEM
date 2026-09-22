package com.omnibank.banking.service;

import com.omnibank.banking.config.DatabaseConfig;
import com.omnibank.banking.model.Employee;
import com.omnibank.banking.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // Get All Employees with Search & Filters
    public List<Employee> getAllEmployees(String search, String department, String status) {
        String searchParam = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return employeeRepository.searchEmployees(searchParam, department, status);
    }

    // Get Employee by ID
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    // Create New Employee
    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Employee with email '" + employee.getEmail() + "' already exists!");
        }

        // Auto-generate Emp ID if missing
        if (employee.getEmpId() == null || employee.getEmpId().trim().isEmpty()) {
            long count = employeeRepository.count();
            employee.setEmpId("EMP-" + (1001 + count));
        }

        if (employee.getStatus() == null || employee.getStatus().trim().isEmpty()) {
            employee.setStatus("Active");
        }

        return employeeRepository.save(employee);
    }

    // Update Employee
    public Employee updateEmployee(Long id, Employee updatedData) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Employee with ID " + id + " not found!"));

        if (updatedData.getFullName() != null) existing.setFullName(updatedData.getFullName());
        if (updatedData.getEmail() != null) existing.setEmail(updatedData.getEmail());
        if (updatedData.getDepartment() != null) existing.setDepartment(updatedData.getDepartment());
        if (updatedData.getDesignation() != null) existing.setDesignation(updatedData.getDesignation());
        if (updatedData.getSalary() != null) existing.setSalary(updatedData.getSalary());
        if (updatedData.getBranchCode() != null) existing.setBranchCode(updatedData.getBranchCode());
        if (updatedData.getStatus() != null) existing.setStatus(updatedData.getStatus());
        if (updatedData.getJoiningDate() != null) existing.setJoiningDate(updatedData.getJoiningDate());

        return employeeRepository.save(existing);
    }

    // Delete Employee
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new NoSuchElementException("Employee with ID " + id + " not found!");
        }
        employeeRepository.deleteById(id);
    }

    // Calculate Dashboard KPI Stats
    public Map<String, Object> getDashboardStats() {
        List<Employee> all = employeeRepository.findAll();

        long totalEmployees = all.size();
        double totalPayroll = all.stream().mapToDouble(e -> e.getSalary() != null ? e.getSalary() : 0.0).sum();

        long activeCount = all.stream().filter(e -> "Active".equalsIgnoreCase(e.getStatus())).count();
        long onLeaveCount = all.stream().filter(e -> "On Leave".equalsIgnoreCase(e.getStatus())).count();
        long suspendedCount = all.stream().filter(e -> "Suspended".equalsIgnoreCase(e.getStatus())).count();

        Set<String> activeBranches = all.stream()
                .map(Employee::getBranchCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, Long> departmentBreakdown = all.stream()
                .filter(e -> e.getDepartment() != null)
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", totalEmployees);
        stats.put("totalPayroll", totalPayroll);
        stats.put("activeBranchesCount", activeBranches.size());
        
        // Database Type Status Info
        stats.put("isUsingMySQL", DatabaseConfig.IS_USING_MYSQL);
        stats.put("dbStatusMessage", DatabaseConfig.DB_STATUS_MESSAGE);

        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("active", activeCount);
        statusCounts.put("onLeave", onLeaveCount);
        statusCounts.put("suspended", suspendedCount);
        stats.put("statusCounts", statusCounts);
        
        stats.put("departmentBreakdown", departmentBreakdown);

        return stats;
    }

    // Generate CSV Content
    public String generateCSV() {
        List<Employee> list = employeeRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("Emp ID,Full Name,Email,Department,Designation,Salary (INR),Branch Code,Status,Joining Date\n");

        for (Employee emp : list) {
            csv.append("\"").append(emp.getEmpId()).append("\",")
               .append("\"").append(emp.getFullName()).append("\",")
               .append("\"").append(emp.getEmail()).append("\",")
               .append("\"").append(emp.getDepartment()).append("\",")
               .append("\"").append(emp.getDesignation()).append("\",")
               .append(emp.getSalary()).append(",")
               .append("\"").append(emp.getBranchCode()).append("\",")
               .append("\"").append(emp.getStatus()).append("\",")
               .append("\"").append(emp.getJoiningDate()).append("\"\n");
        }

        return csv.toString();
    }
}
