import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Brain, 
  Video, 
  FileUp, 
  Plus, 
  Settings, 
  Target,
  LayoutDashboard as LayoutIcon,
  ChevronRight,
  Share2,
  Lock,
  ExternalLink,
  GraduationCap, 
  BookOpen, 
  MessageSquare,
  Download,
  Calendar,
  StickyNote,
  Headphones,
  Map,
  ImageIcon,
  Presentation,
  FileSearch,
  PenTool,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function CoursePlayer() {
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id || "";
  
  // Parse course info from ID (e.g., "7b-lengua-y-literatura")
  const parts = courseId.split("-");
  const levelCode = parts[0];
  const subjectLabel = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

  const levels: Record<string, string> = {
    "7b": "7° Básico",
    "8b": "8° Básico",
    "1m": "1° Medio",
    "2m": "2° Medio",
    "3m": "3° Medio",
    "4m": "4° Medio",
    "nb1": "NB1 (1-4)",
    "nb2": "NB2 (5-6)",
    "nb3": "NB3 (7-8)",
    "nm1": "NM1 (1-2 Media)",
    "nm2": "NM2 (3-4 Media)",
    "nm2i": "NM2 Intensivo"
  };

  const levelName = levels[levelCode] || levelCode;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#0A192F]">
      {/* Admin Sub-Header */}
      <header className="h-16 bg-[#0A192F] text-white flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver a Intranet
            </button>
          </Link>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-3">
            <Badge className="bg-[#A51C30] text-white rounded-none text-[8px] px-2 py-0.5">ADMIN CONFIG</Badge>
            <span className="text-xs font-serif italic text-white/80">{levelName} / {subjectLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Button className="bg-white/10 hover:bg-white/20 text-white rounded-none text-[9px] font-bold uppercase tracking-widest px-6 h-9">Vista Previa Alumno</Button>
           <Button className="bg-[#A51C30] hover:bg-[#821626] text-white rounded-none text-[9px] font-bold uppercase tracking-widest px-6 h-9">Publicar Cambios</Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Main Configuration Title */}
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-bold text-[#0A192F]">{subjectLabel}</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Panel de Configuración de Objetivos y Recursos Barkley</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Learning Path Config */}
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white border border-slate-200 p-8 rounded-none space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#A51C30]" /> Objetivos de Aprendizaje (OA)
                  </h3>
                  <Button variant="outline" className="h-8 text-[9px] font-bold uppercase tracking-widest rounded-none border-slate-200">
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Agregar OA
                  </Button>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="group border border-slate-100 p-6 hover:border-[#A51C30]/20 transition-all bg-slate-50/30">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-[#0A192F] text-white rounded-none text-[9px] px-2 py-0.5">OA {num}</Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semana {num * 2 - 1} - {num * 2}</span>
                          </div>
                          <h4 className="text-lg font-serif font-bold italic group-hover:text-[#A51C30] transition-colors">Configuración de Título para OA {num}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-xl">
                            Descripción del objetivo de aprendizaje que verá el estudiante. Configure aquí el propósito pedagógico.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-[#0A192F]"><Settings className="w-4 h-4" /></Button>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Video Clase Principal</p>
                          <div className="flex items-center gap-3 p-3 bg-white border border-dashed border-slate-200 group-hover:border-[#A51C30]/30 transition-all cursor-pointer">
                            <Video className="w-4 h-4 text-[#A51C30]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Seleccionar Video</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Documentos Anexos</p>
                          <div className="flex items-center gap-3 p-3 bg-white border border-dashed border-slate-200 group-hover:border-[#A51C30]/30 transition-all cursor-pointer">
                            <FileUp className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Cargar PDF/Guía</span>
                          </div>
                        </div>
                      </div>

                      {/* NotebookLM Integration Section */}
                      <div className="mt-4 pt-4 border-t border-slate-50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Integración NotebookLM / Compartibles</p>
                            <Badge variant="outline" className="text-[8px] font-bold border-[#A51C30]/20 text-[#A51C30]">Privacidad Protegida</Badge>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-[#A51C30]/5 border border-dashed border-[#A51C30]/20 hover:bg-[#A51C30]/10 transition-all cursor-pointer">
                            <Share2 className="w-4 h-4 text-[#A51C30]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A51C30]">Insertar Enlace de NotebookLM (Cuestionarios/Notas)</span>
                          </div>
                          <div className="flex items-start gap-2">
                             <Lock className="w-3 h-3 text-slate-300 mt-0.5" />
                             <p className="text-[8px] text-slate-400 italic leading-relaxed">
                                Al usar la opción "Compartir" de NotebookLM, el contenido se vuelve accesible mediante el enlace sin vincular tu cuenta personal de Google. Los alumnos verán solo el material compartido.
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Global Settings */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="p-8 bg-white border border-slate-200 rounded-none space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-slate-100 pb-4">Info. de Asignatura</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nivel Académico</p>
                    <p className="text-sm font-serif font-bold italic">{levelName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nombre del Curso</p>
                    <p className="text-sm font-serif font-bold italic">{subjectLabel}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-400 uppercase tracking-widest">Cadencia Barkley</span>
                       <span className="text-[#A51C30]">2.67 Sem/OA</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-[#0A192F] text-white border-none rounded-none space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Brain className="w-20 h-20" /></div>
                <div className="relative z-10 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#A51C30]">Seguridad de Datos</h4>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "Al integrar recursos externos vía URL de compartición, se garantiza que los estudiantes no tengan acceso a sus archivos personales o configuración de cuenta."
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
