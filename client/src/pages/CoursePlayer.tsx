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
  Activity,
  Layers,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function CoursePlayer() {
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id || "";
  
  const parts = courseId.split("-");
  const levelCode = parts[0];
  const subjectLabel = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

  const levels: Record<string, string> = {
    "7b": "7° Básico", "8b": "8° Básico", "1m": "1° Medio", "2m": "2° Medio",
    "3m": "3° Medio", "4m": "4° Medio", "nb1": "NB1 (1-4)", "nb2": "NB2 (5-6)",
    "nb3": "NB3 (7-8)", "nm1": "NM1 (1-2 Media)", "nm2": "NM2 (3-4 Media)", "nm2i": "NM2 Intensivo"
  };

  const levelName = levels[levelCode] || levelCode;

  const steps = [
    { id: 1, type: "video", title: "Video: Tu Impulso Inicial", icon: Video, color: "text-red-500", fundamental: "Activación Atencional (Barkley)", help: "Te permite entrar en sintonía visual rápida sin agobiarte.", objective: "Reducir la resistencia de funciones ejecutivas mediante dopamina y foco." },
    { id: 2, type: "infografia", title: "Infografía: Tu Mapa de Ruta", icon: Map, color: "text-blue-500", fundamental: "Andamiaje Externo (Barkley)", help: "Te da una estructura visual clara, es tu brújula.", objective: "Memoria de trabajo externa, liberando espacio mental para procesar." },
    { id: 3, type: "mapa", title: "Mapa Mental: Conectando Ideas", icon: Brain, color: "text-purple-500", fundamental: "Pensamiento Visible (Harvard)", help: "Ayuda a organizar pensamientos y ver el sentido de la red.", objective: "Externalizar razonamiento para aprendizaje profundo y consciente." },
    { id: 4, type: "audio", title: "Resumen de Audio: Repaso en Movimiento", icon: Headphones, color: "text-orange-500", fundamental: "Protección del Canal Atencional (Barkley)", help: "Refuerza sin cansar, ideal para pausas activas.", objective: "Variar estímulo sensorial para prevenir fatiga y fortalecer retención." },
    { id: 5, type: "presentacion", title: "Presentación: Paso a Paso", icon: Presentation, color: "text-emerald-500", fundamental: "Autocontrol y Autonomía (Barkley)", help: "Explica detalles técnicos a tu propio ritmo.", objective: "Fomentar autodirección ajustando flujo a tu velocidad de procesamiento." },
    { id: 6, type: "flashcards", title: "Tarjetas (Flashcards): Desafía tu Memoria", icon: Layers, color: "text-amber-500", fundamental: "Feedback Inmediato (Barkley)", help: "Aprende de errores rápidos con respuesta inmediata.", objective: "Combatir miopía temporal mediante recompensas de logro instantáneas." },
    { id: 7, type: "informe", title: "El Informe: Tu Voz Experta", icon: PenTool, color: "text-indigo-500", fundamental: "Síntesis y Comprensión (Harvard)", help: "Escribe lo comprendido para darte cuenta de lo que realmente sabes.", objective: "Transformar información en conocimiento propio con postura crítica." },
    { id: 8, type: "cuestionario", title: "El Cuestionario: Valida tu Éxito", icon: Award, color: "text-[#A51C30]", fundamental: "Sentido de Autoeficacia (Barkley)", help: "Prueba final semanal para celebrar tus resultados.", objective: "Cerrar ciclo de función ejecutiva con validación objetiva del logro." },
    { id: 9, type: "resumen", title: "Resumen Escrito: Reflexión Final", icon: StickyNote, color: "text-slate-500", fundamental: "Metacognición (Harvard)", help: "Piensa cómo cambió tu visión del tema desde el lunes.", objective: "Consolidar aprendizaje profundo mediante rutina 'Antes pensaba... ahora pienso...'." }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#0A192F]">
      <header className="h-16 bg-[#0A192F] text-white flex items-center justify-between px-8 shrink-0 border-b border-white/5">
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif font-bold text-[#0A192F]">{subjectLabel}</h1>
              <p className="text-[#A51C30] text-xs font-bold uppercase tracking-[0.3em]">Arquitectura Secuencial Barkley-Harvard</p>
            </div>
            <Card className="p-4 bg-[#0A192F] text-white rounded-none border-none flex items-center gap-4 shadow-xl">
               <Brain className="w-8 h-8 text-[#A51C30]" />
               <div>
                 <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Fundamento del Modelo</p>
                 <p className="text-[10px] font-serif italic font-bold">"Ruta Crítica: El alumno debe completar todos los recursos para activar la Evaluación Semanal."</p>
               </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-6 relative">
                {/* Visual Connector Line */}
                <div className="absolute left-10 top-10 bottom-10 w-px bg-slate-200 z-0"></div>

                {steps.map((step, idx) => (
                  <div key={step.id} className="relative z-10">
                    <Card className="border border-slate-200 rounded-none overflow-hidden hover:border-[#A51C30]/40 transition-all duration-500 group">
                      <div className="flex flex-col md:flex-row">
                        <div className={cn("md:w-20 shrink-0 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 transition-colors group-hover:bg-slate-50", step.id === 8 && "bg-[#A51C30]/5")}>
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-slate-300 group-hover:text-[#A51C30]">{step.id}</span>
                            <step.icon className={cn("w-6 h-6", step.color)} />
                          </div>
                        </div>
                        
                        <div className="flex-1 p-8 space-y-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="text-xl font-serif font-bold text-[#0A192F]">{step.title}</h3>
                              <Badge variant="outline" className="bg-slate-50 border-slate-200 text-[#A51C30] text-[9px] font-bold tracking-widest uppercase rounded-none px-3 py-1">
                                {step.fundamental}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                               <Button size="sm" variant="outline" className="rounded-none border-slate-200 text-[9px] font-bold uppercase tracking-widest h-8 px-4">
                                 <Share2 className="w-3.5 h-3.5 mr-2" /> Enlazar NotebookLM
                               </Button>
                               <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-[#0A192F]"><Settings className="w-4 h-4" /></Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-6 border border-slate-100">
                             <div className="space-y-2">
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <MessageSquare className="w-3 h-3 text-[#A51C30]" /> Voz al Alumno
                               </p>
                               <p className="text-xs text-[#0A192F] font-serif italic leading-relaxed">"{step.help}"</p>
                             </div>
                             <div className="space-y-2">
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Target className="w-3 h-3 text-blue-500" /> Objetivo Pedagógico
                               </p>
                               <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{step.objective}</p>
                             </div>
                          </div>

                          {step.id === 8 && (
                            <div className="bg-[#A51C30] text-white p-6 flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                 <Lock className="w-5 h-5 opacity-50" />
                                 <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Bloqueo Secuencial Activo: Viernes de Evaluación</p>
                               </div>
                               <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[8px]">Hito de Cierre</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="p-8 bg-white border border-slate-200 rounded-none sticky top-12 shadow-sm">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-[#A51C30] border-b border-slate-100 pb-4">Base del Modelo</h3>
                    <p className="text-[11px] text-[#0A192F] leading-relaxed font-serif italic font-bold bg-slate-50 p-6 border-l-4 border-[#A51C30]">
                      "La arquitectura Barkley-Harvard busca externalizar la memoria de trabajo y proporcionar feedback inmediato. La secuencia no es sugerida, es MANDATORIA para el éxito cognitivo."
                    </p>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estado de Configuración</p>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500 uppercase">Recursos Enlazados</span>
                          <span className="text-[#0A192F]">0 / 9</span>
                       </div>
                       <Progress value={0} className="h-1 rounded-none bg-slate-100" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <Button className="w-full bg-[#0A192F] hover:bg-black text-white rounded-none h-14 text-[10px] font-bold uppercase tracking-[0.4em]">Guardar Estructura</Button>
                    <p className="text-[8px] text-center text-slate-400 mt-4 uppercase tracking-widest">Sincronización segura con NotebookLM</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
