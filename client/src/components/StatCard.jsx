import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-slate-500 font-medium mt-1">{subtext}</p>}
        </div>
        <div className="p-3.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
