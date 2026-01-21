import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  ChevronLeft, 
  PlayCircle, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  ChevronRight,
  Clock,
  Lock,
  Download,
  Calendar,
  BarChart,
  Target,
  Brain,
  Zap,
  StickyNote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function CoursePlayer() {
  const [activeLesson, setActiveLesson] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min chunks
  const [isActive, setIsActive] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden font-sans text-[#1e1e1e]">
      {/* 1. Dashboard as Executive Prosthesis (Navigation) */}
      <aside className="w-80 border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="p-6 border-b border-gray-100">
          <a href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a51c30] mb-6 hover:translate-x-1 transition-all">
            <ChevronLeft className="w-4 h-4" /> Mi Escritorio
          </a>
          <h1 className="text-xl font-serif font-black leading-tight mb-2">Historia y Geografía</h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <Calendar className="w-3 h-3" /> Semana 1 • OA 1
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Progreso de la Lección</h3>
              {/* 3. Externalization of Rules (Visual Cues) - Status Bar */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`h-1.5 flex-1 ${step === 1 ? 'bg-[#a51c30]' : 'bg-gray-100'}`} />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span className="text-[#a51c30]">Instrucción</span>
                <span className="text-gray-300">Práctica</span>
                <span className="text-gray-300">Cierre</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Bloques de Ejecución</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-4 bg-[#a51c30]/5 border-l-4 border-[#a51c30] flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-4 h-4 text-[#a51c30]" />
                    <span className="text-xs font-bold">1. Micro-Instrucción</span>
                  </div>
                  <Badge className="bg-[#a51c30] text-white text-[8px]">10 min</Badge>
                </button>
                <button className="w-full text-left p-4 hover:bg-gray-50 border-l-4 border-transparent flex items-center justify-between group opacity-50">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold">2. Gamificación</span>
                  </div>
                  <Badge variant="outline" className="text-[8px]">5 min</Badge>
                </button>
              </div>
            </div>

            {/* 3. Sticky Instructions (Visual Cues) */}
            <div className="p-6 bg-amber-50 border border-amber-100 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <StickyNote className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Misión Actual</span>
              </div>
              <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                "Observa el mapa y localiza las 3 rutas principales. Anota sus nombres en el cuaderno."
              </p>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Execution Area */}
      <main className="flex-1 overflow-y-auto bg-white flex flex-col">
        {/* 1. Visual Timer directly in the workspace */}
        <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="transparent" stroke="#e5e7eb" strokeWidth="4" />
                <circle 
                  cx="24" cy="24" r="20" fill="transparent" stroke="#a51c30" strokeWidth="4" 
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 * (1 - timeLeft / 600)}
                  className="transition-all duration-1000"
                />
              </svg>
              <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-[#a51c30]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Tiempo de Enfoque</span>
              <span className="text-xl font-serif font-black italic tracking-tighter">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Button 
            onClick={() => setIsActive(!isActive)}
            className="bg-[#1e1e1e] hover:bg-black text-white rounded-none h-10 px-6 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {isActive ? "Pausar" : "Iniciar Bloque"}
          </Button>
        </div>

        <div className="flex-1 p-12 max-w-4xl mx-auto w-full space-y-12">
          {/* 2. Micro-Segmented Content (Chunking) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Badge className="bg-[#a51c30] text-white rounded-none text-[9px] font-black tracking-widest uppercase">Bloque 1/4</Badge>
              <h2 className="text-4xl font-serif font-black italic">Las Rutas de la Civilización</h2>
            </div>
            
            <div className="aspect-video bg-black rounded-none shadow-2xl relative group overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-white/20 group-hover:text-[#a51c30] transition-all cursor-pointer" />
               </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                En este micro-video de 10 minutos, analizaremos por qué las rutas comerciales no solo transportaban mercancías, sino también ideas y cultura. 
              </p>
            </div>

            {/* 2. Immediate Feedback (After video) */}
            <Card className="border-2 border-[#a51c30]/20 bg-[#a51c30]/5 p-10 rounded-none space-y-6">
               <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-[#a51c30]" />
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em]">Checkpoint de Dopamina</h4>
               </div>
               <p className="text-lg font-serif font-bold italic">¿Cuál era el principal recurso transportado por la Ruta de la Seda?</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Especias', 'Seda', 'Oro', 'Trigo'].map((opt) => (
                    <button key={opt} className="p-4 bg-white border border-gray-100 hover:border-[#a51c30] text-left text-sm font-bold transition-all uppercase tracking-widest">
                       {opt}
                    </button>
                  ))}
               </div>
            </Card>
          </div>
        </div>

        {/* 4. Reward Animation Overlay */}
        {showReward && (
          <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center bg-white/50 backdrop-blur-sm animate-in fade-in duration-500">
             <div className="text-center space-y-4 scale-150 transform transition-all animate-bounce">
                <div className="text-6xl">🎉</div>
                <h3 className="text-4xl font-serif font-black italic text-[#a51c30]">¡Objetivo Logrado!</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1e1e1e]">+50 Puntos de Voluntad</p>
             </div>
          </div>
        )}

        {/* 4. Coach Presence (Body Doubling/Quick check) */}
        <div className="fixed bottom-10 right-10 z-[100]">
           <button className="w-16 h-16 bg-[#a51c30] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all group">
              <MessageSquare className="w-8 h-8" />
              <div className="absolute right-full mr-4 bg-[#1e1e1e] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all">
                Hablar con Coach Barkley
              </div>
           </button>
        </div>
      </main>
    </div>
  );
}