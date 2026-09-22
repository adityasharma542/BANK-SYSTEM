import React, { useState } from 'react';
import { X, BookOpen, Database, Code, ShieldCheck, Copy, Sparkles } from 'lucide-react';

export default function InterviewGuideModal({ isOpen, onClose }) {
  const [copiedSection, setCopiedSection] = useState('');

  if (!isOpen) return null;

  const copyToClipboard = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const projectPitchText = `Sir, I have built a Full-Stack Enterprise Employee Management System for OmniBank Systems. 
It features a Java Spring Boot RESTful API backend connected to a relational database, and an interactive React SPA dashboard frontend.
Key features include:
1. Full CRUD Operations (Create, Read, Update, Delete banking employee profiles).
2. Dynamic Workforce Analytics (Total Payroll, Department Breakdown, Active Branch tracking).
3. Resilient Database Layer (Relational database with connection management and automated seeding).
4. Live Search & Multi-Filter Query Optimization.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Interview Cheat Sheet & Explanatory Guide
              </h3>
              <p className="text-xs text-slate-500">Read this for 1 minute before explaining your project to the interviewer!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs">
          
          {/* Section 1: 30-Second Elevator Pitch */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                1. What to say in Interview (30-Sec Summary / 30 second pitch)
              </h4>
              <button
                onClick={() => copyToClipboard(projectPitchText, 'pitch')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-300 shadow-sm"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedSection === 'pitch' ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <p className="text-slate-800 leading-relaxed font-sans text-xs bg-white p-3 rounded-xl border border-blue-200 font-medium">
              "{projectPitchText}"
            </p>
          </div>

          {/* Section 2: Architecture & Tech Stack */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-600" />
              2. System Architecture & Tech Stack
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-amber-700 font-bold block mb-1">Frontend Layer</span>
                <p className="text-slate-600">React SPA built with Vite. Clean corporate light UI, Lucide icons, live search filters & interactive modals.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 bg-slate-50 border border-slate-200">
                <span className="text-blue-700 font-bold block mb-1">Backend API</span>
                <p className="text-slate-600">Java Spring Boot REST API following Controller-Service-Repository architecture with CORS & JSON serialization.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-emerald-700 font-bold block mb-1">Database & SQL</span>
                <p className="text-slate-600">Relational DB with connection pooling, automated table schema seeding, and index optimizations on `emp_id` and `department`.</p>
              </div>

            </div>
          </div>

          {/* Section 3: Database & SQL Schema */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              3. Database Table Structure (`employees`)
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 font-mono text-[11px] border border-slate-800 text-slate-200">
              <div className="text-slate-400 mb-1">// SQL Table Definition:</div>
              <div className="text-blue-400 font-bold">CREATE TABLE employees (</div>
              <div className="pl-4 text-slate-300">
                <div>id INT AUTO_INCREMENT PRIMARY KEY,</div>
                <div>emp_id VARCHAR(20) UNIQUE, <span className="text-slate-500">// e.g. EMP-1001</span></div>
                <div>full_name VARCHAR(100),</div>
                <div>email VARCHAR(100) UNIQUE,</div>
                <div>department VARCHAR(50), <span className="text-slate-500">// Retail, Corporate, Risk, IT</span></div>
                <div>designation VARCHAR(60),</div>
                <div>salary DECIMAL(12,2),</div>
                <div>branch_code VARCHAR(20),</div>
                <div>status ENUM('Active', 'On Leave', 'Suspended'),</div>
                <div>joining_date DATE</div>
              </div>
              <div className="text-blue-400 font-bold">);</div>
            </div>
          </div>

          {/* Section 4: Expected Interview Questions & Quick Answers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-purple-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              4. Common Interview Questions & Answers
            </h4>
            
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Q1: How do you connect Java Backend to MySQL / Database?</span>
                <p className="text-slate-600">
                  "I use Spring Data JPA / Hibernate mapped to the relational database. Connection pooling automatically handles connection reuse efficiently for high-concurrency requests."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Q2: How are CRUD operations performed?</span>
                <p className="text-slate-600">
                  "I implemented RESTful endpoints: <code className="text-blue-700 bg-slate-200 px-1 py-0.5 rounded font-mono">GET /api/employees</code> for retrieval, <code className="text-emerald-700 bg-slate-200 px-1 py-0.5 rounded font-mono">POST</code> for creation, <code className="text-purple-700 bg-slate-200 px-1 py-0.5 rounded font-mono">PUT</code> for updates, and <code className="text-rose-700 bg-slate-200 px-1 py-0.5 rounded font-mono">DELETE</code> for removal."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Q3: How do you prevent SQL Injection attacks?</span>
                <p className="text-slate-600">
                  "By leveraging JPA / Hibernate parameterized queries, user inputs are sanitized and escaped before database execution."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">OmniBank Systems — Interview Guide v2.4</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-sm"
          >
            Got It! Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
