const { getPool, getStatus, inMemoryStore } = require('../config/db');

// Helper to check if MySQL is active
const isMySQL = () => getStatus().isMySQLConnected;

// 1. GET ALL EMPLOYEES (with search, filtering, and sorting)
exports.getAllEmployees = async (req, res) => {
  try {
    const { search = '', department = 'All', status = 'All', sortBy = 'id', order = 'DESC' } = req.query;

    if (isMySQL()) {
      const pool = getPool();
      let query = 'SELECT * FROM employees WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (full_name LIKE ? OR emp_id LIKE ? OR email LIKE ? OR designation LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (department && department !== 'All') {
        query += ' AND department = ?';
        params.push(department);
      }

      if (status && status !== 'All') {
        query += ' AND status = ?';
        params.push(status);
      }

      const validColumns = ['id', 'emp_id', 'full_name', 'salary', 'joining_date', 'department'];
      const sortCol = validColumns.includes(sortBy) ? sortBy : 'id';
      const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      query += ` ORDER BY ${sortCol} ${sortOrder}`;

      const [rows] = await pool.query(query, params);
      return res.status(200).json({
        success: true,
        count: rows.length,
        dbStatus: getStatus(),
        data: rows
      });
    } else {
      // In-Memory Fallback Filtering
      let result = [...inMemoryStore];

      if (search) {
        const q = search.toLowerCase();
        result = result.filter(e =>
          e.full_name.toLowerCase().includes(q) ||
          e.emp_id.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q)
        );
      }

      if (department && department !== 'All') {
        result = result.filter(e => e.department === department);
      }

      if (status && status !== 'All') {
        result = result.filter(e => e.status === status);
      }

      result.sort((a, b) => {
        if (order.toUpperCase() === 'ASC') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });

      return res.status(200).json({
        success: true,
        count: result.length,
        dbStatus: getStatus(),
        data: result
      });
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve employees', error: error.message });
  }
};

// 2. GET DASHBOARD METRICS & STATS
exports.getDashboardStats = async (req, res) => {
  try {
    let totalEmployees = 0;
    let totalPayroll = 0;
    let activeCount = 0;
    let onLeaveCount = 0;
    let suspendedCount = 0;
    let activeBranches = new Set();
    let departmentBreakdown = {};

    if (isMySQL()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM employees');

      totalEmployees = rows.length;
      rows.forEach(emp => {
        totalPayroll += Number(emp.salary || 0);
        if (emp.status === 'Active') activeCount++;
        else if (emp.status === 'On Leave') onLeaveCount++;
        else if (emp.status === 'Suspended') suspendedCount++;

        if (emp.branch_code) activeBranches.add(emp.branch_code);

        departmentBreakdown[emp.department] = (departmentBreakdown[emp.department] || 0) + 1;
      });
    } else {
      totalEmployees = inMemoryStore.length;
      inMemoryStore.forEach(emp => {
        totalPayroll += Number(emp.salary || 0);
        if (emp.status === 'Active') activeCount++;
        else if (emp.status === 'On Leave') onLeaveCount++;
        else if (emp.status === 'Suspended') suspendedCount++;

        if (emp.branch_code) activeBranches.add(emp.branch_code);

        departmentBreakdown[emp.department] = (departmentBreakdown[emp.department] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        totalPayroll,
        activeBranchesCount: activeBranches.size,
        statusCounts: {
          active: activeCount,
          onLeave: onLeaveCount,
          suspended: suspendedCount
        },
        departmentBreakdown
      },
      dbStatus: getStatus()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate stats', error: error.message });
  }
};

// 3. GET SINGLE EMPLOYEE BY ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMySQL()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      return res.status(200).json({ success: true, data: rows[0] });
    } else {
      const employee = inMemoryStore.find(e => e.id === Number(id));
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      return res.status(200).json({ success: true, data: employee });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving employee', error: error.message });
  }
};

// 4. CREATE NEW EMPLOYEE
exports.createEmployee = async (req, res) => {
  try {
    const { full_name, email, department, designation, salary, branch_code, status = 'Active', joining_date } = req.body;

    if (!full_name || !email || !department || !designation || !salary || !branch_code || !joining_date) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (isMySQL()) {
      const pool = getPool();

      // Check duplicate email
      const [existing] = await pool.query('SELECT id FROM employees WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
      }

      // Generate Auto Emp ID if not supplied
      const [countRow] = await pool.query('SELECT COUNT(*) as count FROM employees');
      const nextNum = 1001 + countRow[0].count;
      const emp_id = req.body.emp_id || `EMP-${nextNum}`;

      const [result] = await pool.query(
        `INSERT INTO employees (emp_id, full_name, email, department, designation, salary, branch_code, status, joining_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [emp_id, full_name, email, department, designation, parseFloat(salary), branch_code, status, joining_date]
      );

      const [newEmp] = await pool.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);

      return res.status(201).json({
        success: true,
        message: 'Employee created successfully in MySQL database',
        data: newEmp[0]
      });
    } else {
      // In-Memory store insertion
      if (inMemoryStore.some(e => e.email === email)) {
        return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
      }

      const nextNum = 1001 + inMemoryStore.length;
      const emp_id = req.body.emp_id || `EMP-${nextNum}`;
      const newId = inMemoryStore.length > 0 ? Math.max(...inMemoryStore.map(e => e.id)) + 1 : 1;

      const newEmp = {
        id: newId,
        emp_id,
        full_name,
        email,
        department,
        designation,
        salary: parseFloat(salary),
        branch_code,
        status,
        joining_date,
        created_at: new Date().toISOString()
      };

      inMemoryStore.unshift(newEmp);

      return res.status(201).json({
        success: true,
        message: 'Employee created successfully (In-Memory)',
        data: newEmp
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create employee', error: error.message });
  }
};

// 5. UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, department, designation, salary, branch_code, status, joining_date } = req.body;

    if (isMySQL()) {
      const pool = getPool();
      const [existing] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      await pool.query(
        `UPDATE employees 
         SET full_name = ?, email = ?, department = ?, designation = ?, salary = ?, branch_code = ?, status = ?, joining_date = ?
         WHERE id = ?`,
        [
          full_name || existing[0].full_name,
          email || existing[0].email,
          department || existing[0].department,
          designation || existing[0].designation,
          salary ? parseFloat(salary) : existing[0].salary,
          branch_code || existing[0].branch_code,
          status || existing[0].status,
          joining_date || existing[0].joining_date,
          id
        ]
      );

      const [updated] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
      return res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: updated[0]
      });
    } else {
      const index = inMemoryStore.findIndex(e => e.id === Number(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      inMemoryStore[index] = {
        ...inMemoryStore[index],
        full_name: full_name || inMemoryStore[index].full_name,
        email: email || inMemoryStore[index].email,
        department: department || inMemoryStore[index].department,
        designation: designation || inMemoryStore[index].designation,
        salary: salary ? parseFloat(salary) : inMemoryStore[index].salary,
        branch_code: branch_code || inMemoryStore[index].branch_code,
        status: status || inMemoryStore[index].status,
        joining_date: joining_date || inMemoryStore[index].joining_date,
        updated_at: new Date().toISOString()
      };

      return res.status(200).json({
        success: true,
        message: 'Employee updated successfully (In-Memory)',
        data: inMemoryStore[index]
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update employee', error: error.message });
  }
};

// 6. DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMySQL()) {
      const pool = getPool();
      const [existing] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      await pool.query('DELETE FROM employees WHERE id = ?', [id]);
      return res.status(200).json({
        success: true,
        message: `Employee ${existing[0].emp_id} (${existing[0].full_name}) deleted successfully`
      });
    } else {
      const index = inMemoryStore.findIndex(e => e.id === Number(id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      const deleted = inMemoryStore.splice(index, 1)[0];
      return res.status(200).json({
        success: true,
        message: `Employee ${deleted.emp_id} (${deleted.full_name}) deleted successfully`
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete employee', error: error.message });
  }
};

// 7. EXPORT CSV
exports.exportCSV = async (req, res) => {
  try {
    let list = [];
    if (isMySQL()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM employees ORDER BY id DESC');
      list = rows;
    } else {
      list = inMemoryStore;
    }

    let csvContent = 'Emp ID,Full Name,Email,Department,Designation,Salary (INR),Branch Code,Status,Joining Date\n';
    list.forEach(emp => {
      csvContent += `"${emp.emp_id}","${emp.full_name}","${emp.email}","${emp.department}","${emp.designation}",${emp.salary},"${emp.branch_code}","${emp.status}","${emp.joining_date}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="Apex_Banking_Employees.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Export failed', error: error.message });
  }
};
