import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { 
  ArrowLeft, 
  Brain, 
  Video, 
  ChevronRight,
  ChevronLeft,
  BookOpen, 
  Headphones,
  Map,
  Presentation,
  Loader2,
  FileText,
  Calendar,
  ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { TextbookViewer } from "@/components/TextbookViewer";

export default function CoursePlayer() {
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id || "";
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const parts = courseId.split("-");
  const levelCode = parts[0];
  const subjectLabel = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

  const [currentModule, setCurrentModule] = useState(1);
  const [selectedResource, setSelectedResource] = useState<null | { 
    title: string, 
    embedUrl: string, 
    embedType: "video" | "audio" | "infografia" | "presentacion",
    id: string
  }>(null);

  const levels: Record<string, string> = {
    "7b": "7° Básico", "8b": "8° Básico", "1m": "1° Medio", "2m": "2° Medio",
    "3m": "3° Medio", "4m": "4° Medio", "nb1": "NB1 (1-4)", "nb2": "NB2 (5-6)",
    "nb3": "NB3 (7-8)", "nm1": "NM1 (1-2 Media)", "nm2": "NM2 (3-4 Media)", "nm2i": "NM2 Intensivo"
  };

  const levelName = levels[levelCode] || levelCode;

  const { data: textbookData } = useQuery<{
    textbookPdfUrl: string | null;
    textbookTitle: string | null;
    modulePages: { startPage: number | null; endPage: number | null } | null;
  }>({
    queryKey: ['/api/level-subjects', courseId, 'textbook', currentModule],
    queryFn: async () => {
      const res = await fetch(`/api/level-subjects/${courseId}/textbook?moduleNumber=${currentModule}`, {
        credentials: 'include'
      });
      if (!res.ok) return { textbookPdfUrl: null, textbookTitle: null, modulePages: null };
      return res.json();
    },
    enabled: !!courseId && isAuthenticated
  });

  const { data: calendarData } = useQuery<{
    modules: Array<{
      moduleNumber: number;
      startDate: string;
      endDate: string;
      status: string;
      startFormatted: string;
      endFormatted: string;
    }>;
  }>({
    queryKey: ['/api/level-subjects', courseId, 'calendar'],
    queryFn: async () => {
      const res = await fetch(`/api/level-subjects/${courseId}/calendar`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch calendar');
      return res.json();
    },
    enabled: !!courseId && isAuthenticated
  });

  const currentModuleData = calendarData?.modules?.find(m => m.moduleNumber === currentModule);

  const resources = [
    { id: "video", title: "Video", icon: Video, color: "bg-red-500", embedUrl: "" },
    { id: "infografia", title: "Infografía", icon: Map, color: "bg-blue-500", embedUrl: "" },
    { id: "presentacion", title: "Presentación", icon: Presentation, color: "bg-emerald-500", embedUrl: "" },
    { id: "audio", title: "Audio", icon: Headphones, color: "bg-orange-500", embedUrl: "" },
  ];

  const getEvaluationDates = (moduleStartDate: string) => {
    const start = new Date(moduleStartDate);
    const evaluations = [];
    
    for (let week = 0; week < 2; week++) {
      const wednesday = new Date(start);
      wednesday.setDate(start.getDate() + (week * 7) + (3 - start.getDay() + 7) % 7);
      if (wednesday < start) wednesday.setDate(wednesday.getDate() + 7);
      
      const friday = new Date(wednesday);
      friday.setDate(wednesday.getDate() + 2);
      
      evaluations.push({
        number: week * 2 + 1,
        title: `Evaluación Formativa ${week * 2 + 1}`,
        date: wednesday,
        dayName: "Miércoles"
      });
      evaluations.push({
        number: week * 2 + 2,
        title: `Evaluación Formativa ${week * 2 + 2}`,
        date: friday,
        dayName: "Viernes"
      });
    }
    
    return evaluations;
  };

  const evaluations = currentModuleData ? getEvaluationDates(currentModuleData.startDate) : [];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acceso Requerido",
        description: "Ingresa con tu cuenta para acceder al curso...",
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
          <p className="text-[#0A192F] font-serif italic">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleResourceClick = (res: typeof resources[0]) => {
    setSelectedResource({ 
      title: res.title, 
      embedUrl: res.embedUrl || "", 
      embedType: res.id as "video" | "audio" | "infografia" | "presentacion", 
      id: res.id
    });
  };
  
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return "";
    if (url.includes("drive.google.com/file/d/")) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    if (url.includes("docs.google.com/presentation")) {
      return url.replace("/edit", "/embed").replace("/pub", "/embed");
    }
    return url;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#0A192F]">
      <header className="h-16 bg-[#0A192F] text-white flex items-center justify-between px-8 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors" data-testid="back-button">
              <ArrowLeft className="w-4 h-4" /> Volver a Intranet
            </button>
          </Link>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-serif italic text-white/80">{levelName} / {subjectLabel}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Título del curso */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#0A192F]">{subjectLabel}</h1>
            <p className="text-[#A51C30] text-xs font-bold uppercase tracking-[0.3em]">{levelName}</p>
          </div>

          {/* SELECTOR DE MÓDULOS (1-15) - ARRIBA */}
          <div className="bg-white border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#A51C30]" />
                Seleccionar Módulo
              </h3>
              <Badge className="bg-[#0A192F] text-white rounded-none text-[9px]">
                15 Módulos • 2 semanas c/u
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentModule(num)}
                  className={cn(
                    "w-10 h-10 text-sm font-bold transition-all border",
                    currentModule === num
                      ? "bg-[#A51C30] text-white border-[#A51C30]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#A51C30] hover:text-[#A51C30]"
                  )}
                  data-testid={`module-selector-${num}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* CUADRO DEL MÓDULO ACTUAL */}
          <Card className="bg-white shadow-lg border-none overflow-hidden">
            <div className="h-2 bg-[#A51C30]" />
            <div className="p-8 text-center space-y-4">
              <Badge className="bg-[#F8F9FA] text-[#0A192F] border-slate-200 rounded-none px-6 py-2 text-xs font-bold tracking-[0.3em] uppercase">
                Módulo {currentModule}
              </Badge>
              
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#0A192F]">
                Contenidos del Módulo {currentModule}
              </h2>
              
              {currentModuleData && (
                <p className="text-sm text-slate-500">
                  {currentModuleData.startFormatted} — {currentModuleData.endFormatted}
                </p>
              )}
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-none"
                  onClick={() => setCurrentModule(Math.max(1, currentModule - 1))}
                  disabled={currentModule === 1}
                  data-testid="prev-module"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-none"
                  onClick={() => setCurrentModule(Math.min(15, currentModule + 1))}
                  disabled={currentModule === 15}
                  data-testid="next-module"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>

          {/* VISOR DEL LIBRO PDF */}
          {textbookData?.textbookPdfUrl && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#A51C30]" />
                <h3 className="text-lg font-bold text-[#0A192F]">Texto Escolar</h3>
              </div>
              <TextbookViewer
                pdfUrl={textbookData.textbookPdfUrl}
                title={textbookData.textbookTitle || undefined}
                startPage={textbookData.modulePages?.startPage ?? 0}
                endPage={textbookData.modulePages?.endPage ?? 0}
                moduleNumber={currentModule}
              />
            </div>
          )}

          {/* EVALUACIONES FORMATIVAS (4 por módulo) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck className="w-5 h-5 text-[#A51C30]" />
              <h3 className="text-lg font-bold text-[#0A192F]">Evaluaciones Formativas</h3>
              <Badge className="bg-slate-100 text-slate-600 rounded-none text-[9px] ml-2">
                4 evaluaciones por módulo
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {evaluations.map((evaluation, index) => (
                <Card 
                  key={index} 
                  className="p-4 bg-white border border-slate-200 hover:border-[#A51C30] hover:shadow-md transition-all cursor-pointer"
                  data-testid={`evaluation-${evaluation.number}`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-[#A51C30]/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#A51C30]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0A192F]">{evaluation.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                        {evaluation.dayName} {formatDate(evaluation.date)}
                      </p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 rounded-none text-[8px]">
                      Próximamente
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center italic">
              Las evaluaciones serán generadas por Gemini. Podrás pegar el código HTML aquí.
            </p>
          </div>

          {/* 4 RECURSOS DIDÁCTICOS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-[#A51C30]" />
              <h3 className="text-lg font-bold text-[#0A192F]">Recursos Didácticos</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {resources.map((res) => (
                <button 
                  key={res.id}
                  onClick={() => handleResourceClick(res)}
                  className="p-6 bg-white border border-slate-200 hover:border-[#A51C30] hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
                  data-testid={`resource-${res.id}`}
                >
                  <div className={cn(
                    "w-16 h-16 flex items-center justify-center text-white",
                    res.color
                  )}>
                    <res.icon className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-bold text-[#0A192F] group-hover:text-[#A51C30] transition-colors">
                    {res.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Resource Modal */}
      <Dialog open={selectedResource !== null} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-5xl h-[80vh] p-0 rounded-none border-none bg-white">
          <DialogHeader className="p-6 border-b border-slate-100 shrink-0 bg-[#F8F9FA]">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-serif font-bold text-[#0A192F]">{selectedResource?.title}</DialogTitle>
              <Badge className="bg-[#A51C30] text-white border-none rounded-none px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase">
                Módulo {currentModule}
              </Badge>
            </div>
          </DialogHeader>
          <div className="flex-1 w-full h-full min-h-0 bg-slate-50 relative overflow-hidden">
            {selectedResource?.embedUrl ? (
              <iframe 
                src={convertToEmbedUrl(selectedResource.embedUrl)}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                title={selectedResource.title}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-200 flex items-center justify-center">
                  {selectedResource?.embedType === "video" && <Video className="w-10 h-10 text-slate-400" />}
                  {selectedResource?.embedType === "audio" && <Headphones className="w-10 h-10 text-slate-400" />}
                  {selectedResource?.embedType === "presentacion" && <Presentation className="w-10 h-10 text-slate-400" />}
                  {selectedResource?.embedType === "infografia" && <Map className="w-10 h-10 text-slate-400" />}
                </div>
                
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-bold text-[#0A192F]">Recurso Pendiente</h3>
                  <p className="text-sm text-slate-500">
                    Este recurso aún no ha sido configurado. El administrador debe agregar el enlace correspondiente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
