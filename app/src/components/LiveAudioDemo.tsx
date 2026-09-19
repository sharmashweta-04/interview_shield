"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Terminal, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function LiveAudioDemo() {
  const [isListening, setIsListening] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(new Array(30).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;
      
      setIsListening(true);
      updateAudioData();
    } catch (err) {
      console.error("Failed to access microphone", err);
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsListening(false);
    setAudioData(new Array(30).fill(0));
  };

  const updateAudioData = () => {
    if (!analyserRef.current || !isListening) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Sample 30 points from the frequency data
    const newAudioData = [];
    const step = Math.floor(dataArray.length / 30) || 1;
    for (let i = 0; i < 30; i++) {
      newAudioData.push(dataArray[i * step] || 0);
    }
    
    setAudioData(newAudioData);
    requestRef.current = requestAnimationFrame(updateAudioData);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden border border-slate-800 shadow-2xl">
      {/* Glow overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="font-bold text-sm tracking-widest uppercase text-white">Live Telemetry Test</h3>
          </div>
        </div>
        <button 
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest uppercase transition-colors ${
            isListening 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
          {isListening ? 'Stop_Test' : 'Test_Mic'}
        </button>
      </div>

      <div className="flex items-end gap-1.5 h-32 w-full opacity-90 mb-8">
        {/* Real audio visualizer */}
        {audioData.map((val, i) => {
          // Calculate height percentage (0-100) based on byte value (0-255)
          const height = isListening ? Math.max(10, (val / 255) * 100) : 10;
          return (
            <motion.div 
              key={i}
              animate={{ height: `${height}%` }}
              transition={{ type: "tween", duration: 0.1 }}
              className={`flex-1 rounded-t-sm ${height > 60 ? 'bg-indigo-400' : 'bg-slate-700'}`}
            />
          )
        })}
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mic_Status</p>
          <p className={`text-sm font-mono ${isListening ? 'text-emerald-400' : 'text-slate-400'}`}>
            {isListening ? 'Receiving Audio Data...' : 'Awaiting Connection'}
          </p>
        </div>
        {isListening && (
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
        )}
      </div>
    </div>
  );
}
