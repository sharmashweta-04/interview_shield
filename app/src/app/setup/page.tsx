"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, ChevronRight, Mic, CheckCircle2, Terminal } from "lucide-react";
import { useInterviewStore } from "@/store/useInterviewStore";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const { setRoleAndLevel, startSession } = useInterviewStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("Software Engineer");
  const [level, setLevel] = useState("Mid-Level");
  const [micStatus, setMicStatus] = useState<"idle" | "testing" | "ready" | "error">("idle");
  const [backendStatus, setBackendStatus] = useState<"idle" | "connecting" | "ready">("idle");

  const roles = ["Software Engineer", "Product Manager", "Data Analyst", "Marketing", "Sales"];
  const levels = ["Entry Level", "Mid-Level", "Senior", "Lead"];

  // Silent backend ping
  const checkBackend = async () => {
    setBackendStatus("connecting");
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${backendUrl}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      setBackendStatus("ready");
    } catch (e) {
      setBackendStatus("ready");
    }
  };

  useEffect(() => {
    if (step === 2 && backendStatus === "idle") {
      checkBackend();
    }
  }, [step, backendStatus]);

  const handleMicTest = async () => {
    setMicStatus("testing");
    try {
      // Force real hardware permission prompt
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the tracks immediately after securing permission so it doesn't lock STT later
      stream.getTracks().forEach(track => track.stop());
      setMicStatus("ready");
    } catch (err) {
      console.error("Microphone access denied:", err);
      setMicStatus("error");
    }
  };

  const handleStart = () => {
    setRoleAndLevel(role, level);
    startSession();
    router.push("/session");
  };

  return (
    <main className="flex-1 flex flex-col relative min-h-screen bg-slate-950 text-slate-200 overflow-hidden p-6 md:p-12">
      {/* Dark Premium Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="w-full flex justify-between items-center z-10 mb-12 max-w-4xl mx-auto border-b border-slate-800/50 pb-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">InterviewShield</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-indigo-400 text-[10px] font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Setup_Sequence
        </div>
      </header>

      <div className="flex-1 w-full max-w-4xl mx-auto z-10 flex flex-col justify-center pb-20">
        
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8 max-w-2xl mx-auto w-full"
          >
            <div>
              <h2 className="text-4xl font-extrabold mb-3 text-white tracking-tight">Configure Session Parameters</h2>
              <p className="text-slate-400 text-lg">Define target profile for AI dynamic generation.</p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl flex flex-col gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col gap-4 z-10">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Target Role
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roles.map(r => (
                    <button 
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${role === r ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 z-10 mt-2">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Seniority Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {levels.map(l => (
                    <button 
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${level === l ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setStep(2)}
                className="group flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 border border-indigo-400/30"
              >
                Proceed to Hardware Check <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8 w-full max-w-xl mx-auto"
          >
            <div className="text-center">
              <h2 className="text-4xl font-extrabold mb-3 text-white tracking-tight">Hardware Verification</h2>
              <p className="text-slate-400 text-lg">Secure audio channels for telemetry processing.</p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-10 flex flex-col items-center justify-center gap-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-4 mb-4 z-10">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mic_Status</span>
                <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded ${micStatus === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : micStatus === 'testing' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {micStatus}
                </span>
              </div>

              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 z-10 relative ${micStatus === 'idle' ? 'bg-slate-950 border border-slate-800' : micStatus === 'testing' ? 'bg-indigo-900/30 border border-indigo-500/50' : micStatus === 'error' ? 'bg-rose-900/30 border border-rose-500/50' : 'bg-emerald-900/30 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}>
                {micStatus === 'testing' && <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping"></div>}
                
                {micStatus === 'ready' ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                ) : (
                  <Mic className={`w-12 h-12 ${micStatus === 'testing' ? 'text-indigo-400 animate-pulse' : micStatus === 'error' ? 'text-rose-400' : 'text-slate-500'}`} />
                )}
              </div>

              <div className="text-center z-10">
                <h3 className="font-bold text-xl text-white mb-2">
                  {micStatus === 'idle' ? 'Microphone Access Required' : micStatus === 'testing' ? 'Awaiting Authorization...' : micStatus === 'error' ? 'Permission Denied' : 'Hardware Secured'}
                </h3>
                <p className={`text-sm ${micStatus === 'error' ? 'text-rose-400 font-medium' : 'text-slate-400'}`}>
                  {micStatus === 'idle' ? 'Click below to grant browser access to your microphone.' : micStatus === 'testing' ? 'Please click "Allow" in your browser prompt.' : micStatus === 'error' ? 'You must allow microphone access to use InterviewShield.' : 'Audio channel open. System is ready to deploy.'}
                </p>
              </div>

              {(micStatus === 'idle' || micStatus === 'error') && (
                <button 
                  onClick={handleMicTest}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-8 py-3 rounded-xl font-bold border border-indigo-500/50 transition-colors z-10 uppercase tracking-wider text-sm"
                >
                  Authorize Hardware
                </button>
              )}
            </div>

            <div className="flex justify-between items-center mt-6 w-full">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors uppercase tracking-wider text-xs"
              >
                Back to Config
              </button>
              <button 
                onClick={handleStart}
                disabled={micStatus !== 'ready' || backendStatus !== 'ready'}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all uppercase tracking-wider text-sm ${micStatus === 'ready' && backendStatus === 'ready' ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-indigo-400/50' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
              >
                Deploy Session
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
