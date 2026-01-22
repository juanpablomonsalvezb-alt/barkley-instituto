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
  ChevronLeft,
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
  Award,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CoursePlayer() {
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id || "";
  
  const parts = courseId.split("-");
  const levelCode = parts[0];
  const subjectLabel = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedResource, setSelectedResource] = useState<null | { title: string, url: string }>(null);

  const levels: Record<string, string> = {
    "7b": "7° Básico", "8b": "8° Básico", "1m": "1° Medio", "2m": "2° Medio",
    "3m": "3° Medio", "4m": "4° Medio", "nb1": "NB1 (1-4)", "nb2": "NB2 (5-6)",
    "nb3": "NB3 (7-8)", "nm1": "NM1 (1-2 Media)", "nm2": "NM2 (3-4 Media)", "nm2i": "NM2 Intensivo"
  };

  const levelName = levels[levelCode] || levelCode;

  const resources = [
    { id: "video", title: "Video: Tu Impulso Inicial", icon: Video, color: "text-red-500", url: "https://notebooklm.google.com/notebook/362d1175-d595-406c-922e-debef3cdf103?artifactId=2b533b66-1972-4f6c-bf79-2475461437f4", fundamental: "Activación Atencional (Barkley)", help: "Míralo para captar la esencia del tema sin esfuerzo.", objective: "Activación Atencional: Reducir resistencia de funciones ejecutivas." },
    { id: "infografia", title: "La Infografía: Tu Mapa de Ruta", icon: Map, color: "text-blue-500", url: "https://notebooklm.google.com/notebook/362d1175-d595-406c-922e-debef3cdf103?artifactId=871937ff-1809-4637-a701-a5d404c47b71", fundamental: "Andamiaje Externo (Barkley)", help: "Observa cómo se organiza todo lo que viste en el video.", objective: "Memoria de Trabajo Externa: Liberar espacio mental." },
    { id: "audio", title: "Resumen de Audio: Repaso en Movimiento", icon: Headphones, color: "text-orange-500", url: "https://notebooklm.google.com/notebook/362d1175-d595-406c-922e-debef3cdf103?artifactId=cff1485a-2441-49d0-aaa4-9bccd87e8429", fundamental: "Protección Canal Atencional (Barkley)", help: "Deja que la información entre por tus oídos y descansa la vista.", objective: "Variación Sensorial: Prevenir fatiga cognitiva." },
    { id: "presentacion", title: "La Presentación: Paso a Paso", icon: Presentation, color: "text-emerald-500", url: "https://notebooklm.google.com/notebook/362d1175-d595-406c-922e-debef3cdf103?artifactId=7ca2abfb-f2ae-4ff3-bdf1-a502e81bfeeb", fundamental: "Autocontrol y Autonomía (Barkley)", help: "Avanza a tu propio ritmo por estas láminas.", objective: "Autodirección: Ajustar flujo a velocidad de procesamiento." },
    { id: "flashcards", title: "Tarjetas Didácticas: Desafía tu Memoria", icon: Layers, color: "text-amber-500", url: "https://notebooklm.google.com/notebook/362d1175-d595-406c-922e-debef3cdf103?artifactId=5044c5b9-31af-4043-9e6a-73f8c529fe59", fundamental: "Feedback Inmediato (Barkley)", help: "Pon a prueba lo que recuerdas. El cerebro aprende del error.", objective: "Refuerzo Inmediato: Combatir miopía temporal." },
    { id: "cuestionario", title: "El Cuestionario: Valida tu Éxito", icon: Award, color: "text-[#A51C30]", url: "https://notebooklm.google.com/notebook/362d1175-d595-406c-922e-debef3cdf103?artifactId=9ee506a5-f8c9-4b44-a33c-379056472528", fundamental: "Sentido de Autoeficacia (Barkley)", help: "Demuéstrate cuánto has avanzado y celebra tus resultados.", objective: "Cierre de Ciclo: Validación objetiva del logro." },
    { id: "resumen", title: "Resumen Escrito: Reflexión Final", icon: PenTool, color: "text-indigo-500", url: "", fundamental: "Metacognición (Harvard)", help: "¿Cómo ha cambiado tu forma de ver este tema desde el lunes?", objective: "Aprendizaje Profundo: Consolidación mediante reflexión." }
  ];

  const [viewedResources, setViewedResources] = useState<Set<string>>(new Set());
  const [examCompleted, setExamCompleted] = useState(false);

  const handleResourceClick = (res: any) => {
    if (res.id !== "cuestionario" || viewedResources.size >= resources.length - 2) {
      if (res.url) {
        // Abrir en una nueva pestaña para evitar restricciones de seguridad de Google (iframes)
        window.open(res.url, "_blank", "noopener,noreferrer");
        setViewedResources(prev => new Set(prev).add(res.id));
      } else if (res.id === "resumen") {
         setViewedResources(prev => new Set(prev).add(res.id));
      }
    }
  };

  const isExamUnlocked = viewedResources.size >= resources.length - 2; // All except questionnaire and resume


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
           <Button className="bg-[#A51C30] hover:bg-[#821626] text-white rounded-none text-[9px] font-bold uppercase tracking-widest px-6 h-9">Publicar Cambios</Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Titulo y Fundamento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-4xl font-serif font-bold text-[#0A192F]">{subjectLabel}</h1>
              <p className="text-[#A51C30] text-xs font-bold uppercase tracking-[0.3em]">Arquitectura Secuencial Barkley-Harvard</p>
              <div className="bg-white border-l-4 border-[#A51C30] p-6 shadow-sm">
                <p className="text-sm font-serif italic font-bold text-[#0A192F]">
                  "Base del Modelo: La ruta es mandatoria. El alumno debe agotar todos los recursos para activar la evaluación semanal. Solo la aprobación permite avanzar a la siguiente semana."
                </p>
              </div>
            </div>
            <div className="lg:col-span-4">
              <Card className="p-6 bg-[#0A192F] text-white rounded-none border-none shadow-xl">
                <div className="flex items-center gap-4">
                  <Brain className="w-8 h-8 text-[#A51C30]" />
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Externalización de Memoria de Trabajo y Feedback Inmediato</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Carrusel Semanal */}
          <div className="relative pt-10 pb-20">
            <div className="flex items-center justify-center gap-8 mb-12">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-slate-200 text-slate-400 hover:text-[#A51C30]"
                onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              
              <div className="bg-white shadow-2xl p-12 w-full max-w-4xl border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#A51C30]" />
                
                <div className="flex flex-col items-center text-center space-y-8">
                  <Badge className="bg-[#F8F9FA] text-[#0A192F] border-slate-200 rounded-none px-6 py-2 text-[10px] font-bold tracking-[0.4em] uppercase">Semana {currentWeek}</Badge>
                  
                  <div className="space-y-4 max-w-2xl">
                    <h2 className="text-3xl font-serif font-bold text-[#0A192F]">Narrativa y Comprensión Lectora</h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                      Foco: OA 3 (Analizar narraciones) y OA 7 (Interpretación). El conflicto narrativo e identificación de fuerzas en pugna.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 w-full pt-8">
                    {resources.map((res) => {
                      const isLocked = res.id === "cuestionario" && !isExamUnlocked;
                      return (
                        <button 
                          key={res.id}
                          onClick={() => handleResourceClick(res)}
                          disabled={isLocked}
                          className={cn(
                            "flex flex-col items-center gap-3 group/btn relative transition-opacity",
                            isLocked && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className={cn(
                            "w-14 h-14 rounded-none flex items-center justify-center border transition-all duration-300 relative",
                            res.id === "cuestionario" ? "bg-[#A51C30]/5 border-[#A51C30]/20" : "bg-white border-slate-100 hover:border-[#A51C30] hover:shadow-lg",
                            viewedResources.has(res.id) && "bg-green-50 border-green-200"
                          )}>
                            {viewedResources.has(res.id) && res.id !== "cuestionario" ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                              <res.icon className={cn("w-6 h-6", res.color)} />
                            )}
                            {isLocked && <Lock className="absolute -top-1 -right-1 w-3 h-3 text-[#A51C30]" />}
                          </div>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center leading-tight group-hover/btn:text-[#0A192F] transition-colors">{res.title.split(":")[0]}</span>
                          
                          {/* Tooltip con fundamento */}
                          <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-[#0A192F] text-white p-3 text-[9px] opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-50 rounded-none shadow-2xl">
                            <p className="font-bold text-[#A51C30] uppercase mb-1">{res.fundamental}</p>
                            <p className="italic opacity-80 leading-relaxed">"{res.help}"</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0A192F]" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-slate-200 text-slate-400 hover:text-[#A51C30]"
                onClick={() => {
                  if (examCompleted || currentWeek < 1) { // Logic for advancing week
                     setCurrentWeek(currentWeek + 1);
                  }
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Selector de semanas inferior */}
            <div className="flex justify-center gap-2 overflow-x-auto pb-4 px-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentWeek(i + 1)}
                  className={cn(
                    "min-w-[40px] h-10 border text-[10px] font-bold transition-all",
                    currentWeek === i + 1 
                    ? "bg-[#0A192F] border-[#0A192F] text-white shadow-lg scale-110" 
                    : "bg-white border-slate-100 text-slate-300 hover:text-[#0A192F] hover:border-slate-300"
                  )}
                >
                  S{i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Modal */}
      <Dialog open={selectedResource !== null} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 rounded-none border-none bg-white">
          <DialogHeader className="p-6 border-b border-slate-100 shrink-0 bg-[#F8F9FA]">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-serif font-bold text-[#0A192F] italic">{selectedResource?.title}</DialogTitle>
              <Badge className="bg-[#A51C30] text-white border-none rounded-none px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase">NotebookLM Integration</Badge>
            </div>
          </DialogHeader>
          <div className="flex-1 w-full h-full min-h-0 bg-slate-50 relative overflow-hidden">
            {selectedResource?.url ? (
              <iframe 
                src={selectedResource.url} 
                className="w-full h-full border-none"
                title={selectedResource.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <PenTool className="w-12 h-12 text-slate-200" />
                <p className="text-sm font-serif italic text-slate-400">Recurso de Reflexión en desarrollo...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
