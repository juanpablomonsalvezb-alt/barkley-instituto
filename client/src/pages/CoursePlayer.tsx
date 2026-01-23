import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  ClipboardCheck,
  Check,
  Lock,
  Upload
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
  DialogDescription,
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

  const [currentModule] = useState(1);
  const [currentEvaluation, setCurrentEvaluation] = useState(0);
  const [selectedResource, setSelectedResource] = useState<null | { 
    title: string, 
    embedUrl: string, 
    embedType: "video" | "audio" | "infografia" | "presentacion",
    id: string
  }>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<null | {
    number: number;
    title: string;
    htmlContent: string;
    objectiveId: string;
  }>(null);
  const [htmlInputValue, setHtmlInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingWord, setIsUploadingWord] = useState(false);
  const queryClient = useQueryClient();

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
  const currentObjectiveId = (currentModuleData as any)?.objective?.id || "";

  const { data: profileData } = useQuery<{ role: string }>({
    queryKey: ['/api/profile'],
    queryFn: async () => {
      const res = await fetch('/api/profile', { credentials: 'include' });
      if (!res.ok) return { role: 'student' };
      return res.json();
    },
    enabled: isAuthenticated
  });

  const isAdmin = profileData?.role === 'admin';

  const { data: moduleInfo } = useQuery<{ moduleOAs: string | null; moduleContents: string | null; moduleDateRange: string | null }>({
    queryKey: ['/api/objectives', currentObjectiveId, 'module-info'],
    queryFn: async () => {
      if (!currentObjectiveId) return { moduleOAs: null, moduleContents: null, moduleDateRange: null };
      const res = await fetch(`/api/objectives/${currentObjectiveId}/module-info`, { credentials: 'include' });
      if (!res.ok) return { moduleOAs: null, moduleContents: null, moduleDateRange: null };
      return res.json();
    },
    enabled: !!currentObjectiveId && isAuthenticated
  });

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
        dayName: "Miércoles",
        htmlContent: ""
      });
      evaluations.push({
        number: week * 2 + 2,
        title: `Evaluación Formativa ${week * 2 + 2}`,
        date: friday,
        dayName: "Viernes",
        htmlContent: ""
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

  const handleEvaluationClick = async (evaluation: typeof evaluations[0]) => {
    let htmlContent = evaluation.htmlContent;
    
    if (currentObjectiveId) {
      try {
        const res = await fetch(`/api/evaluations/${currentObjectiveId}/${evaluation.number}/html`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          htmlContent = data.htmlContent || "";
        }
      } catch (e) {
        console.error("Error fetching evaluation HTML:", e);
      }
    }
    
    setSelectedEvaluation({
      number: evaluation.number,
      title: evaluation.title,
      htmlContent,
      objectiveId: currentObjectiveId
    });
    setHtmlInputValue("");
  };

  const handleSaveEvaluationHtml = async () => {
    if (!selectedEvaluation || !htmlInputValue.trim() || !currentObjectiveId) {
      toast({
        title: "Error",
        description: "Debes ingresar el código HTML",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/evaluations/${currentObjectiveId}/${selectedEvaluation.number}/html`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ htmlContent: htmlInputValue })
      });
      
      if (!res.ok) throw new Error('Failed to save');
      
      toast({
        title: "Guardado",
        description: "El HTML de la evaluación ha sido guardado correctamente"
      });
      
      setSelectedEvaluation({
        ...selectedEvaluation,
        htmlContent: htmlInputValue
      });
      setHtmlInputValue("");
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el HTML",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleWordUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentObjectiveId) {
      toast({
        title: "Error",
        description: "Selecciona un archivo Word válido",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingWord(true);
    try {
      const formData = new FormData();
      formData.append('wordDoc', file);

      const res = await fetch(`/api/admin/objectives/${currentObjectiveId}/word-upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to upload');

      const data = await res.json();
      
      toast({
        title: "Documento procesado",
        description: "La información del módulo ha sido extraída y guardada"
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/objectives', currentObjectiveId, 'module-info'] });
      queryClient.invalidateQueries({ queryKey: ['/api/level-subjects', courseId, 'calendar'] });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el documento Word",
        variant: "destructive"
      });
    } finally {
      setIsUploadingWord(false);
      event.target.value = '';
    }
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

  const nextEvaluation = () => {
    setCurrentEvaluation((prev) => (prev + 1) % evaluations.length);
  };

  const prevEvaluation = () => {
    setCurrentEvaluation((prev) => (prev - 1 + evaluations.length) % evaluations.length);
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

          {/* INDICADOR DE PROGRESO - 15 MÓDULOS */}
          <div className="bg-white border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Progreso del Programa</span>
              <span className="text-xs text-slate-500">
                {calendarData?.modules?.filter(m => m.status === 'completed').length || 0} de 15 módulos completados
              </span>
            </div>
            <div className="flex justify-center gap-1 sm:gap-2">
              {Array.from({ length: 15 }, (_, i) => {
                const moduleNum = i + 1;
                const moduleData = calendarData?.modules?.find(m => m.moduleNumber === moduleNum);
                const isCompleted = moduleData?.status === 'completed';
                const isCurrent = moduleNum === currentModule;
                const isLocked = moduleData?.status === 'locked';
                
                return (
                  <div
                    key={moduleNum}
                    className={cn(
                      "w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all",
                      isCompleted && "bg-green-500 text-white",
                      isCurrent && !isCompleted && "bg-[#A51C30] text-white ring-2 ring-[#A51C30] ring-offset-2",
                      !isCompleted && !isCurrent && "bg-slate-200 text-slate-400"
                    )}
                    title={`Módulo ${moduleNum}${isCompleted ? ' - Completado' : isCurrent ? ' - En curso' : isLocked ? ' - Bloqueado' : ''}`}
                    data-testid={`progress-module-${moduleNum}`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      moduleNum
                    )}
                  </div>
                );
              })}
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
                  {moduleInfo?.moduleDateRange || `${currentModuleData.startFormatted} — ${currentModuleData.endFormatted}`}
                </p>
              )}
              
              {moduleInfo?.moduleOAs && (
                <div className="text-left bg-slate-50 p-4 mt-4 border border-slate-200">
                  <h4 className="text-xs font-bold text-[#A51C30] uppercase tracking-wider mb-2">Objetivos de Aprendizaje</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-line">{moduleInfo.moduleOAs}</p>
                </div>
              )}
              
              {moduleInfo?.moduleContents && (
                <div className="text-left bg-slate-50 p-4 mt-2 border border-slate-200">
                  <h4 className="text-xs font-bold text-[#A51C30] uppercase tracking-wider mb-2">Contenidos</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-line">{moduleInfo.moduleContents}</p>
                </div>
              )}
              
              {isAdmin && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <label 
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer transition-colors text-sm"
                    data-testid="word-upload-button"
                  >
                    {isUploadingWord ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Subir documento Word
                      </>
                    )}
                    <input
                      type="file"
                      accept=".docx,.doc"
                      onChange={handleWordUpload}
                      disabled={isUploadingWord}
                      className="hidden"
                      data-testid="word-upload-input"
                    />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">
                    Sube un documento Word con: número de módulo, fechas, OAs y contenidos
                  </p>
                </div>
              )}
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

          {/* EVALUACIONES FORMATIVAS EN CARRUSEL */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck className="w-5 h-5 text-[#A51C30]" />
              <h3 className="text-lg font-bold text-[#0A192F]">Evaluaciones Formativas</h3>
              <Badge className="bg-slate-100 text-slate-600 rounded-none text-[9px] ml-2">
                4 evaluaciones por módulo
              </Badge>
            </div>
            
            {/* Carrusel de evaluaciones */}
            <div className="bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-none shrink-0"
                  onClick={prevEvaluation}
                  data-testid="prev-evaluation"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="flex-1 mx-4">
                  {evaluations.length > 0 && (
                    <div 
                      className="text-center cursor-pointer hover:bg-slate-50 p-4 transition-colors"
                      onClick={() => handleEvaluationClick(evaluations[currentEvaluation])}
                      data-testid={`evaluation-carousel-${evaluations[currentEvaluation]?.number}`}
                    >
                      <div className="w-14 h-14 bg-[#A51C30]/10 flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-7 h-7 text-[#A51C30]" />
                      </div>
                      <p className="text-lg font-bold text-[#0A192F]">
                        {evaluations[currentEvaluation]?.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {evaluations[currentEvaluation]?.dayName} {formatDate(evaluations[currentEvaluation]?.date)}
                      </p>
                      <Badge className="bg-amber-100 text-amber-700 rounded-none text-[8px] mt-3">
                        Clic para abrir
                      </Badge>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="rounded-none shrink-0"
                  onClick={nextEvaluation}
                  data-testid="next-evaluation"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Indicadores del carrusel */}
              <div className="flex justify-center gap-2 mt-4">
                {evaluations.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentEvaluation(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === currentEvaluation ? "bg-[#A51C30]" : "bg-slate-300"
                    )}
                    data-testid={`evaluation-dot-${idx}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Resource Modal */}
      <Dialog open={selectedResource !== null} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-5xl h-[80vh] p-0 rounded-none border-none bg-white">
          <DialogHeader className="p-6 border-b border-slate-100 shrink-0 bg-[#F8F9FA]">
            <DialogTitle className="text-xl font-serif font-bold text-[#0A192F]">{selectedResource?.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Recurso didáctico del módulo {currentModule}
            </DialogDescription>
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

      {/* Evaluation Modal with HTML content */}
      <Dialog open={selectedEvaluation !== null} onOpenChange={() => setSelectedEvaluation(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 rounded-none border-none bg-white overflow-hidden">
          <DialogHeader className="p-6 border-b border-slate-100 shrink-0 bg-[#F8F9FA]">
            <DialogTitle className="text-xl font-serif font-bold text-[#0A192F]">
              {selectedEvaluation?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Módulo {currentModule} • Evaluación formativa generada por Gemini
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {selectedEvaluation?.htmlContent ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedEvaluation.htmlContent }}
              />
            ) : (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-[#A51C30]/10 flex items-center justify-center mx-auto">
                  <FileText className="w-10 h-10 text-[#A51C30]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#0A192F]">Evaluación Pendiente</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Esta evaluación aún no tiene contenido. El administrador debe pegar el código HTML generado por Gemini.
                  </p>
                </div>
                
                {isAdmin && (
                  <div className="bg-slate-50 border border-slate-200 p-6 max-w-lg mx-auto text-left">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Pegar código HTML de Gemini aquí:
                    </label>
                    <textarea 
                      className="w-full h-32 border border-slate-300 p-3 text-sm font-mono resize-none focus:outline-none focus:border-[#A51C30]"
                      placeholder="<div>...</div>"
                      value={htmlInputValue}
                      onChange={(e) => setHtmlInputValue(e.target.value)}
                      data-testid="evaluation-html-input"
                    />
                    <Button 
                      className="mt-3 bg-[#A51C30] hover:bg-[#821626] text-white rounded-none text-xs"
                      onClick={handleSaveEvaluationHtml}
                      disabled={isSaving || !htmlInputValue.trim()}
                      data-testid="save-evaluation-html"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar Evaluación"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
