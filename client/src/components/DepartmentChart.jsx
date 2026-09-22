import React from 'react';
import { PieChart } from 'lucide-react';

export default function DepartmentChart({ departmentBreakdown = {}, totalEmployees = 0 }) {
  const departments = Object.entries(departmentBreakdown);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <PieChart className="w-5 h-5 text-slate-700" />
          <h2 className="text-base font-bold text-slate-900 tracking-wide">Workforce Distribution by Department</h2>
        </div>
        <span className="text-xs text-slate-500 font-semibold">{departments.length} Active Departments</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map(([dept, count]) => {
          const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;

          return (
            <div key={dept} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  {dept}
                </span>
                <span className="text-slate-700 font-mono">{count} Staff ({percentage}%)</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
