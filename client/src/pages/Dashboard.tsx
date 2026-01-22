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
  X,
  Plus
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

  // Programación Barkley Consolidada
  const programmaticStructure = [
    { 
      section: "Menores de Edad", 
      courses: [
        { id: "7b", label: "7° Básico", subjects: "L. y Lit., Mat., Cs. Nat., Hist., Inglés", weeks: 30, oas: 45, cadence: "2.67 sem/OA" },
        { id: "8b", label: "8° Básico", subjects: "L. y Lit., Mat., Cs. Nat., Hist., Inglés", weeks: 30, oas: 45, cadence: "2.67 sem/OA" },
        { id: "1m", label: "1° Medio", subjects: "L. y Lit., Mat., Cs. Nat., Hist., Inglés", weeks: 30, oas: 60, cadence: "2.50 sem/OA" },
        { id: "2m", label: "2° Medio", subjects: "L. y Lit., Mat., Cs. Nat., Hist., Inglés", weeks: 30, oas: 60, cadence: "2.50 sem/OA" },
        { id: "3m", label: "3° Medio", subjects: "L. y Lit., Mat., Ed. Ciud., Filo., Inglés", weeks: 30, oas: 55, cadence: "2.73 sem/OA" },
        { id: "4m", label: "4° Medio", subjects: "L. y Lit., Mat., Ed. Ciud., Filo., Inglés", weeks: 30, oas: 55, cadence: "2.73 sem/OA" },
      ]
    },
    { 
      section: "Adultos (EPJA)", 
      subsections: [
        {
          label: "Básica",
          courses: [
            { id: "nb1", label: "NB1 (1-4)", subjects: "Lenguaje, Matemática", weeks: 30, oas: 25, cadence: "2.40 sem/OA" },
            { id: "nb2", label: "NB2 (5-6)", subjects: "Leng., Mat., Cs., Soc.", weeks: 30, oas: 50, cadence: "2.40 sem/OA" },
            { id: "nb3", label: "NB3 (7-8)", subjects: "Leng., Mat., Cs., Soc.", weeks: 30, oas: 55, cadence: "2.18 sem/OA" },
          ]
        },
        {
          label: "Media Full",
          courses: [
            { id: "nm1", label: "NM1 (1-2)", subjects: "L., M., C., S., I.", weeks: 30, oas: 70, cadence: "2.14 sem/OA" },
            { id: "nm2", label: "NM2 (3-4)", subjects: "L., M., C., S., I.", weeks: 30, oas: 65, cadence: "2.31 sem/OA" },
          ]
        },
        {
          label: "Media Intensivo",
          courses: [
            { id: "nm2i", label: "NM2 (13 Sem)", subjects: "L., M., C., S., I.", weeks: 13, oas: 65, cadence: "1.00 sem/OA", special: true },
          ]
        }
      ]
    }
  ];

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
    }
  ];

  const totalWeeks = 33;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-[#0A192F] selection:bg-[#A51C30]/10">
      {/* Harvard Midnight Sidebar */}
      <aside className={cn(
        "bg-[#0A192F] flex flex-col transition-all duration-500 ease-in-out border-r border-white/5 h-screen sticky top-0",
        isSidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="p-8 flex items-center justify-between">
          <div className={cn("flex items-center gap-3 transition-opacity", isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
            <div className="w-9 h-9 bg-[#A51C30] rounded-sm flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold text-white tracking-tight italic text-nowrap">Barkley Instituto</span>
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { icon: LayoutDashboard, label: "Escritorio", active: true },
            { icon: BookOpen, label: "Currículum", active: false },
            { icon: Calendar, label: "Planificación", active: false },
            { icon: TrendingUp, label: "Progreso Académico", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-4 p-3.5 rounded-lg transition-all group",
                item.active 
                ? "bg-white/5 text-white border-l-2 border-[#A51C30]" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-105", item.active && "text-[#A51C30]")} />
              {!isSidebarCollapsed && <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{item.label}</span>}
            </button>
          ))}

          {/* New Section: Control de Estudios */}
          {!isSidebarCollapsed && (
            <div className="mt-10 space-y-6">
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] px-4">Control de Estudios</p>
              <div className="space-y-4 px-2">
                {programmaticStructure.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[10px] font-bold text-[#A51C30] uppercase tracking-widest px-2">{section.section}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {section.courses?.map(course => (
                        <button key={course.id} className="text-[9px] font-bold text-slate-400 bg-white/5 p-2 rounded-sm hover:text-white hover:bg-white/10 transition-all text-left truncate">
                          {course.label}
                        </button>
                      ))}
                      {section.subsections?.map((sub, sidx) => (
                        <div key={sidx} className="col-span-2 space-y-1 mt-2">
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] px-2">{sub.label}</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {sub.courses.map(course => (
                              <button key={course.id} className={cn(
                                "text-[9px] font-bold p-2 rounded-sm transition-all text-left truncate",
                                course.special ? "bg-[#A51C30]/20 text-[#A51C30] hover:bg-[#A51C30]/30" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                              )}>
                                {course.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        {!isSidebarCollapsed && (
          <div className="p-8 m-4 bg-black/20 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[#A51C30]" />
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.3em]">Metodología Barkley</span>
            </div>
            <div className="space-y-3">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#A51C30] w-2/3" />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">"Ritmo calculado por OA: La clave del éxito cognitivo."</p>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Academic Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-serif font-bold text-[#0A192F]">Escritorio <span className="italic">Académico</span></h1>
            <Badge className="bg-[#F8F9FA] text-[#0A192F] border-slate-200 rounded-sm px-3 py-1 font-bold text-[10px] uppercase tracking-widest">Validación de Estudios: Menores</Badge>
          </div>
          <div className="flex items-center gap-8">
             <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estudiante Activo</p>
                <p className="text-sm font-serif font-bold italic text-[#0A192F]">Juan Pablo (7° Básico)</p>
             </div>
             <div className="w-10 h-10 rounded-sm bg-[#0A192F] flex items-center justify-center text-white font-serif font-bold text-lg shadow-inner">JP</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              <div className="lg:col-span-8 space-y-12">
                <section className="space-y-6">
                  <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-3xl font-serif font-bold italic text-[#0A192F]">Asignaturas en Curso</h2>
                      <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Plan Escolar: 30 Semanas • 45 OA Totales</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {currentCourses.map(course => (
                      <Card key={course.id} className="border border-slate-200 shadow-sm hover:border-[#0A192F]/20 transition-all duration-300 rounded-none overflow-hidden bg-white">
                        <div className="p-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-5 flex-1">
                              <div className="flex items-center gap-4">
                                <Badge className="bg-[#F8F9FA] text-slate-500 rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border-slate-200">{course.category}</Badge>
                                <div className="flex items-center gap-1.5 text-[#A51C30]">
                                  <TrendingUp className="w-4 h-4" />
                                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{course.progress}% COMPLETADO</span>
                                </div>
                                
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#0A192F] transition-colors bg-slate-50 px-3 py-1.5 rounded-sm border border-slate-100">
                                      <Target className="w-3.5 h-3.5" /> Objetivos
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-96 bg-white shadow-2xl p-8 rounded-none border-slate-200" side="right" align="start">
                                    <div className="space-y-6">
                                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0A192F]">Currículum Consolidado</h4>
                                        <BookOpen className="w-4 h-4 text-[#A51C30]" />
                                      </div>
                                      <div className="space-y-5">
                                        {course.objectives.map(obj => (
                                          <div key={obj.id} className="group">
                                            <p className="text-[11px] font-serif font-bold italic text-[#0A192F] group-hover:text-[#A51C30] transition-colors tracking-tight">{obj.title}</p>
                                            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">{obj.desc}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <h3 className="text-3xl font-serif font-bold text-[#0A192F] leading-tight">{course.title}</h3>
                                <p className="text-xs font-bold text-slate-400 mt-4 flex items-center gap-2 uppercase tracking-widest">
                                  <Play className="w-3.5 h-3.5 text-[#A51C30] fill-[#A51C30]/5" /> 
                                  <span className="text-slate-300">Próximo Hito:</span> {course.next}
                                </p>
                              </div>
                            </div>
                            
            <Link href="/course/historia">
              <Button className="bg-[#A51C30] hover:bg-[#821626] text-white rounded-none h-14 px-12 text-[10px] font-bold uppercase tracking-[0.3em] shadow-lg shadow-[#A51C30]/10 transition-transform active:scale-95">Configurar Curso</Button>
            </Link>
                          </div>

                          {/* Learning Reel */}
                          <div className="mt-12 pt-10 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-300">Cronograma Barkley (Cadencia: 2.67 sem/OA)</span>
                              <span className="text-[9px] font-bold text-[#0A192F] bg-[#F8F9FA] border border-slate-200 px-3 py-1 rounded-sm uppercase tracking-widest">Semana {course.currentWeek} ACTIVA</span>
                            </div>
                            
                            <ScrollArea className="w-full">
                              <div className="flex items-center gap-2 pb-6 px-1">
                                {Array.from({ length: totalWeeks }).map((_, i) => {
                                  const weekNum = i + 1;
                                  const isCompleted = weekNum < course.currentWeek;
                                  const isActive = weekNum === course.currentWeek;
                                  const isLocked = weekNum > course.currentWeek;

                                  return (
                                    <div key={weekNum} className="relative group shrink-0">
                                      <div className={cn(
                                        "w-10 h-10 flex items-center justify-center text-[11px] font-bold rounded-sm transition-all duration-300",
                                        isCompleted && "bg-slate-100 text-slate-400 border border-slate-200 opacity-60",
                                        isActive && "bg-[#0A192F] text-white shadow-xl shadow-black/10 scale-110 ring-2 ring-[#0A192F]/5",
                                        isLocked && "bg-white border border-slate-200 text-slate-300"
                                      )}>
                                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5 opacity-30" /> : weekNum}
                                      </div>
                                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">S{weekNum}</div>
                                    </div>
                                  );
                                })}
                              </div>
                              <ScrollBar orientation="horizontal" className="h-1" />
                            </ScrollArea>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                <section className="space-y-6 pt-12 border-t border-slate-200">
                   <div className="flex items-center gap-4">
                      <Plus className="w-6 h-6 text-[#A51C30]" />
                      <h3 className="text-2xl font-serif font-bold italic text-[#0A192F]">Estructura de Programación Consolidada</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="rounded-none border-slate-200 p-8 bg-white space-y-4">
                         <h4 className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">Plan Adultos (EPJA)</h4>
                         <p className="text-[11px] text-slate-500 leading-relaxed italic">
                            Estructura optimizada para validación de estudios en modalidad intensiva y flexible.
                         </p>
                         <div className="space-y-2 pt-4">
                            <div className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-2">
                               <span className="text-slate-400">Nivel NM2 Intensivo</span>
                               <span className="text-[#0A192F]">1.00 sem/OA</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-2">
                               <span className="text-slate-400">Básica NB3</span>
                               <span className="text-[#0A192F]">2.18 sem/OA</span>
                            </div>
                         </div>
                      </Card>
                      <Card className="rounded-none border-slate-200 p-8 bg-white space-y-4">
                         <h4 className="text-xs font-bold uppercase tracking-widest text-[#0A192F]">Plan Escolar (Menores)</h4>
                         <p className="text-[11px] text-slate-500 leading-relaxed italic">
                            Cadencia extendida para profundizar en contenidos curriculares fundamentales.
                         </p>
                         <div className="space-y-2 pt-4">
                            <div className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-2">
                               <span className="text-slate-400">7° / 8° Básico</span>
                               <span className="text-[#0A192F]">2.67 sem/OA</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold border-b border-slate-50 pb-2">
                               <span className="text-slate-400">Media 1° / 2°</span>
                               <span className="text-[#0A192F]">2.50 sem/OA</span>
                            </div>
                         </div>
                      </Card>
                   </div>
                </section>
              </div>

              {/* Right: Harvard Contextual Bar */}
              <div className="lg:col-span-4 space-y-10">
                {/* Visual Timer Card */}
                <Card className="bg-[#0A192F] text-white border-none rounded-none p-12 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Clock className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-10">
                    <div className="text-center space-y-3">
                      <Badge className="bg-[#A51C30] text-white border-none text-[8px] px-3 py-1 font-bold uppercase tracking-[0.4em] mb-4">Métricas Barkley</Badge>
                      <div className="text-7xl font-serif font-bold italic tracking-tighter tabular-nums">{formatTime(timeLeft)}</div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Sesión de Alto Rendimiento</p>
                    </div>
                    
                    <div className="w-full flex flex-col gap-4">
                      <Button 
                        onClick={() => setIsActive(!isActive)}
                        className={cn(
                          "w-full h-16 rounded-none text-[10px] font-bold uppercase tracking-[0.4em] transition-all",
                          isActive 
                          ? "bg-white/10 hover:bg-white/20 text-white" 
                          : "bg-[#A51C30] hover:bg-[#821626] text-white shadow-lg shadow-[#A51C30]/20"
                        )}
                      >
                        {isActive ? "Pausar Sesión" : "Iniciar Ráfaga"}
                      </Button>
                      <p className="text-[10px] text-center text-slate-500 font-serif font-bold italic">"Calculated pacing for optimal cognitive results."</p>
                    </div>
                  </div>
                </Card>

                {/* Performance Card */}
                <Card className="bg-white border border-slate-200 rounded-none p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F8F9FA] border border-slate-100 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-[#A51C30]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#0A192F]">Tabla Maestra</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sincronización OA</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-2">
                       <span className="font-bold text-slate-400 uppercase tracking-widest">Plan Actual</span>
                       <span className="font-serif font-bold italic">Full 30 Semanas</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-2">
                       <span className="font-bold text-slate-400 uppercase tracking-widest">Meta OA</span>
                       <span className="font-serif font-bold italic">45 Objetivos</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-bold text-slate-400 uppercase tracking-widest">Exigencia</span>
                       <span className="font-[#A51C30] font-serif font-bold italic">2.67 sem/OA</span>
                    </div>
                  </div>
                </Card>

                {/* Harvard Reflexive Component */}
                <Card className="bg-[#F8F9FA] border border-[#0A192F]/10 rounded-none p-10 space-y-8">
                   <div className="flex items-center justify-between">
                      <History className="w-6 h-6 text-[#0A192F] opacity-20" />
                      <span className="text-[8px] font-bold text-[#0A192F] uppercase tracking-[0.5em] opacity-40">Administrative Unit</span>
                   </div>
                   <div className="space-y-3">
                      <h4 className="text-xl font-serif font-bold italic text-[#0A192F]">Validación de Estudios</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">Acceso rápido a la configuración de niveles y cadencias de aprendizaje Barkley.</p>
                   </div>
                   <button className="w-full h-12 border border-[#0A192F] text-[#0A192F] rounded-none text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-[#0A192F] hover:text-white transition-all">Ver Malla Completa</button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}