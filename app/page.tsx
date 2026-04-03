"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  FaMoon, 
  FaSun, 
  FaChair, 
  FaTint, 
  FaRobot, 
  FaClock, 
  FaHistory, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaCoffee, 
  FaDna,
  FaArrowRight,
  FaPlus,
  FaMinus,
  FaStar,
  FaBolt,
  FaBed,
  FaRunning,
  FaLightbulb
} from "react-icons/fa";

type VitalState = {
  sleepHours: number;
  sleepQuality: number; // 1-5
  sunlightMins: number;
  postureChecks: number;
  waterMl: number;
  wakeTime: string; // "07:30"
  targetBedtime: string; // "23:00"
  sleepGoal: number;
  waterGoal: number;
};

type ChatMsg = { role: "ai" | "user"; text: string };

export default function VitalityPulse() {
  const [stats, setStats] = useState<VitalState>({
    sleepHours: 0,
    sleepQuality: 0,
    sunlightMins: 0,
    postureChecks: 0,
    waterMl: 0,
    wakeTime: "07:30",
    targetBedtime: "23:00",
    sleepGoal: 8,
    waterGoal: 3000
  });

  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "ai", text: "Welcome to Vitality Pulse! 🌍 I'm your Bio-Assistant. Let's sync your biological clock with 3 simple steps:" },
    { role: "ai", text: "1. ⚙️ Adjust your 'Biological Targets' at the top to match your ideal day.\n2. ☀️ Tap '+' on Sunlight as soon as you've had 10 mins of morning sun.\n3. ☕ Check your 'Caffeine Cut-off' below to ensure your brain is ready for deep sleep tonight." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Biological Calculations
  const circadianTimeline = useMemo(() => {
    const wake = stats.wakeTime.split(":").map(Number);
    const bed = stats.targetBedtime.split(":").map(Number);
    
    const wakeMinutes = wake[0] * 60 + wake[1];
    const bedMinutes = bed[0] * 60 + bed[1];

    return [
      { id: "focus", label: "Peak Focus", description: "Your brain's optimal window for complex work.", time: formatTime(wakeMinutes + 180), icon: <FaBolt />, color: "text-indigo-400" },
      { id: "caffeine", label: "Caffeine Cut-off", description: "Stop caffeine here to clear adenosine receptors by bedtime.", time: formatTime(bedMinutes - 600), icon: <FaCoffee />, color: "text-amber-500" },
      { id: "light", label: "Blue Light Limit", description: "Switch to 'Night Shift' mode to protect melatonin production.", time: formatTime(bedMinutes - 120), icon: <FaSun />, color: "text-cyan-400" },
      { id: "wind", label: "Wind Down", description: "Dim the lights and start your relaxation ritual.", time: formatTime(bedMinutes - 60), icon: <FaMoon />, color: "text-indigo-500" },
    ];
  }, [stats.wakeTime, stats.targetBedtime]);

  const score = useMemo(() => {
    const sleepScore = stats.sleepGoal > 0 ? (stats.sleepHours / stats.sleepGoal) * 30 : 0;
    const waterScore = stats.waterGoal > 0 ? (stats.waterMl / stats.waterGoal) * 30 : 0;
    const sunScore = (stats.sunlightMins / 30) * 20;
    const postureScore = (stats.postureChecks / 10) * 20;
    return Math.min(Math.round(sleepScore + waterScore + sunScore + postureScore), 100);
  }, [stats]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  function formatTime(minutes: number) {
    let h = Math.floor(minutes / 60) % 24;
    if (h < 0) h += 24;
    const m = Math.abs(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  const logVital = (key: keyof VitalState, val: any) => {
    setStats(prev => ({ ...prev, [key]: val }));
    
    // Bio-Contextual Feedback
    const isPrimaryStat = ['sunlightMins', 'postureChecks', 'waterMl'].includes(key);
    if (typeof val === 'number' && isPrimaryStat) {
      setIsTyping(true);
      setTimeout(() => {
        let aiMsg = "";
        if (key === 'sunlightMins' && val >= 15) aiMsg = "Biological anchor secured. Your sleep drive will peak exactly 16 hours from now! ☀️";
        else if (key === 'postureChecks') aiMsg = "Posture recorded. Keep your spine neutral to reduce neural load. 🦴";
        else if (key === 'waterMl') aiMsg = "Hydration level rising. Plasma volume optimization underway. 💧";
        else aiMsg = "Vitality markers updated.";
        
        setChat(prev => [...prev, { role: "ai", text: aiMsg }]);
        setIsTyping(false);
      }, 700);
    }
  };

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any).chatInput.value.trim();
    if (!input) return;
    setChat(prev => [...prev, { role: "user", text: input }]);
    (e.target as any).chatInput.value = "";
    
    setIsTyping(true);
    setTimeout(() => {
      let resp = "Analyzing bio-patterns... Try asking about 'Vitamin D windows' or 'Energy management'.";
      const l = input.toLowerCase();
      if (l.includes("sleep")) resp = "For quality rest, maintain a room temperature of 18°C and complete silence. 🌙";
      else if (l.includes("energy")) resp = "If you're feeling a mid-day dip, try 5 mins of focused nasal breathing. ⚡";
      setChat(prev => [...prev, { role: "ai", text: resp }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in font-sans selection:bg-indigo-500/30">
      {/* Header: Vitality Status */}
      <section className="glass-panel rounded-[2.5rem] p-8 md:p-12 mb-8 flex flex-col lg:flex-row items-center gap-12 border-t-2 border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 scale-150"><FaDna className="text-9xl" /></div>
        <div className="flex-1 space-y-4 text-center lg:text-left z-10">
           <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
             <FaDna className="animate-pulse" /> Biological Optimization
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Vitality Pulse</h1>
           <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
             Your biological clock, synchronized. Track your sleep, light exposure, and circadian windows.
           </p>
        </div>

        <div className="flex flex-wrap justify-center gap-10 z-10">
           <BioRing label="Overall Vitality" percentage={score} color="indigo" icon={<FaBolt />} />
           <div className="grid grid-cols-2 gap-4">
              <MiniStat icon={<FaMoon />} label="Logged Sleep" value={`${stats.sleepHours}h`} />
              <MiniStat icon={<FaSun />} label="Sunlight" value={`${stats.sunlightMins}m`} />
              <MiniStat icon={<FaChair />} label="Posture" value={stats.postureChecks} />
              <MiniStat icon={<FaTint />} label="Water" value={`${(stats.waterMl/1000).toFixed(1)}L`} />
           </div>
        </div>
      </section>

      {/* Quick Settings Header */}
      <section className="glass-panel rounded-3xl p-6 mb-10 flex flex-wrap items-center justify-between gap-6 border border-white/5 animate-fade-in select-none">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
               <FaClock />
            </div>
            <div>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                 Biological Targets <FaInfoCircle className="text-[8px] cursor-help" title="Set your goal wake time and bedtime to customize your circadian windows." />
               </p>
               <h3 className="text-sm font-black text-slate-200">Personalize Your Rhythm</h3>
            </div>
         </div>

         <div className="flex flex-wrap items-center gap-6 md:gap-12">
            <SettingInput icon={<FaSun />} label="Wake Time" value={stats.wakeTime} type="time" onChange={(v: string) => logVital('wakeTime', v)} />
            <SettingInput icon={<FaBed />} label="Bedtime" value={stats.targetBedtime} type="time" onChange={(v: string) => logVital('targetBedtime', v)} />
            <SettingInput icon={<FaMoon />} label="Sleep Goal" value={stats.sleepGoal} type="number" unit="h" onChange={(v: string) => logVital('sleepGoal', Number(v))} />
            <SettingInput icon={<FaTint />} label="Water Goal" value={stats.waterGoal} type="number" unit="ml" onChange={(v: string) => logVital('waterGoal', Number(v))} />
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Bio-Timeline & Inputs */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-10">
          
          {/* Circadian Timeline View */}
          <div className="glass-panel p-8 md:p-10 rounded-[3rem] space-y-10 border-b-2 border-cyan-500/10">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-3 tracking-tight">
                  <FaClock className="text-cyan-500" /> Circadian Rhythm Windows
                </h2>
                <div className="hidden md:flex gap-4">
                   <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      Auto-Adjusted to Targets
                   </div>
                </div>
             </div>

             <div className="relative pt-4">
                <div className="h-0.5 w-full bg-slate-900 rounded-full bio-timeline-bar" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                   {circadianTimeline.map(point => (
                     <div key={point.id} className="glass-card p-6 rounded-3xl group relative">
                        <div className="absolute top-4 right-4"><FaInfoCircle className="text-[10px] text-slate-700 cursor-help" title={point.description} /></div>
                        <div className={`text-2xl mb-3 ${point.color} group-hover:scale-110 transition-transform`}>{point.icon}</div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{point.label}</p>
                        <p className="text-xl font-black text-white">{point.time}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Bio-Logs & Quick Taps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <QuickLogBox 
                icon={<FaSun className="text-amber-500" />} 
                title="Sunlight Exposure" 
                unit="Minutes" 
                value={stats.sunlightMins}
                onAdd={() => logVital('sunlightMins', stats.sunlightMins + 5)}
                onSub={() => logVital('sunlightMins', Math.max(0, stats.sunlightMins - 5))}
             />
             <QuickLogBox 
                icon={<FaChair className="text-cyan-500" />} 
                title="Posture Check-ins" 
                unit="Score" 
                value={stats.postureChecks}
                onAdd={() => logVital('postureChecks', stats.postureChecks + 1)}
                onSub={() => logVital('postureChecks', Math.max(0, stats.postureChecks - 1))}
             />
             <QuickLogBox 
                icon={<FaTint className="text-indigo-500" />} 
                title="Hydration Intake" 
                unit="ml" 
                value={stats.waterMl}
                onAdd={() => logVital('waterMl', stats.waterMl + 250)}
                onSub={() => logVital('waterMl', Math.max(0, stats.waterMl - 250))}
             />
             <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col justify-center space-y-4">
                <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <FaHistory /> Vitality Insights
                </p>
                <div className="space-y-4">
                   {stats.sunlightMins === 0 && (
                     <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-[11px] leading-snug">
                        <FaLightbulb className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-slate-300"><b>HINT:</b> Log 10m of morning sun as soon as you wake up to "anchor" your biological clock for better sleep tonight.</p>
                     </div>
                   )}
                   <LogItem label="Logged Sleep" value={`${stats.sleepHours}h / ${stats.sleepGoal}h Target`} />
                   <LogItem label="Hydration Progress" value={stats.waterMl >= stats.waterGoal ? "Complete" : `${stats.waterGoal - stats.waterMl}ml Remaining`} />
                </div>
             </div>
          </div>
        </div>

        {/* Right: AI Bio-Coach */}
        <div className="lg:col-span-12 xl:col-span-4 h-full">
           <section className="glass-panel h-[600px] xl:h-full flex flex-col rounded-[3rem] overflow-hidden border-2 border-indigo-500/10 shadow-indigo-500/5">
              <div className="p-8 bg-indigo-500/10 border-b border-indigo-500/10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                    <span className="font-black text-xs uppercase tracking-widest text-cyan-400">Biological Assistant</span>
                 </div>
                 <FaRobot className="text-indigo-400 text-xl" />
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8" ref={scrollRef}>
                 {chat.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-5 rounded-[1.8rem] text-[13px] leading-relaxed shadow-xl ${
                        m.role === 'user' 
                        ? 'bg-indigo-600 text-white font-bold rounded-tr-none' 
                        : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none whitespace-pre-line'
                      }`}>
                        {m.text}
                      </div>
                   </div>
                 ))}
                 {isTyping && <div className="flex gap-1.5 p-4"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
              </div>

              <form onSubmit={handleChat} className="p-8 bg-slate-950/40 border-t border-slate-800 flex gap-3">
                 <input 
                  name="chatInput"
                  placeholder="Ask about your rhythm..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none placeholder:text-slate-600 transition-all font-medium"
                 />
                 <button className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
                    <FaArrowRight />
                 </button>
              </form>
           </section>
        </div>
      </div>
    </main>
    <footer className="fixed bottom-6 right-8 z-50 animate-fade-in group pointer-events-none md:pointer-events-auto">
       <a 
        href="https://github.com/saugat2701" 
        target="_blank" 
        rel="noopener noreferrer"
        className="glass-panel px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all flex items-center gap-2"
       >
         <span className="opacity-40">Created by</span> 
         <span className="text-slate-300 group-hover:text-indigo-400 transition-colors">saugat2701</span>
       </a>
    </footer>
    </>
  );
}

function BioRing({ label, percentage, color, icon }: any) {
  const c = color === 'indigo' ? 'text-indigo-500' : 'text-cyan-500';
  return (
    <div className="text-center group relative cursor-help">
       <div className={`h-32 w-32 md:h-40 md:w-40 rounded-full border-8 border-slate-900 flex items-center justify-center relative transition-transform group-hover:scale-110 duration-700`}>
          <div className={`absolute inset-0 rounded-full border-8 ${c} opacity-10`} />
          <div 
            className={`absolute inset-0 rounded-full border-8 ${c} transition-all duration-1000 vitality-ring`} 
            style={{ '--percentage': `${percentage}%` } as any}
          />
          <div className="flex flex-col items-center">
             <span className={`${c} text-3xl md:text-4xl mb-1`}>{icon}</span>
             <span className="text-2xl md:text-3xl font-black text-white">{percentage}%</span>
          </div>
       </div>
       <p className="mt-4 text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

function MiniStat({ icon, label, value }: any) {
  return (
    <div className="glass-card px-5 py-4 rounded-3xl border border-slate-800/50 flex flex-col items-start gap-1">
       <span className="text-indigo-400 text-sm">{icon}</span>
       <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{label}</span>
       <span className="text-lg font-black text-white">{value}</span>
    </div>
  );
}

function QuickLogBox({ icon, title, unit, value, onAdd, onSub }: any) {
  return (
    <div className="glass-panel p-8 rounded-[3rem] space-y-6 group hover:border-indigo-500/20 transition-all relative">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
             <p className="font-black text-slate-200 tracking-tight">{title}</p>
          </div>
          <span className="text-[10px] text-slate-600 font-black uppercase">{unit}</span>
       </div>
       <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-3xl border border-slate-800">
          <button onClick={onSub} className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"><FaMinus className="mx-auto" /></button>
          <span className="text-3xl font-black text-white">{value}</span>
          <button onClick={onAdd} className="h-12 w-12 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 transition-all"><FaPlus className="mx-auto" /></button>
       </div>
    </div>
  );
}

function SettingInput({ label, value, type, icon, unit, onChange }: any) {
  return (
    <div className="flex items-center gap-3">
       <div className="text-slate-500 text-xs">{icon}</div>
       <div>
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter mb-0.5">{label}</p>
          <div className="flex items-center gap-1">
             <input 
              type={type} 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="bg-slate-900/60 border border-slate-800 rounded-lg px-2 py-1 text-xs text-indigo-400 font-bold outline-none focus:border-indigo-500 transition-all w-[85px]"
             />
             {unit && <span className="text-[9px] text-slate-600 font-bold uppercase">{unit}</span>}
          </div>
       </div>
    </div>
  );
}

function LogItem({ label, value }: any) {
  return (
    <div className="flex justify-between items-center p-3 glass-card rounded-2xl border border-white/5">
       <span className="text-xs font-bold text-slate-400">{label}</span>
       <span className="text-xs font-black text-indigo-400">{value}</span>
    </div>
  );
}
