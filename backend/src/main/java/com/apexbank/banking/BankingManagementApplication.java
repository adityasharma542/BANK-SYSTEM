package com.apexbank.banking;

import com.apexbank.banking.model.Employee;
import com.apexbank.banking.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class BankingManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankingManagementApplication.class, args);
        System.out.println("=======================================================");
        System.out.println("🚀 [JAVA SPRING BOOT BANKING SYSTEM REST API STARTED]");
        System.out.println("📍 API Base URL: http://localhost:8080/api/employees");
        System.out.println("📊 Dashboard Stats: http://localhost:8080/api/employees/stats");
        System.out.println("=======================================================");
    }

    // Auto Seed Data Runner on application startup
    @Bean
    public CommandLineRunner seedDatabase(EmployeeRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                System.out.println("🌱 [MySQL Database Seeding] Populating default sample banking employees...");

                List<Employee> seedList = Arrays.asList(
                    new Employee("EMP-1001", "Rahul Sharma", "rahul.sharma@apexbank.com", "Retail Banking", "Senior Branch Manager", 95000.00, "BR-MUM-01", "Active", "2021-03-15"),
                    new Employee("EMP-1002", "Priya Patel", "priya.patel@apexbank.com", "Risk & Compliance", "Chief Compliance Officer", 120000.00, "BR-DEL-02", "Active", "2019-08-10"),
                    new Employee("EMP-1003", "Vikramaditya Singh", "vikram.singh@apexbank.com", "Corporate Banking", "Relationship Officer", 78000.00, "BR-BLR-04", "Active", "2022-01-20"),
                    new Employee("EMP-1004", "Ananya Deshmukh", "ananya.d@apexbank.com", "IT & Cybersecurity", "Lead Security Architect", 135000.00, "BR-MUM-01", "Active", "2020-05-12"),
                    new Employee("EMP-1005", "Amit Kumar", "amit.kumar@apexbank.com", "Loan Processing", "Senior Credit Analyst", 68000.00, "BR-HYD-05", "On Leave", "2021-11-01"),
                    new Employee("EMP-1006", "Sneha Reddy", "sneha.reddy@apexbank.com", "Forex & Investment", "Treasury Operations Head", 110000.00, "BR-MUM-01", "Active", "2018-04-18"),
                    new Employee("EMP-1007", "Rohan Mehta", "rohan.mehta@apexbank.com", "Retail Banking", "Teller / Desk Executive", 45000.00, "BR-PUN-03", "Active", "2023-02-14"),
                    new Employee("EMP-1008", "Kavita Verma", "kavita.v@apexbank.com", "Risk & Compliance", "Fraud Analyst", 72000.00, "BR-DEL-02", "Suspended", "2022-07-09")
                );

                repository.saveAll(seedList);
                System.out.println("✅ [MySQL Database] Initial seed records inserted successfully!");
            }
        };
    }
}
