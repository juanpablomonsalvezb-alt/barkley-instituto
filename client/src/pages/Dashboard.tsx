import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  Target, 
  Brain, 
  Bell, 
  User,
  CheckCircle2,
  Play,
  ChevronRight,
  TrendingUp,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes (Barkley Sprint)
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

  const courses = [
    { id: 1, title: "Matemática: Álgebra y Funciones", progress: 65, next: "Ecuaciones Cuadráticas", category: "Plan Focus" },
    { id: 2, title: "Lenguaje: Comprensión Lectora", progress: 40, next: "Análisis Crítico de Medios", category: "Plan Focus" },
    { id: 3, title: "Neurociencia del Aprendizaje", progress: 10, next: "Externalización del Tiempo", category: "Método Barkley" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans">
      {/* Sidebar - Inspired by Canvas but with Harvard Elegance */}
      <aside className="w-24 lg:w-64 bg-[#1e1e1e] flex flex-col items-center lg:items-start py-8 transition-all border-r border-white/5">
        <div className="px-6 mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#a51c30] flex items-center justify-center shrink-0">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-serif text-xl font-black text-white uppercase leading-none">Barkley</span>
            <span className="text-[9px] tracking-[0.4em] font-black text-[#a51c30] uppercase mt-1">Instituto</span>
          </div>
        </div>

        <nav className="flex-1 w-full px-4 space-y-4">
          {[
            { icon: LayoutDashboard, label: "Panel Principal", active: true },
            { icon: BookOpen, label: "Mis Cursos", active: false },
            { icon: TrendingUp, label: "Progreso", active: false },
            { icon: History, label: "Historial", active: false },
            { icon: Brain, label: "Entrenamiento", active: false },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-4 p-4 lg:px-6 rounded-none transition-all group ${
                item.active 
                ? "bg-[#a51c30] text-white" 
                : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="px-6 pt-8 border-t border-white/5 w-full">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">JD</div>
              </div>
              <div className="hidden lg:block">
                <p className="text-[10px] font-black text-white uppercase tracking-wider leading-none">Juan Diego</p>
                <p className="text-[9px] text-white/40 uppercase mt-1 font-bold">Estudiante Premium</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Dashboard */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-[13px] font-black uppercase tracking-[0.3em] text-gray-400">Panel del Estudiante • Bienvenido de vuelta</h2>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-[#a51c30] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#a51c30] rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-gray-100 mx-2" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#1e1e1e]">Enero 21, 2026</span>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* Barkley Focus Timer - The Heart of the Neuro-Platform */}
          <section>
            <Card className="bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden rounded-none border-l-8 border-[#a51c30]">
              <CardContent className="p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-6 max-w-lg">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#a51c30]/10 text-[#a51c30] hover:bg-[#a51c30]/10 rounded-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">Fase de Acción</Badge>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Método Barkley</span>
                  </div>
                  <h3 className="text-4xl font-serif font-black italic text-[#1e1e1e]">Ráfaga de Ejecución</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Divide tu desempeño. Enfócate en una sola meta por los próximos 20 minutos. El cronómetro visual externaliza tu tiempo.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setIsActive(!isActive)}
                      className={`h-14 px-10 rounded-none uppercase font-black tracking-[0.2em] text-xs transition-all ${isActive ? 'bg-gray-100 text-gray-500' : 'bg-[#a51c30] text-white hover:bg-[#821626]'}`}
                    >
                      {isActive ? "Pausar Sprint" : "Iniciar Ráfaga"}
                    </Button>
                    <Button variant="outline" onClick={() => setTimeLeft(1200)} className="h-14 px-8 rounded-none border-gray-200 text-gray-400 font-black text-xs uppercase tracking-widest">
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="relative group">
                  <div className={`absolute -inset-8 bg-[#a51c30]/5 rounded-full blur-3xl transition-all duration-1000 ${isActive ? 'scale-150 opacity-100' : 'scale-100 opacity-50'}`} />
                  <div className="relative text-center space-y-2">
                    <div className="text-[120px] font-serif font-black text-[#1e1e1e] leading-none tracking-tighter">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] text-[#a51c30]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a51c30] animate-pulse" />
                      Tiempo Restante
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Courses Overview */}
            <div className="lg:col-span-2 space-y-10">
              <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#1e1e1e]">Mis Programas Activos</h4>
                <a href="#" className="text-[#a51c30] text-[10px] font-black uppercase tracking-widest hover:underline">Ver todo</a>
              </div>

              <div className="space-y-6">
                {courses.map(course => (
                  <Card key={course.id} className="border-none bg-white shadow-sm hover:shadow-md transition-all rounded-none group">
                    <CardContent className="p-8 flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-[#a51c30]/20 transition-all">
                          <BookOpen className="w-7 h-7 text-gray-300 group-hover:text-[#a51c30] transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#a51c30]">{course.category}</span>
                          <h5 className="text-xl font-serif font-black text-[#1e1e1e] group-hover:underline underline-offset-4">{course.title}</h5>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Siguiente: {course.next}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="w-32 space-y-2">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-gray-400">Progreso</span>
                             <span className="text-[#1e1e1e]">{course.progress}%</span>
                           </div>
                           <Progress value={course.progress} className="h-1 bg-gray-100" />
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-[#a51c30]/5 hover:text-[#a51c30] rounded-none">
                          <Play className="w-5 h-5 fill-current" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="space-y-10">
              <div className="flex items-end justify-between border-b border-gray-100 pb-6">
                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#1e1e1e]">Métricas de Voluntad</h4>
              </div>
              
              <Card className="border-none bg-[#1e1e1e] text-white p-10 space-y-10 rounded-none">
                <div className="space-y-8">
                  {[
                    { label: "Capacidad Ejecutiva", val: 82, color: "bg-[#a51c30]" },
                    { label: "Vencimiento Procrastinación", val: 94, color: "bg-emerald-500" },
                    { label: "Consistencia de Ráfagas", val: 68, color: "bg-amber-500" },
                  ].map(stat => (
                    <div key={stat.label} className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em]">
                        <span className="text-white/40">{stat.label}</span>
                        <span className="text-white">{stat.val}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 overflow-hidden">
                        <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#a51c30]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Meta del Día</p>
                      <p className="text-[12px] font-bold text-white uppercase mt-1">4 Ráfagas Completadas</p>
                    </div>
                  </div>
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-none h-14 text-[11px] font-black uppercase tracking-[0.3em]">
                    Ver Reporte de Neurociencia
                  </Button>
                </div>
              </Card>

              {/* Quick Action - Point of Action */}
              <Card className="border-2 border-dashed border-gray-100 bg-transparent p-10 flex flex-col items-center justify-center text-center space-y-6 rounded-none">
                <div className="w-16 h-16 bg-white shadow-xl flex items-center justify-center">
                  <ChevronRight className="w-8 h-8 text-[#a51c30]" />
                </div>
                <div className="space-y-2">
                  <h6 className="text-lg font-serif font-black italic">¿Atascado en una tarea?</h6>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Inicia una sesión de apoyo instantáneo</p>
                </div>
                <Button variant="outline" className="rounded-none border-gray-200 uppercase text-[10px] font-black tracking-widest h-12 px-8">Solicitar Tutor</Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}