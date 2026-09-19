"use client";

import { motion } from "framer-motion";
import { Shield, Home, TrendingUp, Calendar, Clock, Activity, Terminal } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInterviewStore } from "@/store/useInterviewStore";
import { useEffect, useState } from "react";

export default function ProgressPage() {
  const { history } = useInterviewStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format data for chart
  const chartData = [...history].reverse().map((record, index) => ({
    name: `Session ${index + 1}`,
    score: record.overallScore,
    wpm: record.averageWpm,
    date: new Date(record.date).toLocaleDateString(),
  }));

  const totalInterviews = history.length;
  const avgWpm = history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.averageWpm, 0) / history.length) : 0;
  const avgScore = history.length > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / history.length) : 0;

  if (!mounted) return null; // Avoid hydration errors due to persist middleware

  return (
    <main className="flex-1 flex flex-col relative min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden p-6 md:p-12">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[60%] -translate-x-1/2 w-[70%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <header className="w-full flex justify-between items-center z-10 mb-12 max-w-6xl mx-auto border-b border-slate-800/50 pb-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">InterviewShield V3.0</span>
        </Link>
        <Link 
          href="/"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 shadow-sm"
        >
          <Home className="w-4 h-4" />
          Return_to_Dashboard
        </Link>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto z-10 flex flex-col gap-10 pb-20">
        
        <div className="mb-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-2">
            <Terminal className="w-3 h-3" /> Historical_Telemetry
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight">Aggregated Progress</h1>
          <p className="text-slate-400 text-lg">Track your interview performance metrics and consistency over time.</p>
        </div>

        {history.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-16 text-center border border-slate-800 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 relative z-10">
              <Activity className="w-10 h-10 text-indigo-500/50" />
            </div>
            <h2 className="text-2xl font-bold text-white relative z-10">No Telemetry Detected</h2>
            <p className="text-slate-400 max-w-md relative z-10">Deploy your first interview session to begin logging performance metrics and generating historical progress vectors.</p>
            <Link href="/setup" className="mt-4 px-8 py-4 bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-600/30 transition-colors uppercase tracking-widest text-sm font-bold rounded-xl relative z-10">
              Initialize_Session
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 z-10">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="z-10">
                  <div className="text-4xl font-mono text-white mb-1 tracking-tighter">{totalInterviews}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Sessions</div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 z-10">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="z-10">
                  <div className="text-4xl font-mono text-white mb-1 tracking-tighter">{avgScore}<span className="text-xl text-slate-600">/100</span></div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Overall Score</div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 z-10">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="z-10">
                  <div className="text-4xl font-mono text-white mb-1 tracking-tighter">{avgWpm}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Pacing (WPM)</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-400"/> Score Trajectory</h3>
              </div>
              <div className="h-80 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace'}} />
                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace'}} />
                    <Tooltip cursor={{ fill: '#0f172a' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={4} dot={{r: 6, fill: '#818cf8', strokeWidth: 2, stroke: '#1e293b'}} activeDot={{r: 8, strokeWidth: 0}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-xl text-white border-b border-slate-800 pb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" /> Past Sessions Log
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {history.map((record) => (
                  <div key={record.id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-colors">
                    <div>
                      <div className="text-[10px] font-mono text-indigo-400 mb-2 uppercase tracking-widest">{new Date(record.date).toLocaleDateString()} // {new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      <h4 className="text-xl font-bold text-white mb-1">{record.role}</h4>
                      <p className="text-sm text-slate-400 font-mono">Lvl: {record.level} <span className="mx-2 text-slate-700">|</span> Exp: <span className="uppercase text-slate-300">{record.dominantExpression}</span></p>
                    </div>
                    <div className="flex gap-6 items-center bg-slate-950 px-6 py-4 rounded-xl border border-slate-800">
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">WPM</div>
                        <div className="text-xl font-mono text-white">{record.averageWpm}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-800"></div>
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fillers</div>
                        <div className="text-xl font-mono text-white">{record.totalFillerWords}</div>
                      </div>
                      <div className="w-px h-8 bg-slate-800"></div>
                      <div className="text-center">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Score</div>
                        <div className="text-3xl font-mono text-emerald-400 tracking-tighter">{record.overallScore}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
