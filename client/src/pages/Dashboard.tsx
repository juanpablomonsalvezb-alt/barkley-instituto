import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
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
  Database,
  ChevronRight,
  LogOut,
  Loader2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("menores"); // menores | adultos
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { isAdmin } = useProfile();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acceso Requerido",
        description: "Ingresa con tu cuenta para acceder al panel...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isLoading, isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#A51C30] mx-auto" />
          <p className="text-[#0A192F] font-serif italic">Cargando Barkley Instituto...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const programmaticStructure = {
    menores: [
      { id: "7b", label: "7° Básico", subjects: ["Lengua y Literatura", "Matemática", "Ciencias Naturales", "Historia", "Inglés"], weeks: 30, oas: 45 },
      { id: "8b", label: "8° Básico", subjects: ["Lengua y Literatura", "Matemática", "Ciencias Naturales", "Historia", "Inglés"], weeks: 30, oas: 45 },
      { id: "1m", label: "1° Medio", subjects: ["Lengua y Literatura", "Matemática", "Ciencias Naturales", "Historia", "Inglés"], weeks: 30, oas: 60 },
      { id: "2m", label: "2° Medio", subjects: ["Lengua y Literatura", "Matemática", "Ciencias Naturales", "Historia", "Inglés"], weeks: 30, oas: 60 },
      { id: "3m", label: "3° Medio", subjects: ["Lengua y Literatura", "Matemática", "Educación Ciudadana", "Filosofía", "Inglés"], weeks: 30, oas: 55 },
      { id: "4m", label: "4° Medio", subjects: ["Lengua y Literatura", "Matemática", "Educación Ciudadana", "Filosofía", "Inglés"], weeks: 30, oas: 55 },
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

  const getSubjectSlug = (subjectName: string) => {
    return subjectName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-[#0A192F]">
      {/* Sidebar */}
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
            {user && (
              <div className="flex items-center gap-3">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                <span className="text-xs font-bold text-slate-600" data-testid="text-user-name">
                  {user.firstName || user.email || "Usuario"}
                </span>
              </div>
            )}
            <a href="/api/logout" data-testid="btn-logout">
              <Button variant="outline" size="sm" className="text-[9px] font-bold uppercase tracking-widest gap-2">
                <LogOut className="w-3 h-3" /> Salir
              </Button>
            </a>
            {isAdmin && (
              <Badge className="bg-[#A51C30] text-white border-none rounded-none px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase" data-testid="badge-admin">Admin Mode</Badge>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto space-y-12">
            <section className="space-y-8">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-3xl font-serif font-bold italic text-[#0A192F]">Asignaturas por Nivel</h2>
                <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">Seleccione la asignatura específica para configurar videos, documentos y rutas de aprendizaje</p>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {(activeTab === "menores" ? programmaticStructure.menores : programmaticStructure.adultos).map((course) => (
                  <div key={course.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-serif font-bold text-[#0A192F] bg-white px-4 py-2 border border-slate-200">{course.label}</h3>
                      <div className="h-px flex-1 bg-slate-200"></div>
                      <Badge variant="outline" className="text-[9px] font-bold tracking-widest uppercase py-1 border-slate-200 text-slate-400">{course.weeks} Semanas / {course.oas} OA</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {course.subjects.map((sub) => (
                        <Link key={sub} href={`/course/${course.id}-${getSubjectSlug(sub)}`}>
                          <Card className="p-6 bg-white border border-slate-200 hover:border-[#A51C30] hover:shadow-md transition-all group cursor-pointer rounded-none">
                            <div className="space-y-4">
                              <div className="w-8 h-8 bg-slate-50 flex items-center justify-center group-hover:bg-[#A51C30]/5 transition-colors">
                                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#A51C30]" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-[#0A192F] group-hover:text-[#A51C30] transition-colors leading-tight">{sub}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center">
                                  Configurar <ChevronRight className="w-3 h-3 ml-1" />
                                </p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#0A192F] text-white p-12 rounded-none space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Database className="w-40 h-40" /></div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <h3 className="text-3xl font-serif font-bold italic">Arquitectura de Configuración</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Al entrar en cada asignatura, podrá gestionar la carga de videos, documentos anexos, y visualizar la ruta de aprendizaje basada en el método Barkley. Cada asignatura hereda la cadencia temporal del nivel correspondiente.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}