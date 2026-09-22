import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  DollarSign,
  Building,
  PieChart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import StatCard from './components/StatCard';
import DepartmentChart from './components/DepartmentChart';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import ViewDetailModal from './components/ViewDetailModal';
import InterviewGuideModal from './components/InterviewGuideModal';

import {
  fetchEmployees,
  fetchDashboardStats,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportEmployeesCSV
} from './services/api';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  const [isInterviewGuideOpen, setIsInterviewGuideOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load All Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [empRes, statsRes] = await Promise.all([
        fetchEmployees({
          search: searchQuery,
          department: selectedDepartment,
          status: selectedStatus
        }),
        fetchDashboardStats()
      ]);

      if (empRes.success) {
        setEmployees(empRes.data);
        setDbStatus(empRes.dbStatus);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (error) {
      console.error('Error loading banking system data:', error);
      showToast('Error connecting to backend server. Make sure Node.js server is running on port 5000.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedDepartment, selectedStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create or Update Submit
  const handleFormSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (editingEmployee) {
        const res = await updateEmployee(editingEmployee.id, formData);
        showToast(res.message || 'Employee updated successfully!');
      } else {
        const res = await createEmployee(formData);
        showToast(res.message || 'New banking employee created!');
      }
      setIsFormModalOpen(false);
      setEditingEmployee(null);
      loadData();
    } catch (error) {
      showToast(error.message || 'Operation failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const res = await deleteEmployee(id);
      showToast(res.message || 'Employee record deleted');
      loadData();
    } catch (error) {
      showToast(error.message || 'Failed to delete employee', 'error');
    }
  };

  // Formatter for Currency
  const formatPayroll = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        dbStatus={dbStatus}
        onRefresh={loadData}
        onOpenInterviewGuide={() => setIsInterviewGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 flex-1 w-full space-y-6">
        
        {/* KPI Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Active Staff"
            value={stats ? stats.totalEmployees : 0}
            subtext={`${stats?.statusCounts?.active || 0} Currently On Duty`}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Monthly Payroll Spend"
            value={stats ? formatPayroll(stats.totalPayroll) : '₹0'}
            subtext="Total Monthly Salary Budget"
            icon={DollarSign}
            color="emerald"
          />
          <StatCard
            title="Active Bank Branches"
            value={stats ? stats.activeBranchesCount : 0}
            subtext="Regional Operations Units"
            icon={Building}
            color="purple"
          />
          <StatCard
            title="Departments"
            value={stats ? Object.keys(stats.departmentBreakdown || {}).length : 0}
            subtext="Banking Business Divisions"
            icon={PieChart}
            color="amber"
          />
        </div>

        {/* Department Visual Distribution Breakdown */}
        {stats && (
          <DepartmentChart
            departmentBreakdown={stats.departmentBreakdown}
            totalEmployees={stats.totalEmployees}
          />
        )}

        {/* Main Employee Directory Table Component */}
        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onAddClick={() => {
            setEditingEmployee(null);
            setIsFormModalOpen(true);
          }}
          onEditClick={(emp) => {
            setEditingEmployee(emp);
            setIsFormModalOpen(true);
          }}
          onViewClick={(emp) => {
            setViewingEmployee(emp);
            setIsDetailModalOpen(true);
          }}
          onDeleteClick={handleDelete}
          onExportCSV={exportEmployeesCSV}
        />

      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-500 py-4 border-t border-slate-200">
        <p>OmniBank Systems — Enterprise Employee Management System &copy; {new Date().getFullYear()}</p>
      </footer>

      {/* Add / Edit Form Modal */}
      <EmployeeModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
        isSaving={isSaving}
      />

      {/* View ID Card Detail Modal */}
      <ViewDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        employee={viewingEmployee}
      />

      {/* Interview Cheat Sheet Guide Modal */}
      <InterviewGuideModal
        isOpen={isInterviewGuideOpen}
        onClose={() => setIsInterviewGuideOpen(false)}
      />

    </div>
  );
}
