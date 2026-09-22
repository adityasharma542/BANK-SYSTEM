import React, { useState, useEffect } from 'react';
import { Building2, Database, RefreshCw } from 'lucide-react';

export default function Navbar({ dbStatus, onRefresh }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isMySQL = dbStatus?.isMySQLConnected;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & System Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              OMNIBANK SYSTEMS
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span>Employee Management Portal</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-slate-500 font-mono text-[11px]">{time}</span>
            </p>
          </div>
        </div>

        {/* Database Status & Refresh */}
        <div className="flex items-center flex-wrap justify-center md:justify-end gap-3">
          
          {/* Database Live Status Indicator */}
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-emerald-50 border-emerald-200 text-emerald-700">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="inline-block w-2 h-2 rounded-full animate-ping bg-emerald-500"></span>
            <span>
              DB: {dbStatus?.dbStatusMessage || (isMySQL ? 'MySQL Relational DB (Port 3306)' : 'Persistent Relational Store')}
            </span>
          </div>

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Data</span>
          </button>

        </div>

      </div>
    </header>
  );
}
