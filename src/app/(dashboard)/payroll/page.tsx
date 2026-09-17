"use client";

import { useState, useEffect } from "react";

export default function AdminPayrollPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payroll/records?month=${month}&year=${year}`);
      const data = await res.json();
      setRecords(data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [month, year]);

  const handleCalculate = async () => {
    if (!confirm(`Are you sure you want to recalculate payroll for ${month}/${year}? This will overwrite current drafts.`)) return;
    setCalculating(true);
    try {
      const res = await fetch("/api/payroll/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year })
      });
      if (res.ok) {
        fetchRecords();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
    }
    setCalculating(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payroll Run</h1>
          <p className="text-slate-500 text-sm">Calculate and view monthly payroll</p>
        </div>
        <div className="flex gap-4 items-center">
          <input 
            type="number" 
            min="1" max="12" 
            value={month} 
            onChange={e => setMonth(parseInt(e.target.value))} 
            className="border rounded p-2 text-sm w-20"
          />
          <input 
            type="number" 
            value={year} 
            onChange={e => setYear(parseInt(e.target.value))} 
            className="border rounded p-2 text-sm w-24"
          />
          <button 
            onClick={handleCalculate}
            disabled={calculating}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {calculating ? "Calculating..." : "Run Payroll"}
          </button>
          <a
            href={`/api/payroll/export/csv?month=${month}&year=${year}`}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded hover:bg-slate-200 border border-slate-300"
          >
            Export CSV
          </a>
          <a
            href={`/api/payroll/export/pdf?month=${month}&year=${year}`}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded hover:bg-slate-200 border border-slate-300"
          >
            Export PDF
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading payroll data...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No payroll records found for this period. Click "Run Payroll" to generate drafts.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800">
              <tr>
                <th className="p-4 font-semibold">Employee</th>
                <th className="p-4 font-semibold">Base Pay</th>
                <th className="p-4 font-semibold">Overtime</th>
                <th className="p-4 font-semibold">Gross Pay</th>
                <th className="p-4 font-semibold">Deductions</th>
                <th className="p-4 font-semibold">Net Pay</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(r => {
                const dept = r.departmentSnapshot as any;
                return (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{r.employee?.fullName}</div>
                    <div className="text-xs text-slate-500">{dept?.name || "Department not recorded"}</div>
                  </td>
                  <td className="p-4 font-mono">₹{r.basePay.toFixed(2)}</td>
                  <td className="p-4 font-mono">₹{r.overtimePay.toFixed(2)}</td>
                  <td className="p-4 font-mono text-slate-800 font-medium">₹{r.grossPay.toFixed(2)}</td>
                  <td className="p-4 font-mono text-rose-600">
                    -₹{r.totalDeductions.toFixed(2)}
                    {r.deductions.length > 0 && <div className="text-[10px] text-rose-400">{r.deductions.length} deductions</div>}
                  </td>
                  <td className="p-4 font-mono text-emerald-600 font-bold">₹{r.netPay.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${r.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
