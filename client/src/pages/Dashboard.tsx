import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  Target, 
  Brain, 
  Bell, 
  Play,
  ChevronRight,
  TrendingUp,
  History,
  Calendar,
  AlertCircle,
  Lock,
  CheckCircle2,
  Info,
  Menu,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isActive, setIsActive] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentCourses = [
    { 
      id: "lengua", 
      title: "Lengua y Literatura", 
      progress: 15, 
      currentWeek: 5,
      next: "OA3: Análisis de Narraciones", 
      category: "7° Básico", 
      objectives: [
        { id: 1, title: "OA 3: Análisis de Narraciones", desc: "Conflictos, personajes y disposición temporal." },
        { id: 2, title: "OA 4: Análisis de Poemas", desc: "Lenguaje poético, figuras y sonoridad." },
        { id: 3, title: "OA 7: Interpretación Literaria", desc: "Dilemas y visión de mundo en obras." }
      ]
    },
    { 
      id: "mate", 
      title: "Matemática", 
      progress: 8, 
      currentWeek: 3,
      next: "OA1: Números Enteros", 
      category: "7° Básico", 
      objectives: [
        { id: 1, title: "OA 1: Números Enteros", desc: "Representación, orden y operaciones básicas." },
        { id: 2, title: "OA 2: Fracciones y Decimales", desc: "Multiplicación y división en contextos reales." }
      ]
    },
    { 
      id: "historia", 
      title: "Historia, Geografía y CS", 
      progress: 0, 
      currentWeek: 1,
      next: "OA1: Rutas Comerciales", 
      category: "7° Básico", 
      objectives: [
        { id: 1, title: "OA 1: Rutas Comerciales", desc: "Expansión europea y nuevas rutas." },
        { id: 2, title: "OA 2: Humanismo y Renacimiento", desc: "Cambios culturales en la Edad Moderna." }
      ]
    },
    { 
      id: "ciencias", 
      title: "Ciencias Naturales", 
      progress: 0, 
      currentWeek: 1,
      next: "OA1: La Célula", 
      category: "7° Básico", 
      objectives: [
        { id: 1, title: "OA 1: La Célula", desc: "Estructuras, funciones y tipos celulares." }
      ]
    }
  ];

  const totalWeeks = 33;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-[#0f172a] selection:bg-blue-100">
      {/* Refactored Sidebar - Modern & Collapsible */}
      <aside className={cn(
        "bg-[#001f3f] flex flex-col transition-all duration-300 ease-in-out border-r border-white/10",
        isSidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className={cn("flex items-center gap-3 transition-opacity", isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight uppercase">Barkley</span>
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: BookOpen, label: "Mis Cursos", active: false },
            { icon: Calendar, label: "Agenda", active: false },
            { icon: TrendingUp, label: "Progreso", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group",
                item.active 
                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", item.active && "text-blue-400")} />
              {!isSidebarCollapsed && <span className="text-sm font-semibold tracking-tight">{item.label}</span>}
            </button>
          ))}
        </nav>

        {!isSidebarCollapsed && (
          <div className="p-6 m-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Enfoque Barkley</span>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-2/3 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Mantén tu ráfaga de acción activa para optimizar la dopamina.</p>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Modern Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Bienvenido, Juan Pablo</h1>
            <Badge className="bg-blue-50 text-blue-600 border-blue-100 rounded-full px-3 py-1 font-semibold text-[11px]">7° Básico • Sección A</Badge>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado de Misión</p>
                <p className="text-sm font-bold text-slate-900">Semana 1: Iniciación</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">JP</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Mission Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Misiones Semanales</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Rutas de aprendizaje activas para este periodo.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {currentCourses.map(course => (
                    <Card key={course.id} className="border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-2xl overflow-hidden bg-white">
                      <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-slate-100 text-slate-600 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{course.category}</Badge>
                              <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{course.progress}%</span>
                              </div>
                              
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-blue-500 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Target className="w-3.5 h-3.5" /> Objetivos
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 bg-white shadow-2xl p-6 rounded-2xl border-slate-100" side="right" align="start">
                                  <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Contenido Curricular</h4>
                                      <BookOpen className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="space-y-4">
                                      {course.objectives.map(obj => (
                                        <div key={obj.id} className="group cursor-default">
                                          <p className="text-[11px] font-bold text-slate-900 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{obj.title}</p>
                                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{obj.desc}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{course.title}</h3>
                              <p className="text-sm font-semibold text-slate-400 mt-3 flex items-center gap-2">
                                <Play className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" /> 
                                <span className="text-slate-500">Próximo:</span> {course.next}
                              </p>
                            </div>
                          </div>
                          
                          <Link href={`/course/${course.id}`}>
                            <Button className="bg-[#0f172a] hover:bg-black text-white rounded-xl h-14 px-10 text-xs font-bold uppercase tracking-widest shadow-lg shadow-slate-900/10 transition-transform active:scale-95">Ingresar</Button>
                          </Link>
                        </div>

                        {/* Learning Reel */}
                        <div className="mt-10 pt-8 border-t border-slate-50">
                          <div className="flex items-center justify-between mb-5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ruta de Ejecución (33 Semanas)</span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Semana {course.currentWeek} en curso</span>
                          </div>
                          
                          <ScrollArea className="w-full pb-2">
                            <div className="flex items-center gap-2.5 pb-4 px-1">
                              {Array.from({ length: totalWeeks }).map((_, i) => {
                                const weekNum = i + 1;
                                const isCompleted = weekNum < course.currentWeek;
                                const isActive = weekNum === course.currentWeek;
                                const isLocked = weekNum > course.currentWeek;

                                return (
                                  <div key={weekNum} className="relative group shrink-0">
                                    <div className={cn(
                                      "w-9 h-9 flex items-center justify-center text-[10px] font-bold rounded-xl transition-all duration-300",
                                      isCompleted && "bg-slate-100 text-slate-400",
                                      isActive && "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110 ring-4 ring-blue-50",
                                      isLocked && "bg-white border border-slate-200 text-slate-300"
                                    )}>
                                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5 opacity-40" /> : weekNum}
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">S{weekNum}</div>
                                  </div>
                                );
                              })}
                            </div>
                            <ScrollBar orientation="horizontal" className="h-1.5" />
                          </ScrollArea>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right: Barkley Contextual Engine */}
              <div className="lg:col-span-4 space-y-8">
                {/* Visual Timer Card */}
                <Card className="bg-[#0f172a] text-white border-none rounded-[2rem] p-10 relative overflow-hidden shadow-2xl shadow-slate-900/20">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Clock className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-8">
                    <div className="text-center space-y-2">
                      <Badge className="bg-blue-500 text-white border-none text-[9px] px-3 font-bold uppercase tracking-widest mb-4">Focus Mode</Badge>
                      <div className="text-7xl font-bold tracking-tighter tabular-nums">{formatTime(timeLeft)}</div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Ráfaga de Acción Disponible</p>
                    </div>
                    
                    <div className="w-full flex flex-col gap-3">
                      <Button 
                        onClick={() => setIsActive(!isActive)}
                        className={cn(
                          "w-full h-16 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg",
                          isActive 
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-300" 
                          : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
                        )}
                      >
                        {isActive ? "Pausar Sprint" : "Iniciar Ráfaga"}
                      </Button>
                      <p className="text-[9px] text-center text-slate-500 font-medium italic">"El cerebro rinde más en ráfagas cortas."</p>
                    </div>
                  </div>
                </Card>

                {/* Performance Alert */}
                <Card className="bg-white border-none rounded-3xl p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Alerta de Cierre</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Viernes de Evaluación</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Tienes <span className="text-slate-900 font-bold italic">72 horas</span> para completar las actividades de Historia y Ciencias. ¡Tú puedes!
                  </p>
                </Card>

                {/* Reflexive Activity Log */}
                <Card className="bg-blue-600 rounded-3xl p-8 shadow-xl shadow-blue-600/20 text-white space-y-6">
                   <div className="flex items-center justify-between">
                      <History className="w-6 h-6 opacity-60" />
                      <Badge className="bg-white/20 text-white border-none text-[9px] font-bold">Harvard Legacy</Badge>
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-lg font-bold tracking-tight">Bitácora de Reflexión</h4>
                      <p className="text-xs text-blue-100/80 leading-relaxed">¿Qué fue lo que más te sorprendió de las rutas comerciales hoy?</p>
                   </div>
                   <button className="w-full h-12 bg-white text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-50 transition-colors">Anotar Hallazgo</button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}