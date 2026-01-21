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
  StickyNote,
  Headphones,
  Video,
  Map,
  ImageIcon,
  Presentation,
  FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursePlayer() {
  const [activeLesson, setActiveLesson] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); 
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

  const notebookResources = [
    { title: "Resumen de Audio", icon: Headphones, color: "text-blue-500", desc: "Escucha los puntos clave del OA" },
    { title: "Mapa Mental", icon: Map, color: "text-emerald-500", desc: "Estructura lógica de conceptos" },
    { title: "Infografía", icon: ImageIcon, color: "text-orange-500", desc: "Datos visuales y cronologías" },
    { title: "Presentación", icon: Presentation, color: "text-crimson-600", desc: "Guía de apoyo para repaso" },
    { title: "Informe Semanal", icon: FileSearch, color: "text-slate-500", desc: "Análisis profundo de la materia" },
  ];

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden font-sans text-[#1e1e1e]">
      {/* 1. Dashboard as Executive Prosthesis */}
      <aside className="w-80 border-r border-gray-100 flex flex-col bg-white shrink-0">
        <div className="p-6 border-b border-gray-100">
          <a href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#a51c30] mb-6 hover:translate-x-1 transition-all">
            <ChevronLeft className="w-4 h-4" /> Mi Escritorio
          </a>
          <h1 className="text-xl font-serif font-black leading-tight mb-2">Historia 7° Básico</h1>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <Calendar className="w-3 h-3" /> Semana 1 • OA 1
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Ruta de Ejecución</h3>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className={`h-1.5 flex-1 rounded-full ${step === 1 ? 'bg-[#a51c30]' : 'bg-gray-100'}`} />
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-400">
                <span className="text-[#a51c30]">Captación</span>
                <span>Procesamiento</span>
                <span>Síntesis</span>
                <span>Cierre</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Momentos de la Clase</h3>
              {[
                { label: "1. Captación (Video)", time: "10m", active: true },
                { label: "2. Procesamiento (NotebookLM)", time: "15m", active: false },
                { label: "3. Síntesis (Actividad)", time: "20m", active: false },
                { label: "4. Cierre (Check-point)", time: "5m", active: false },
              ].map((item, i) => (
                <button key={i} className={`w-full text-left p-4 flex items-center justify-between border-l-4 transition-all ${item.active ? 'bg-[#a51c30]/5 border-[#a51c30]' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                  <span className="text-xs font-bold">{item.label}</span>
                  <Badge variant="outline" className="text-[8px] font-black">{item.time}</Badge>
                </button>
              ))}
            </div>

            <div className="p-5 bg-amber-50 border border-amber-100 rounded-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <StickyNote className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Misión de Enfoque</span>
              </div>
              <p className="text-[11px] font-bold text-amber-900 leading-tight uppercase tracking-tight">
                Primero observa el video (Captación) y luego procesa la información con el Mapa Mental.
              </p>
            </div>
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 overflow-y-auto bg-white flex flex-col">
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-center gap-12 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="24" fill="transparent" stroke="#f3f4f6" strokeWidth="4" />
                <circle 
                  cx="28" cy="28" r="24" fill="transparent" stroke="#a51c30" strokeWidth="4" 
                  strokeDasharray="150.8"
                  strokeDashoffset={150.8 * (1 - timeLeft / 600)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#a51c30]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Tanque de Dopamina</span>
              <span className="text-2xl font-serif font-black italic tracking-tighter text-[#1e1e1e]">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Button 
            onClick={() => setIsActive(!isActive)}
            className={`h-12 px-10 rounded-none text-[10px] font-black uppercase tracking-[0.3em] transition-all ${isActive ? 'bg-gray-100 text-gray-500' : 'bg-[#a51c30] text-white'}`}
          >
            {isActive ? "Pausar Ráfaga" : "Iniciar Ráfaga"}
          </Button>
        </div>

        <div className="flex-1 p-12 max-w-5xl mx-auto w-full">
          <Tabs defaultValue="class" className="space-y-12">
            <div className="flex items-center justify-between border-b border-gray-100">
              <TabsList className="bg-transparent h-auto p-0 gap-10">
                <TabsTrigger value="class" className="bg-transparent text-[11px] font-black uppercase tracking-[0.4em] data-[state=active]:text-[#a51c30] data-[state=active]:border-[#a51c30] border-b-2 border-transparent rounded-none px-0 pb-4 transition-all">1. Captación (Video)</TabsTrigger>
                <TabsTrigger value="notebook" className="bg-transparent text-[11px] font-black uppercase tracking-[0.4em] data-[state=active]:text-[#a51c30] data-[state=active]:border-[#a51c30] border-b-2 border-transparent rounded-none px-0 pb-4 transition-all">2. Procesamiento (IA)</TabsTrigger>
                <TabsTrigger value="activity" className="bg-transparent text-[11px] font-black uppercase tracking-[0.4em] data-[state=active]:text-[#a51c30] data-[state=active]:border-[#a51c30] border-b-2 border-transparent rounded-none px-0 pb-4 transition-all">3. Síntesis (Actividad)</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="class" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-6">
                <Badge className="bg-[#a51c30] text-white rounded-none text-[9px] font-black tracking-[0.3em] uppercase border-none px-4 py-1">Pilar Barkley: Captación Visual</Badge>
                <h2 className="text-5xl font-serif font-black italic leading-tight text-[#1e1e1e]">El Surgimiento de las <br /><span className="text-[#a51c30] not-italic text-4xl">Rutas Comerciales</span></h2>
              </div>
              
              <div className="aspect-video bg-black rounded-none shadow-2xl relative group overflow-hidden border-8 border-white">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-[#a51c30]/20 transition-all cursor-pointer">
                      <PlayCircle className="w-10 h-10 text-white" />
                    </div>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="notebook" className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {notebookResources.map((res, i) => (
                   <Card key={i} className="border border-gray-100 hover:border-[#a51c30]/40 hover:shadow-xl transition-all rounded-none p-8 group cursor-pointer bg-white">
                      <res.icon className={`w-8 h-8 ${res.color} mb-6 transition-transform group-hover:scale-110`} />
                      <h4 className="text-sm font-black uppercase tracking-widest mb-2 text-[#1e1e1e]">{res.title}</h4>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{res.desc}</p>
                      <div className="mt-6 flex justify-end">
                         <div className="w-8 h-8 bg-gray-50 flex items-center justify-center group-hover:bg-[#a51c30]/10 transition-all">
                            <Download className="w-4 h-4 text-gray-300 group-hover:text-[#a51c30]" />
                         </div>
                      </div>
                   </Card>
                 ))}
               </div>
               
               <div className="p-10 bg-[#f9f9f9] border-l-4 border-[#a51c30] flex items-start gap-8">
                  <Brain className="w-10 h-10 text-[#a51c30] shrink-0" />
                  <div className="space-y-3">
                    <h5 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#a51c30]">Análisis Cognitivo Barkley</h5>
                    <p className="text-lg font-serif italic text-gray-600 leading-relaxed">
                      "Después de la captación visual, el cerebro necesita andamiaje. Utiliza estos recursos para procesar la información sin saturar tu memoria de trabajo."
                    </p>
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-10 animate-in fade-in duration-500">
              <div className="p-12 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-20 h-20 bg-gray-50 flex items-center justify-center">
                    <CheckSquare className="w-10 h-10 text-gray-200" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-black italic">Actividad de Síntesis</h3>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Aplica lo aprendido en el momento de procesamiento</p>
                 </div>
                 <Button className="bg-[#a51c30] rounded-none h-14 px-12 text-[10px] font-black uppercase tracking-widest">Empezar Actividad</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {showReward && (
          <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center bg-white/60 backdrop-blur-md animate-in zoom-in-95 duration-500">
             <div className="text-center space-y-6">
                <div className="text-7xl animate-bounce">🎖️</div>
                <h3 className="text-4xl font-serif font-black italic text-[#a51c30]">Ráfaga Completada</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1e1e1e]">Has ganado +100 puntos de enfoque</p>
             </div>
          </div>
        )}

        <div className="fixed bottom-10 right-10 z-[100]">
           <button className="w-16 h-16 bg-[#a51c30] rounded-none shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-all group">
              <MessageSquare className="w-7 h-7" />
           </button>
        </div>
      </main>
    </div>
  );
}