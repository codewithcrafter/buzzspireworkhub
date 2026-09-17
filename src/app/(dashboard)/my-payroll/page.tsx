"use client";

import { useState, useEffect } from "react";

export default function MyPayrollPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payroll/records`);
      const data = await res.json();
      setRecords(data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Payslips</h1>
          <p className="text-slate-500 text-sm">View your finalized payroll records</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded shadow-sm">Loading payslips...</div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded shadow-sm">No finalized payslips available yet.</div>
        ) : (
          records.map(r => (
            <div key={r.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="bg-slate-50 p-6 md:w-1/3 border-r border-slate-100 flex flex-col justify-center items-center text-center">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Total Net Pay</span>
                <span className="text-4xl font-bold text-emerald-600">₹{r.netPay.toFixed(2)}</span>
                <span className="mt-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">{r.status}</span>
                <a 
                  href={`/api/my-payroll/export/pdf?id=${r.id}`}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 shadow-sm"
                >
                  Download PDF
                </a>
              </div>
              <div className="p-6 flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Pay</span>
                    <span className="font-mono text-slate-700">₹{r.basePay.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overtime Pay</span>
                    <span className="font-mono text-slate-700">₹{r.overtimePay.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Pay</span>
                    <span className="font-mono font-bold text-slate-800">₹{r.grossPay.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Deductions</span>
                    <span className="font-mono font-bold text-rose-600">-₹{r.totalDeductions.toFixed(2)}</span>
                  </div>
                </div>

                {r.deductions?.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Deduction Details</span>
                    <ul className="space-y-1">
                      {r.deductions.map((d: any) => (
                        <li key={d.id} className="text-sm flex justify-between">
                          <span className="text-slate-600">{d.description}</span>
                          <span className="font-mono text-rose-600">-₹{d.amount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
