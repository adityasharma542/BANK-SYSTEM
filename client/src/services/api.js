const API_BASE = '/api/employees';

export const fetchEmployees = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}?${query}`);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
};

export const fetchDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const fetchEmployeeById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch employee detail');
  return res.json();
};

export const createEmployee = async (employeeData) => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create employee');
  return data;
};

export const updateEmployee = async (id, employeeData) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update employee');
  return data;
};

export const deleteEmployee = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete employee');
  return data;
};

export const exportEmployeesCSV = () => {
  window.open(`${API_BASE}/export/csv`, '_blank');
};
