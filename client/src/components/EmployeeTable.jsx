import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Eye,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  AlertCircle
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Retail Banking',
  'Corporate Banking',
  'Risk & Compliance',
  'IT & Cybersecurity',
  'Loan Processing',
  'Forex & Investment'
];

const STATUS_LIST = ['All', 'Active', 'On Leave', 'Suspended'];

export default function EmployeeTable({
  employees = [],
  isLoading,
  onAddClick,
  onEditClick,
  onViewClick,
  onDeleteClick,
  onExportCSV,
  searchQuery,
  setSearchQuery,
  selectedDepartment,
  setSelectedDepartment,
  selectedStatus,
  setSelectedStatus
}) {
  const [viewMode, setViewMode] = useState('table');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Suspended':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDeptColor = () => {
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      
      {/* Action Toolbar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        
        {/* Left Title & Count */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Bank Employees Directory</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              {employees.length} Records
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage employee roles, departments, compensations & access statuses</p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Name, ID, Role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-input text-xs focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-1.5 glass-input px-3 py-1 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none text-xs cursor-pointer font-medium"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept} className="bg-white text-slate-800">{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 glass-input px-3 py-1 rounded-xl text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none text-xs cursor-pointer font-medium"
            >
              {STATUS_LIST.map(st => (
                <option key={st} value={st} className="bg-white text-slate-800">Status: {st}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          {/* Add Employee Button */}
          <button
            onClick={onAddClick}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>

        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500 font-medium">Fetching banking employee database records...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No Matching Employee Records</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or department filters</p>
        </div>
      ) : viewMode === 'table' ? (
        
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Emp ID & Name</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Designation</th>
                <th className="px-4 py-3.5">Monthly Salary</th>
                <th className="px-4 py-3.5">Branch Code</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition group">
                  
                  {/* Emp ID & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                        {emp.full_name ? emp.full_name.charAt(0) : 'E'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">{emp.full_name}</div>
                        <div className="text-[11px] font-mono font-medium text-slate-500">{emp.emp_id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getDeptColor(emp.department)}`}>
                      {emp.department}
                    </span>
                  </td>

                  {/* Designation */}
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {emp.designation}
                  </td>

                  {/* Salary */}
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {formatCurrency(emp.salary)}
                  </td>

                  {/* Branch Code */}
                  <td className="px-4 py-3 font-mono text-slate-700 font-medium">
                    {emp.branch_code}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3 text-right">
                    {deleteConfirmId === emp.id ? (
                      <div className="flex items-center justify-end space-x-1">
                        <span className="text-[10px] text-rose-600 font-bold mr-1">Confirm?</span>
                        <button
                          onClick={() => {
                            onDeleteClick(emp.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onViewClick(emp)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="View Identity Card"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditClick(emp)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(emp.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-rose-600 transition"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      ) : (
        
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-400 shadow-sm transition group relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-extrabold flex items-center justify-center text-sm">
                    {emp.full_name ? emp.full_name.charAt(0) : 'E'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">{emp.full_name}</h3>
                    <span className="text-xs font-mono font-medium text-slate-500">{emp.emp_id}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(emp.status)}`}>
                  {emp.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{emp.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-semibold text-slate-800">{emp.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Salary:</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(emp.salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch Code:</span>
                  <span className="font-mono font-medium text-slate-700">{emp.branch_code}</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onViewClick(emp)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>
                <button
                  onClick={() => onEditClick(emp)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteClick(emp.id)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-rose-600 text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
}
