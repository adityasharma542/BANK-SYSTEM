package com.omnibank.banking.repository;

import com.omnibank.banking.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmpId(String empId);

    Optional<Employee> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmpId(String empId);

    List<Employee> findByDepartment(String department);

    List<Employee> findByStatus(String status);

    // Dynamic Search & Filter Query
    @Query("SELECT e FROM Employee e WHERE " +
           "(:search IS NULL OR LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.empId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.designation) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:dept IS NULL OR :dept = 'All' OR e.department = :dept) AND " +
           "(:status IS NULL OR :status = 'All' OR e.status = :status) " +
           "ORDER BY e.id DESC")
    List<Employee> searchEmployees(@Param("search") String search, 
                                  @Param("dept") String dept, 
                                  @Param("status") String status);
}
