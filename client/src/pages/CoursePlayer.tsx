import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  PlayCircle, 
  CheckSquare, 
  MessageSquare, 
  Clock, 
  Lock, 
  Download, 
  Calendar,
  Brain,
  StickyNote,
  Headphones,
  Map,
  ImageIcon,
  Presentation,
  FileSearch,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function CoursePlayer() {
  const [activeTab, setActiveTab] = useState("captacion");
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
    { title: "Audio Master", icon: Headphones, color: "text-blue-500", bg: "bg-blue-50", desc: "Resumen auditivo del OA." },
    { title: "Mapa de Ideas", icon: Map, color: "text-emerald-500", bg: "bg-emerald-50", desc: "Estructura lógica visual." },
    { title: "Infografía", icon: ImageIcon, color: "text-orange-500", bg: "bg-orange-50", desc: "Datos clave y cronología." },
    { title: "Slides", icon: Presentation, color: "text-indigo-500", bg: "bg-indigo-50", desc: "Apoyo visual para estudio." },
    { title: "Reporte", icon: FileSearch, color: "text-slate-500", bg: "bg-slate-50", desc: "Análisis profundo escrito." },
  ];

  const moments = [
    { id: "captacion", label: "Captación", desc: "Video", time: "10m" },
    { id: "procesamiento", label: "Procesamiento", desc: "IA Tool", time: "15m" },
    { id: "sintesis", label: "Síntesis", desc: "Actividad", time: "20m" },
    { id: "cierre", label: "Cierre", desc: "Check-point", time: "5m" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar - Collapsible Style (Fixed for clarity) */}
      <aside className="w-72 border-r border-slate-200 flex flex-col bg-white shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-slate-100">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 hover:text-blue-600 transition-colors group">
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Volver al Escritorio
            </button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Historia 7° Básico</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500">
               <Calendar className="w-3.5 h-3.5" /> Semana 1 • OA 1
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 px-2">Momentos Barkley</p>
              {moments.map((moment) => (
                <button 
                  key={moment.id} 
                  onClick={() => setActiveTab(moment.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all group",
                    activeTab === moment.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]" 
                    : "hover:bg-slate-100 text-slate-600"
                  )}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold tracking-tight">{moment.label}</p>
                    <p className={cn("text-[10px] font-medium opacity-60", activeTab === moment.id ? "text-white" : "text-slate-400")}>{moment.desc}</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] font-bold px-2 py-0 border-none bg-black/10 text-white", activeTab !== moment.id && "bg-slate-100 text-slate-400")}>{moment.time}</Badge>
                </button>
              ))}
            </div>

            <Card className="p-6 bg-blue-50 border-none rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <StickyNote className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Misión de Enfoque</span>
              </div>
              <p className="text-xs font-semibold text-blue-900 leading-relaxed italic">
                "Cierra la brecha de intención completando cada fase hoy mismo."
              </p>
            </Card>
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/30 flex flex-col">
        {/* Floating Timer Bar */}
        <div className="p-6 flex items-center justify-center sticky top-0 z-50">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] rounded-full px-8 py-4 flex items-center gap-10">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                  <circle 
                    cx="24" cy="24" r="20" fill="transparent" stroke="#3b82f6" strokeWidth="4" 
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 * (1 - timeLeft / 600)}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Reserva Dopamina</span>
                <span className="text-xl font-bold tracking-tighter text-slate-900 tabular-nums">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <Button 
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "h-12 px-8 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10",
                isActive ? "bg-slate-100 text-slate-500 hover:bg-slate-200" : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {isActive ? "Pausar Ráfaga" : "Iniciar Ráfaga"}
            </Button>
          </div>
        </div>

        <div className="flex-1 p-12 max-w-6xl mx-auto w-full">
          <Tabs value={activeTab} className="space-y-12">
            <TabsContent value="captacion" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 m-0">
              <div className="space-y-4">
                <Badge className="bg-blue-500 text-white border-none rounded-full text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 shadow-lg shadow-blue-500/20">MOMENTO 1: CAPTACIÓN</Badge>
                <h2 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">El Surgimiento de las<br /><span className="text-blue-500">Rutas Comerciales</span></h2>
              </div>
              <div className="aspect-video bg-slate-900 rounded-[2.5rem] shadow-2xl relative group overflow-hidden ring-1 ring-white/10">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all cursor-pointer">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="procesamiento" className="space-y-10 animate-in fade-in duration-500 m-0">
               <div className="space-y-4">
                  <Badge className="bg-blue-500 text-white border-none rounded-full text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 shadow-lg shadow-blue-500/20">MOMENTO 2: PROCESAMIENTO</Badge>
                  <h2 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">Andamiaje Cognitivo</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {notebookResources.map((res, i) => (
                   <Card key={i} className="border border-slate-200/60 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 rounded-[2rem] p-8 group cursor-pointer bg-white">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", res.bg)}>
                        <res.icon className={cn("w-7 h-7", res.color)} />
                      </div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-2 text-slate-900">{res.title}</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{res.desc}</p>
                      <div className="mt-8 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Ver Recurso</span>
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-all">
                            <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                         </div>
                      </div>
                   </Card>
                 ))}
               </div>
            </TabsContent>

            <TabsContent value="sintesis" className="space-y-10 animate-in fade-in duration-500 m-0">
               <div className="space-y-4">
                  <Badge className="bg-blue-500 text-white border-none rounded-full text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 shadow-lg shadow-blue-500/20">MOMENTO 3: SÍNTESIS</Badge>
                  <h2 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">Laboratorio de Aplicación</h2>
               </div>
               <Card className="p-20 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-8 bg-white rounded-[3rem] shadow-sm">
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center animate-pulse">
                     <CheckSquare className="w-12 h-12 text-blue-500" />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-2xl font-bold tracking-tight">Actividad Práctica OA1</h3>
                     <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest max-w-sm mx-auto">Sube tu mapa de rutas comerciales para validar el procesamiento cognitivo.</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl h-16 px-12 text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20">Subir Actividad</Button>
               </Card>
            </TabsContent>

            <TabsContent value="cierre" className="space-y-10 animate-in fade-in duration-500 m-0">
               <div className="space-y-4">
                  <Badge className="bg-blue-500 text-white border-none rounded-full text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 shadow-lg shadow-blue-500/20">MOMENTO 4: CIERRE</Badge>
                  <h2 className="text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">Validación Final</h2>
               </div>
               <Card className="border-none bg-[#0f172a] text-white p-16 rounded-[3rem] space-y-10 relative overflow-hidden shadow-2xl">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl" />
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center border border-white/5">
                        <Brain className="w-10 h-10 text-blue-400" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-bold tracking-tight">Test de Salida Semanal</h4>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mt-1">Externalización de la Memoria • 5 Preguntas</p>
                     </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-3xl h-20 text-xs font-bold uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/30">Iniciar Evaluación Final</Button>
               </Card>
            </TabsContent>
          </Tabs>
        </div>

        {showReward && (
          <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in zoom-in-95 duration-500">
             <div className="text-center space-y-6 bg-white p-12 rounded-[3rem] shadow-2xl scale-110">
                <div className="text-8xl animate-bounce">⚡</div>
                <h3 className="text-4xl font-bold tracking-tight text-slate-900">¡Ráfaga Épica!</h3>
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-blue-500">Has optimizado tu reserva de dopamina</p>
             </div>
          </div>
        )}

        <div className="fixed bottom-10 right-10 z-[100]">
           <button className="w-20 h-20 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-600/30 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all group">
              <MessageSquare className="w-8 h-8" />
           </button>
        </div>
      </main>
    </div>
  );
}