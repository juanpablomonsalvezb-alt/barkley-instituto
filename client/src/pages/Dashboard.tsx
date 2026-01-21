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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
    { id: "lengua", title: "Lengua y Literatura", progress: 15, next: "OA3: Análisis de Narraciones", category: "7° Básico", color: "bg-blue-500" },
    { id: "mate", title: "Matemática", progress: 8, next: "OA1: Números Enteros", category: "7° Básico", color: "bg-crimson-500" },
    { id: "ciencias", title: "Ciencias Naturales", progress: 0, next: "OA1: La Célula", category: "7° Básico", color: "bg-green-500" },
  ];

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
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Learning Path */}
            <div className="lg:col-span-8 space-y-10">
              <section className="space-y-6">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-serif font-black italic">Mi Ruta de Aprendizaje</h2>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Basado en Temario Mineduc</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {currentCourses.map(course => (
                    <Card key={course.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-none overflow-hidden group">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className={`w-2 ${course.color} shrink-0`} />
                          <div className="p-8 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-gray-100 text-gray-500 rounded-none border-none text-[8px] font-black uppercase tracking-widest">{course.category}</Badge>
                                <span className="text-[10px] font-black text-[#a51c30] uppercase tracking-widest">{course.progress}% Completado</span>
                              </div>
                              <h3 className="text-xl font-serif font-black">{course.title}</h3>
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Play className="w-3 h-3 text-[#a51c30]" /> Próximo: {course.next}
                              </p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="w-32 h-1 bg-gray-100 overflow-hidden">
                                <div className={`h-full ${course.color} transition-all duration-1000`} style={{ width: `${course.progress}%` }} />
                              </div>
                              <Link href={`/course/${course.id}`}>
                                <Button className="bg-[#1e1e1e] hover:bg-black text-white rounded-none h-12 px-8 text-[10px] font-black uppercase tracking-[0.2em]">Continuar</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Weekly Habit Tracker */}
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

            {/* Right Column: Barkley Engine */}
            <div className="lg:col-span-4 space-y-10">
              {/* The Visual Timer (Externalized Time) */}
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

              {/* Friday Deadline Alert */}
              <Card className="border-l-4 border-amber-500 bg-amber-50/50 p-8 space-y-4 rounded-none">
                 <div className="flex items-center gap-3 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Alerta de Evaluación</span>
                 </div>
                 <p className="text-xs font-medium text-gray-600 leading-relaxed">
                   Faltan <strong>3 días</strong> para tu evaluación de cierre semanal. Asegúrate de completar los OA3 y OA4 de Lengua.
                 </p>
              </Card>

              {/* Resource Center */}
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