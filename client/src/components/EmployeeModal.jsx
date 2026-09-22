import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Retail Banking',
  'Corporate Banking',
  'Risk & Compliance',
  'IT & Cybersecurity',
  'Loan Processing',
  'Forex & Investment'
];

const STATUS_OPTIONS = ['Active', 'On Leave', 'Suspended'];

export default function EmployeeModal({ isOpen, onClose, onSubmit, initialData = null, isSaving }) {
  const [formData, setFormData] = useState({
    emp_id: '',
    full_name: '',
    email: '',
    department: 'Retail Banking',
    designation: '',
    salary: '',
    branch_code: 'BR-MUM-01',
    status: 'Active',
    joining_date: new Date().toISOString().split('T')[0]
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        emp_id: initialData.emp_id || '',
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        department: initialData.department || 'Retail Banking',
        designation: initialData.designation || '',
        salary: initialData.salary || '',
        branch_code: initialData.branch_code || 'BR-MUM-01',
        status: initialData.status || 'Active',
        joining_date: initialData.joining_date ? initialData.joining_date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        emp_id: '',
        full_name: '',
        email: '',
        department: 'Retail Banking',
        designation: '',
        salary: '',
        branch_code: 'BR-MUM-01',
        status: 'Active',
        joining_date: new Date().toISOString().split('T')[0]
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) return setError('Full Name is required');
    if (!formData.email.trim()) return setError('Email Address is required');
    if (!formData.designation.trim()) return setError('Designation is required');
    if (!formData.salary || isNaN(formData.salary) || Number(formData.salary) <= 0) {
      return setError('Please enter a valid salary amount');
    }

    setError('');
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              {initialData ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialData ? `Edit Employee Record (${initialData.emp_id})` : 'Add New Banking Employee'}
              </h3>
              <p className="text-xs text-slate-500">Fill in the official bank employee credential details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Employee ID (Optional / Auto) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emp ID (Optional / Auto)</label>
              <input
                type="text"
                name="emp_id"
                placeholder="e.g. EMP-1009 (Leave empty for auto)"
                value={formData.emp_id}
                onChange={handleChange}
                disabled={Boolean(initialData)}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none disabled:opacity-60"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="full_name"
                required
                placeholder="e.g. Rajesh Malhotra"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none"
              />
            </div>

            {/* Official Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. rajesh.m@omnibank.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none bg-white text-slate-800"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Designation / Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role *</label>
              <input
                type="text"
                name="designation"
                required
                placeholder="e.g. Senior Branch Auditor"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none"
              />
            </div>

            {/* Monthly Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (INR / ₹) *</label>
              <input
                type="number"
                name="salary"
                required
                min="1000"
                step="500"
                placeholder="e.g. 85000"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none font-mono"
              />
            </div>

            {/* Branch Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Branch Code *</label>
              <input
                type="text"
                name="branch_code"
                required
                placeholder="e.g. BR-MUM-01"
                value={formData.branch_code}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none font-mono uppercase"
              />
            </div>

            {/* Employment Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none bg-white text-slate-800"
              >
                {STATUS_OPTIONS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Joining Date *</label>
              <input
                type="date"
                name="joining_date"
                required
                value={formData.joining_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg glass-input text-xs focus:outline-none text-slate-800"
              />
            </div>

          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : (initialData ? 'Update Record' : 'Save Employee')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
