import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  Target, 
  Brain, 
  Play,
  TrendingUp,
  History,
  Calendar,
  AlertCircle,
  Lock,
  CheckCircle2,
  Menu,
  Plus,
  Video,
  FileUp,
  Settings,
  Users,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const [activeTab, setActiveTab] = useState("menores"); // menores | adultos

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

  const programmaticStructure = {
    menores: [
      { id: "7b", label: "7° Básico", subjects: ["Lengua", "Matemática", "Ciencias", "Historia", "Inglés"], weeks: 30, oas: 45 },
      { id: "8b", label: "8° Básico", subjects: ["Lengua", "Matemática", "Ciencias", "Historia", "Inglés"], weeks: 30, oas: 45 },
      { id: "1m", label: "1° Medio", subjects: ["Lengua", "Matemática", "Ciencias", "Historia", "Inglés"], weeks: 30, oas: 60 },
      { id: "2m", label: "2° Medio", subjects: ["Lengua", "Matemática", "Ciencias", "Historia", "Inglés"], weeks: 30, oas: 60 },
      { id: "3m", label: "3° Medio", subjects: ["Lengua", "Matemática", "Ed. Ciudadana", "Filosofía", "Inglés"], weeks: 30, oas: 55 },
      { id: "4m", label: "4° Medio", subjects: ["Lengua", "Matemática", "Ed. Ciudadana", "Filosofía", "Inglés"], weeks: 30, oas: 55 },
    ],
    adultos: [
      { id: "nb1", label: "NB1 (1-4)", subjects: ["Lenguaje", "Matemática"], weeks: 30, oas: 25 },
      { id: "nb2", label: "NB2 (5-6)", subjects: ["Lenguaje", "Matemática", "Ciencias", "Sociales"], weeks: 30, oas: 50 },
      { id: "nb3", label: "NB3 (7-8)", subjects: ["Lenguaje", "Matemática", "Ciencias", "Sociales"], weeks: 30, oas: 55 },
      { id: "nm1", label: "NM1 (1-2 Media)", subjects: ["Lenguaje", "Matemática", "Ciencias", "Sociales", "Inglés"], weeks: 30, oas: 70 },
      { id: "nm2", label: "NM2 (3-4 Media)", subjects: ["Lenguaje", "Matemática", "Ciencias", "Sociales", "Inglés"], weeks: 30, oas: 65 },
      { id: "nm2i", label: "NM2 Intensivo", subjects: ["Lenguaje", "Matemática", "Ciencias", "Sociales", "Inglés"], weeks: 13, oas: 65, special: true },
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-[#0A192F]">
      {/* Harvard Midnight Sidebar */}
      <aside className={cn(
        "bg-[#0A192F] flex flex-col transition-all duration-500 border-r border-white/5 h-screen sticky top-0",
        isSidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="p-8 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#A51C30] rounded-sm flex items-center justify-center shrink-0">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-white italic">Barkley Admin</span>
            </div>
          )}
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 text-white/40 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] px-4 mb-4">Módulos Admin</p>
          {[
            { icon: LayoutDashboard, label: "Panel Central", active: true },
            { icon: Users, label: "Gestión Alumnos", active: false },
            { icon: Database, label: "Carga Masiva", active: false },
            { icon: Settings, label: "Configuración", active: false },
          ].map((item) => (
            <button key={item.label} className={cn("w-full flex items-center gap-4 p-3.5 rounded-lg transition-all", item.active ? "bg-white/5 text-white border-l-2 border-[#A51C30]" : "text-slate-400 hover:text-white hover:bg-white/5")}>
              <item.icon className={cn("w-5 h-5 shrink-0", item.active && "text-[#A51C30]")} />
              {!isSidebarCollapsed && <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-serif font-bold text-[#0A192F]">Intranet <span className="italic">Configurador</span></h1>
            <div className="flex bg-slate-100 p-1 rounded-sm">
              <button 
                onClick={() => setActiveTab("menores")}
                className={cn("px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all", activeTab === "menores" ? "bg-white text-[#0A192F] shadow-sm" : "text-slate-400")}
              >
                Menores
              </button>
              <button 
                onClick={() => setActiveTab("adultos")}
                className={cn("px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all", activeTab === "adultos" ? "bg-white text-[#0A192F] shadow-sm" : "text-slate-400")}
              >
                Adultos (EPJA)
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-[#A51C30] text-white border-none rounded-none px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase">Admin Mode</Badge>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto space-y-12">
            <section className="space-y-8">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-3xl font-serif font-bold italic text-[#0A192F]">Configuración de Niveles</h2>
                  <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Seleccione un curso para subir recursos y configurar OAs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === "menores" ? programmaticStructure.menores : programmaticStructure.adultos).map((course) => (
                  <Card key={course.id} className="border border-slate-200 rounded-none p-8 bg-white hover:border-[#0A192F]/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-[#0A192F]">{course.label}</h3>
                        <p className="text-[10px] font-bold text-[#A51C30] uppercase tracking-widest mt-1">{course.weeks} Semanas • {course.oas} OAs</p>
                      </div>
                      <Badge variant="outline" className="text-[8px] font-bold border-slate-200">ID: {course.id}</Badge>
                    </div>

                    <div className="space-y-4 mb-8">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Asignaturas Incluidas:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.subjects.map(sub => (
                          <span key={sub} className="text-[9px] bg-slate-50 text-slate-600 px-2 py-1 border border-slate-100">{sub}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="rounded-none border-slate-200 text-[9px] font-bold uppercase tracking-widest h-10 group-hover:bg-[#0A192F] group-hover:text-white transition-all">
                            <FileUp className="w-3.5 h-3.5 mr-2" /> Recursos
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-6 rounded-none bg-white shadow-2xl">
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest border-b pb-2">Gestor de Recursos: {course.label}</h4>
                            <div className="space-y-3">
                              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-all text-[10px] font-bold uppercase tracking-widest">
                                <span className="flex items-center"><Video className="w-4 h-4 mr-2 text-[#A51C30]" /> Subir Video</span>
                                <Plus className="w-3.5 h-3.5 text-slate-400" />
                              </button>
                              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-all text-[10px] font-bold uppercase tracking-widest">
                                <span className="flex items-center"><FileUp className="w-4 h-4 mr-2 text-blue-500" /> Subir Documento</span>
                                <Plus className="w-3.5 h-3.5 text-slate-400" />
                              </button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Link href={`/course/${course.id}`}>
                        <Button className="w-full bg-[#0A192F] text-white rounded-none text-[9px] font-bold uppercase tracking-widest h-10">
                          Configurar
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-[#0A192F] text-white p-12 rounded-none space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Database className="w-40 h-40" /></div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <h3 className="text-3xl font-serif font-bold italic">Panel de Control Maestro</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Desde este panel administrador, usted puede subir los materiales que los alumnos verán en su escritorio. La estructura respeta la cadencia Barkley (Semanas/OA) definida en su tabla maestra.
                </p>
                <div className="pt-4 flex gap-4">
                   <Button className="bg-[#A51C30] hover:bg-[#821626] rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest">Sincronizar Todos los Cursos</Button>
                   <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-none px-8 py-6 text-[10px] font-bold uppercase tracking-widest">Reporte de Avance Masivo</Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}