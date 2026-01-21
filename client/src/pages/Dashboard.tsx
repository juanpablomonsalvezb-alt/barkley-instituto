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
  Info
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

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState(1200);
  const [isActive, setIsActive] = useState(false);

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

  const weeklySchedule = [
    { day: "Lunes", task: "Lengua: Análisis Narrativo (OA3)", status: "done" },
    { day: "Martes", task: "Matemática: Álgebra Básica", status: "current" },
    { day: "Miércoles", task: "Ciencias: Células y Tejidos", status: "upcoming" },
    { day: "Jueves", task: "Historia: Civilizaciones", status: "upcoming" },
    { day: "Viernes", task: "Evaluación Semanal (25 Preguntas)", status: "deadline" },
  ];

  const currentCourses = [
    { 
      id: "lengua", 
      title: "Lengua y Literatura", 
      progress: 15, 
      currentWeek: 5,
      next: "OA3: Análisis de Narraciones", 
      category: "7° Básico", 
      color: "bg-blue-500",
      objectives: [
        { id: 1, title: "OA 3: Análisis de Narraciones", desc: "Conflictos, personajes y disposición temporal." },
        { id: 2, title: "OA 4: Análisis de Poemas", desc: "Lenguaje poético, figuras y sonoridad." },
        { id: 3, title: "OA 7: Interpretación Literaria", desc: "Dilemas y visión de mundo en obras." },
        { id: 4, title: "OA 8: Textos Argumentativos", desc: "Hechos vs opiniones y postura del autor." },
        { id: 5, title: "OA 9: Medios de Comunicación", desc: "Propósitos, estereotipos e imágenes." },
        { id: 6, title: "OA 15: Escritura y Planificación", desc: "Coherencia, cohesión y adecuación al contexto." }
      ]
    },
    { 
      id: "mate", 
      title: "Matemática", 
      progress: 8, 
      currentWeek: 3,
      next: "OA1: Números Enteros", 
      category: "7° Básico", 
      color: "bg-[#a51c30]",
      objectives: [
        { id: 1, title: "OA 1: Números Enteros", desc: "Representación, orden y operaciones básicas." },
        { id: 2, title: "OA 2: Fracciones y Decimales", desc: "Multiplicación y división en contextos reales." },
        { id: 3, title: "OA 3: Porcentajes", desc: "Cálculos, aumentos y descuentos aplicados." },
        { id: 4, title: "OA 8: Álgebra Básica", desc: "Expresiones, ecuaciones e inecuaciones." },
        { id: 5, title: "OA 11: Geometría Plana", desc: "Áreas y perímetros de figuras compuestas." },
        { id: 6, title: "OA 14: Datos y Probabilidades", desc: "Gráficos, promedios y azar simple." }
      ]
    },
    { 
      id: "ciencias", 
      title: "Ciencias Naturales", 
      progress: 0, 
      currentWeek: 1,
      next: "OA1: La Célula", 
      category: "7° Básico", 
      color: "bg-green-500",
      objectives: [
        { id: 1, title: "OA 1: La Célula", desc: "Estructuras, funciones y tipos celulares." },
        { id: 2, title: "OA 2: Sistemas del Cuerpo", desc: "Digestión, respiración y circulación." },
        { id: 3, title: "OA 7: Microorganismos", desc: "Bacterias, virus y defensas del cuerpo." },
        { id: 4, title: "OA 11: Fuerza y Movimiento", desc: "Leyes básicas y tipos de fuerzas." },
        { id: 5, title: "OA 14: Capas de la Tierra", desc: "Litósfera, atmósfera e hidrósfera." },
        { id: 6, title: "OA 16: Clima y Cambio Global", desc: "Variables climáticas y efectos humanos." }
      ]
    },
  ];

  const totalWeeks = 33;

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans text-[#1e1e1e]">
      {/* Navigation Rail - Minimalist Harvard Style */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-100 flex flex-col transition-all">
        <div className="p-6 mb-10 flex items-center gap-4 border-b border-gray-50">
          <div className="w-10 h-10 bg-[#a51c30] flex items-center justify-center shrink-0">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-serif text-lg font-black uppercase leading-none">Barkley</span>
            <span className="text-[7px] tracking-[0.4em] font-black text-[#a51c30] uppercase">Instituto</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Escritorio", active: true },
            { icon: BookOpen, label: "Mis Asignaturas", active: false },
            { icon: Calendar, label: "Calendario", active: false },
            { icon: TrendingUp, label: "Desempeño", active: false },
            { icon: Brain, label: "Método", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-4 p-4 rounded-none transition-all ${
                item.active 
                ? "bg-gray-50 text-[#a51c30] border-r-4 border-[#a51c30]" 
                : "text-gray-400 hover:text-[#1e1e1e] hover:bg-gray-50/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="rounded-none border-gray-200 text-[9px] font-black tracking-widest uppercase py-1">Estudiante: 7° Básico</Badge>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Semana Actual</span>
                <span className="text-[11px] font-bold">Semana 1: Adaptación</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-[#a51c30] flex items-center justify-center text-white text-[10px] font-bold">JD</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <section className="space-y-6">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-serif font-black italic">Mi Ruta de Aprendizaje</h2>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Progreso Anual de Unidades</span>
                </div>
                
                <div className="grid grid-cols-1 gap-8">
                  {currentCourses.map(course => (
                    <Card key={course.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-none overflow-hidden group bg-white">
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          <div className="p-8 flex items-center justify-between gap-8 border-b border-gray-50">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-gray-100 text-gray-500 rounded-none border-none text-[8px] font-black uppercase tracking-widest">{course.category}</Badge>
                                <span className="text-[10px] font-black text-[#a51c30] uppercase tracking-widest">{course.progress}% Completado</span>
                                
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-[#a51c30] transition-colors bg-gray-50 px-2 py-1 rounded-sm">
                                      <Info className="w-3 h-3" /> Ver Objetivos
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 bg-white border border-gray-100 shadow-2xl p-6 rounded-none" side="right" align="start">
                                    <div className="space-y-6">
                                      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a51c30]">Plan de Estudios Anual</h4>
                                        <Target className="w-4 h-4 text-[#a51c30]" />
                                      </div>
                                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {course.objectives.map(obj => (
                                          <div key={obj.id} className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-[#1e1e1e]">{obj.title}</p>
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">{obj.desc}</p>
                                            <div className="h-px w-full bg-gray-50 mt-3" />
                                          </div>
                                        ))}
                                      </div>
                                      <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em] text-center italic">
                                        Estructura basada en Temario Mineduc 7° Básico
                                      </p>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <h3 className="text-xl font-serif font-black">{course.title}</h3>
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Play className="w-3 h-3 text-[#a51c30]" /> Próximo: {course.next}
                              </p>
                            </div>
                            <Link href={`/course/${course.id}`}>
                              <Button className="bg-[#1e1e1e] hover:bg-black text-white rounded-none h-12 px-8 text-[10px] font-black uppercase tracking-[0.2em]">Continuar</Button>
                            </Link>
                          </div>

                          <div className="px-8 py-6 bg-gray-50/30">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Línea de Tiempo (33 Semanas)</span>
                              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#a51c30]">Semana {course.currentWeek} Activa</span>
                            </div>
                            
                            <ScrollArea className="w-full whitespace-nowrap">
                              <div className="flex items-center gap-2 pb-4">
                                {Array.from({ length: totalWeeks }).map((_, i) => {
                                  const weekNum = i + 1;
                                  const isCompleted = weekNum < course.currentWeek;
                                  const isActive = weekNum === course.currentWeek;
                                  const isLocked = weekNum > course.currentWeek;
                                  const isMidterm = weekNum === 15;
                                  const isFinal = weekNum === 33;

                                  return (
                                    <div key={weekNum} className="flex flex-col items-center gap-2 shrink-0 group">
                                      <div 
                                        className={`w-8 h-8 flex items-center justify-center text-[9px] font-black transition-all relative
                                          ${isCompleted ? 'bg-gray-200 text-gray-400 opacity-50' : ''}
                                          ${isActive ? 'bg-[#a51c30] text-white shadow-lg scale-110' : ''}
                                          ${isLocked ? 'bg-white border border-gray-100 text-gray-300' : ''}
                                          ${(isMidterm || isFinal) && !isActive && !isCompleted ? 'border-dashed border-2 border-[#a51c30]/30' : ''}
                                        `}
                                      >
                                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : isLocked ? <Lock className="w-3 h-3 opacity-50" /> : weekNum}
                                        
                                        <div className="absolute -top-8 bg-[#1e1e1e] text-white text-[7px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none uppercase tracking-widest">
                                          Semana {weekNum} {isMidterm ? '• Macro' : isFinal ? '• Final' : ''}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <ScrollBar orientation="horizontal" className="h-1.5" />
                            </ScrollArea>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="bg-white border border-gray-100 p-10 space-y-8">
                <div className="flex items-center gap-4">
                   <Calendar className="w-6 h-6 text-[#a51c30]" />
                   <h3 className="text-[12px] font-black uppercase tracking-[0.4em]">Cronograma Semanal de Hábitos</h3>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {weeklySchedule.map((item, i) => (
                    <div key={i} className={`p-4 border text-center space-y-3 transition-all ${item.status === 'done' ? 'bg-gray-50 border-transparent opacity-50' : item.status === 'deadline' ? 'border-[#a51c30] bg-[#a51c30]/5' : 'border-gray-100'}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.day}</span>
                      <div className="h-0.5 w-4 bg-gray-200 mx-auto" />
                      <p className="text-[10px] font-bold leading-tight uppercase tracking-tight h-8 flex items-center justify-center">{item.task}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-10">
              <Card className="bg-[#1e1e1e] text-white border-none rounded-none p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Clock className="w-32 h-32" />
                </div>
                <div className="relative z-10 space-y-8 text-center">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a51c30]">Ráfaga de Acción</h4>
                    <div className="text-7xl font-serif font-black italic">{formatTime(timeLeft)}</div>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Cerrando la brecha de intención</p>
                  </div>
                  <Button 
                    onClick={() => setIsActive(!isActive)}
                    className={`w-full h-14 rounded-none text-[11px] font-black uppercase tracking-[0.3em] transition-all ${isActive ? 'bg-white/10 hover:bg-white/20' : 'bg-[#a51c30] hover:bg-[#821626]'}`}
                  >
                    {isActive ? "Pausar" : "Iniciar Sprint"}
                  </Button>
                </div>
              </Card>

              <Card className="border-l-4 border-amber-500 bg-amber-50/50 p-8 space-y-4 rounded-none">
                 <div className="flex items-center gap-3 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Alerta de Evaluación</span>
                 </div>
                 <p className="text-xs font-medium text-gray-600 leading-relaxed">
                   Faltan <strong>3 días</strong> para tu evaluación de cierre semanal. Asegúrate de completar los OA3 y OA4 de Lengua.
                 </p>
              </Card>

              <section className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Material de Apoyo</h4>
                <div className="space-y-3">
                   {["Temario 7° Básico PDF", "Guía de Validaciones", "Calendario Secreduc"].map(item => (
                     <button key={item} className="w-full text-left p-4 border border-gray-100 hover:border-[#a51c30] hover:text-[#a51c30] transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-between group">
                       {item} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                     </button>
                   ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}