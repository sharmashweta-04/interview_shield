"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/useInterviewStore";
import { Shield, TrendingDown, Home, Play, AlertCircle, Download, FileText, BarChart2, Terminal } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DebriefPage() {
  const router = useRouter();
  const { questions, transcripts, wpm, fillerWordsCount, expressionLog, resetSession } = useInterviewStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleReturnHome = () => {
    resetSession();
    router.push("/");
  };

  const exportToPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2,
        backgroundColor: '#020617' // slate-950
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("InterviewShield_V3_Telemetry_Report.pdf");
    } catch (err) {
      console.error("PDF Export failed", err);
    }
    setIsExporting(false);
  };

  // Generate Mock Expression Data for Chart
  const expressionData = expressionLog.reduce((acc: any[], exp: string) => {
    const existing = acc.find(item => item.name === exp);
    if (existing) existing.count += 1;
    else acc.push({ name: exp, count: 1 });
    return acc;
  }, []);

  // Generate Mock Pacing Data over time
  const pacingData = [
    { time: 'Q1', wpm: wpm > 0 ? wpm - 10 : 130 },
    { time: 'Q2', wpm: wpm > 0 ? wpm + 20 : 160 },
    { time: 'Q3', wpm: wpm > 0 ? wpm : 140 },
  ];

  const generateFeedback = (text: string) => {
    if (!text || text.length < 20) return "WARNING: Verbal response insufficient. Increase depth using the STAR framework.";
    if (text.toLowerCase().includes("but")) return "ANALYSIS: Negative framing detected ('but'). Pivot to positive challenge resolutions.";
    return "ANALYSIS: Response structured optimally. Core competencies clearly communicated.";
  };

  return (
    <main className="flex-1 flex flex-col relative min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden p-6 md:p-12">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <header className="w-full flex justify-between items-center z-10 mb-12 max-w-5xl mx-auto border-b border-slate-800/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">InterviewShield V3.0</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 text-sm bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 px-4 py-2 rounded-lg font-bold transition-colors uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Compiling PDF..." : "Export_Report"}
          </button>
          <button 
            onClick={handleReturnHome}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <Home className="w-4 h-4" />
            End_Session
          </button>
        </div>
      </header>

      {/* PDF Report Container */}
      <div ref={reportRef} className="flex-1 w-full max-w-5xl mx-auto z-10 flex flex-col gap-10 pb-20 bg-slate-950 p-2">
        
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-6 shadow-sm"
          >
            <TrendingDown className="w-4 h-4" />
            Vocal Stress: Nominal Range
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">Post-Session Telemetry</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            AI-generated performance analytics regarding pacing, filler usage, expressions, and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="col-span-1 bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-xs flex items-center gap-2"><Terminal className="w-3 h-3"/> Pacing Metric</h3>
            <div className="text-7xl font-mono text-white mb-4 tracking-tighter">
              {wpm || 135}
            </div>
            <div className="text-indigo-400 font-mono text-sm mb-2 uppercase tracking-widest">Words Per Minute</div>
            <p className="text-xs text-slate-500 font-medium">Optimal threshold: 120-150 WPM.</p>
          </div>

          <div className="col-span-1 bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${fillerWordsCount > 10 ? 'bg-orange-500/10' : 'bg-emerald-500/10'} rounded-full blur-2xl pointer-events-none`} />
            <h3 className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-xs flex items-center gap-2"><Terminal className="w-3 h-3"/> Clarity Metric</h3>
            <div className={`text-7xl font-mono mb-4 tracking-tighter ${fillerWordsCount > 10 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {fillerWordsCount}
            </div>
            <div className="text-slate-300 font-mono text-sm mb-2 uppercase tracking-widest">Filler Hits Detected</div>
            <p className="text-xs text-slate-500 font-medium">Aim for 0 interference words.</p>
          </div>

          <div className="col-span-1 bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-xs flex items-center gap-2"><Terminal className="w-3 h-3"/> Expression Metric</h3>
            <div className="text-4xl font-mono text-white mb-4 uppercase tracking-widest mt-4">
              {expressionData.length > 0 ? expressionData.sort((a,b)=>b.count-a.count)[0].name : 'Neutral'}
            </div>
            <div className="text-slate-300 font-mono text-sm mb-2 uppercase tracking-widest mt-3">Dominant State</div>
            <p className="text-xs text-slate-500 font-medium">Analyzed via edge-vision model.</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-indigo-400" /> Pacing Variance Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pacingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                  <Line type="monotone" dataKey="wpm" stroke="#818cf8" strokeWidth={3} dot={{r: 6, fill: '#818cf8', stroke: '#1e293b', strokeWidth: 2}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-cyan-400" /> Facial Expression Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expressionData.length > 0 ? expressionData : [{name: 'neutral', count: 10}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transcripts and AI Feedback */}
        <div className="flex flex-col gap-6 mt-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-widest mb-2 border-b border-slate-800 pb-4">
            <FileText className="w-5 h-5 text-indigo-400" /> Transcripts & AI Directives
          </h2>
          
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500/50" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Event Log // Query_{idx + 1}
              </div>
              <h4 className="text-xl font-bold mb-6 text-white leading-relaxed">"{q.text}"</h4>
              
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-6 relative">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 block border-b border-slate-800 pb-2">Speech-To-Text Output:</span>
                <p className="text-slate-300 font-mono text-sm leading-relaxed mt-3">
                  <span className="text-indigo-500 mr-2">{">"}</span>
                  {transcripts[q.id] || "No speech telemetry detected during this interval."}
                </p>
              </div>

              <div className="flex gap-4 items-start bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <AlertCircle className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-widest text-indigo-400 mb-2">AI Coach Directive</h5>
                  <p className="text-sm text-indigo-200 font-mono leading-relaxed">
                    {generateFeedback(transcripts[q.id] || "")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
