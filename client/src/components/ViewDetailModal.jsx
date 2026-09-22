import React from 'react';
import { X, Building, Mail, Calendar, DollarSign, Shield, MapPin } from 'lucide-react';

export default function ViewDetailModal({ employee, isOpen, onClose }) {
  if (!isOpen || !employee) return null;

  const formattedSalary = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(employee.salary || 0);

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

  const getInitials = (name) => {
    if (!name) return 'OB';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative">
        
        {/* Card Header Gradient */}
        <div className="h-28 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-blue-100 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>OmniBank Identity Card</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar and Primary Details */}
          <div className="flex items-end space-x-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white flex items-center justify-center text-xl font-extrabold text-blue-700 shadow-lg ring-2 ring-blue-500/20">
              {getInitials(employee.full_name)}
            </div>
            <div className="pb-1">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{employee.full_name}</h3>
              <p className="text-xs text-blue-700 font-semibold">{employee.designation}</p>
            </div>
          </div>

          {/* Status & Emp ID Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 mb-5">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Employee ID</span>
              <span className="text-sm font-mono font-bold text-amber-700">{employee.emp_id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-right font-bold">Account Status</span>
              <span className={`inline-block px-3 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(employee.status)}`}>
                {employee.status}
              </span>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs mb-5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Department</span>
              </div>
              <p className="font-semibold text-slate-900">{employee.department}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Branch Code</span>
              </div>
              <p className="font-mono font-semibold text-slate-900">{employee.branch_code}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Monthly Compensation</span>
              </div>
              <p className="font-mono font-bold text-emerald-700">{formattedSalary}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Date Joined</span>
              </div>
              <p className="font-mono font-semibold text-slate-900">
                {new Date(employee.joining_date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Official Email</span>
              <a href={`mailto:${employee.email}`} className="text-xs text-blue-600 hover:underline font-semibold">
                {employee.email}
              </a>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border border-slate-300"
          >
            Close Identity Card
          </button>

        </div>
      </div>
    </div>
  );
}
