import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Loader2,
  Check,
  AlertCircle,
  FileText,
  ExternalLink
} from "lucide-react";

interface Level {
  id: string;
  name: string;
  programType: string;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface LevelSubjectWithSubject {
  id: string;
  levelId: string;
  subjectId: string;
  subject: Subject;
}

interface LearningObjective {
  id: string;
  levelSubjectId: string;
  weekNumber: number;
  title: string;
  textbookStartPage: number | null;
  textbookEndPage: number | null;
}

export default function TextbookConfig() {
  const { toast } = useToast();
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { isAdmin, isLoading: isProfileLoading } = useProfile();
  const [, setLocation] = useLocation();
  const [selectedLevelId, setSelectedLevelId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [modulePages, setModulePages] = useState<Record<number, { startPage: string; endPage: string }>>({});

  /* Auth checks disabled for dev
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast({
        title: "Acceso Requerido",
        description: "Ingresa con tu cuenta para acceder a esta página",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthLoading, isAuthenticated, toast]);

  useEffect(() => {
    if (!isProfileLoading && isAuthenticated && !isAdmin) {
      toast({
        title: "Acceso Denegado",
        description: "Solo administradores pueden acceder a esta página",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [isProfileLoading, isAuthenticated, isAdmin, toast, setLocation]);
  */

  const { data: levels } = useQuery<Level[]>({
    queryKey: ['/api/levels'],
    queryFn: async () => {
      const res = await fetch('/api/levels', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch levels');
      return res.json();
    }
  });

  const { data: levelSubjectsData } = useQuery<LevelSubjectWithSubject[]>({
    queryKey: ['/api/levels', selectedLevelId, 'subjects'],
    queryFn: async () => {
      const res = await fetch(`/api/levels/${selectedLevelId}/subjects`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch subjects');
      return res.json();
    },
    enabled: !!selectedLevelId
  });

  const subjects = levelSubjectsData?.map(ls => ls.subject);

  const selectedLevel = levels?.find(l => l.id === selectedLevelId);
  const selectedSubject = subjects?.find(s => s.id === selectedSubjectId);
  const levelSubjectId = levelSubjectsData?.find(ls => 
    ls.levelId === selectedLevelId && ls.subjectId === selectedSubjectId
  )?.id || null;

  const { data: textbookData, isLoading: isLoadingTextbook } = useQuery<{
    textbookPdfUrl: string | null;
    textbookTitle: string | null;
    modulePages: { startPage: number | null; endPage: number | null } | null;
  }>({
    queryKey: ['/api/level-subjects', levelSubjectId, 'textbook'],
    queryFn: async () => {
      const res = await fetch(`/api/level-subjects/${levelSubjectId}/textbook`, { credentials: 'include' });
      if (!res.ok) return { textbookPdfUrl: null, textbookTitle: null, modulePages: null };
      return res.json();
    },
    enabled: !!levelSubjectId
  });

  const { data: objectives, isLoading: isLoadingObjectives } = useQuery<LearningObjective[]>({
    queryKey: ['/api/level-subjects', levelSubjectId, 'objectives'],
    queryFn: async () => {
      const res = await fetch(`/api/level-subjects/${levelSubjectId}/objectives`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch objectives');
      return res.json();
    },
    enabled: !!levelSubjectId
  });

  useEffect(() => {
    if (textbookData) {
      setPdfUrl(textbookData.textbookPdfUrl || "");
      setPdfTitle(textbookData.textbookTitle || "");
    }
  }, [textbookData]);

  useEffect(() => {
    if (objectives) {
      const pages: Record<number, { startPage: string; endPage: string }> = {};
      objectives.forEach(obj => {
        pages[obj.weekNumber] = {
          startPage: obj.textbookStartPage?.toString() || "",
          endPage: obj.textbookEndPage?.toString() || ""
        };
      });
      setModulePages(pages);
    }
  }, [objectives]);

  const saveTextbookMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/level-subjects/${levelSubjectId}/textbook`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          textbookPdfUrl: pdfUrl || null,
          textbookTitle: pdfTitle || null
        })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save textbook config');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Guardado", description: "Configuración del texto escolar guardada" });
      queryClient.invalidateQueries({ queryKey: ['/api/level-subjects', levelSubjectId, 'textbook'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const savePagesMutation = useMutation({
    mutationFn: async ({ objectiveId, startPage, endPage }: { objectiveId: string; startPage: string; endPage: string }) => {
      const res = await fetch(`/api/admin/learning-objectives/${objectiveId}/pages`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          textbookStartPage: startPage || null,
          textbookEndPage: endPage || null
        })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save page config');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/level-subjects', levelSubjectId, 'objectives'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSaveAll = async () => {
    await saveTextbookMutation.mutateAsync();

    if (objectives) {
      for (const obj of objectives) {
        const pages = modulePages[obj.weekNumber];
        if (pages) {
          await savePagesMutation.mutateAsync({
            objectiveId: obj.id,
            startPage: pages.startPage,
            endPage: pages.endPage
          });
        }
      }
    }

    toast({ title: "Guardado", description: "Toda la configuración ha sido guardada" });
  };

  const isSaving = saveTextbookMutation.isPending || savePagesMutation.isPending;

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#A51C30]" />
      </div>
    );
  }

  // if (!isAuthenticated || !isAdmin) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-200 py-6 px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="hover:text-[#A51C30]" data-testid="back-button">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#A51C30]/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-[#A51C30]" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1e1e1e]">Biblioteca <span className="text-[#A51C30] italic font-normal">Digital</span></h1>
              <p className="text-sm text-gray-500">Consulta y descarga tus textos de estudio</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <Card className="rounded-none border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#0A192F]">Seleccionar Asignatura</CardTitle>
            <CardDescription>Elige el nivel y asignatura para configurar su texto escolar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Select value={selectedLevelId} onValueChange={(val) => {
                  setSelectedLevelId(val);
                  setSelectedSubjectId("");
                }}>
                  <SelectTrigger data-testid="select-level">
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels?.map(level => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Asignatura</Label>
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId} disabled={!selectedLevelId}>
                  <SelectTrigger data-testid="select-subject">
                    <SelectValue placeholder="Selecciona una asignatura" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.map(subject => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {levelSubjectId && (
          <>
            <Card className="rounded-none border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#A51C30]" />
                  Configuración del PDF
                </CardTitle>
                <CardDescription>Ingresa el link del PDF de Google Drive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pdfUrl">URL del PDF (Google Drive)</Label>
                  <Input
                    id="pdfUrl"
                    placeholder="https://drive.google.com/file/d/..."
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    data-testid="input-pdf-url"
                  />
                  <p className="text-xs text-slate-500">
                    Pega el link compartido del PDF desde Google Drive. Asegúrate de que el archivo tenga permisos de visualización.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdfTitle">Título del Texto</Label>
                  <Input
                    id="pdfTitle"
                    placeholder="Ej: Matemáticas 7° Básico - Santillana"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    data-testid="input-pdf-title"
                  />
                </div>

                {pdfUrl && (
                  <div className="p-3 bg-green-50 border border-green-200 flex items-center gap-2" data-testid="status-pdf-configured">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">PDF configurado</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-none border-slate-200">
              <CardHeader className="bg-gradient-to-r from-[#0A192F] to-[#1a365d] text-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Configuración de Páginas del Texto Escolar
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Programa las páginas del PDF que corresponden a cada uno de los 15 módulos del curso
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoadingObjectives ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
                ) : objectives && objectives.length > 0 ? (
                  <>
                    {/* Información del curso */}
                    <div className="mb-6 p-4 bg-slate-50 border-l-4 border-[#A51C30]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs font-bold text-slate-500 uppercase">Nivel</Label>
                          <p className="text-sm font-medium text-slate-900">{selectedLevel?.name || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-bold text-slate-500 uppercase">Asignatura</Label>
                          <p className="text-sm font-medium text-slate-900">
                            {selectedSubject?.name || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs font-bold text-slate-500 uppercase">Total Módulos</Label>
                          <p className="text-sm font-medium text-slate-900">{objectives.length} módulos</p>
                        </div>
                      </div>
                    </div>

                    {/* Link para abrir el PDF en nueva pestaña */}
                    {pdfUrl && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-blue-900 mb-2">Vista Previa del PDF</p>
                            <p className="text-xs text-blue-700 mb-3">
                              Abre el PDF en una nueva pestaña para verificar los números de página mientras configuras los módulos.
                            </p>
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Abrir PDF en Nueva Pestaña
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tabla de módulos */}
                    <div className="space-y-2" data-testid="modules-list">
                      <div className="flex items-center gap-4 p-3 bg-slate-100 border border-slate-200 font-bold text-xs text-slate-600 uppercase">
                        <div className="w-[100px]">Módulo</div>
                        <div className="flex-1">Objetivo de Aprendizaje</div>
                        <div className="w-[280px] text-center">Páginas del Texto</div>
                      </div>
                      {objectives.sort((a, b) => a.weekNumber - b.weekNumber).map(obj => {
                        const startPage = modulePages[obj.weekNumber]?.startPage || "";
                        const endPage = modulePages[obj.weekNumber]?.endPage || "";
                        const hasPages = startPage && endPage;
                        
                        return (
                          <div 
                            key={obj.id} 
                            className={`flex items-center gap-4 p-3 border transition-colors ${
                              hasPages 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                            data-testid={`module-row-${obj.weekNumber}`}
                          >
                            <Badge 
                              className={`rounded-none min-w-[100px] justify-center ${
                                hasPages 
                                  ? 'bg-green-700 text-white' 
                                  : 'bg-slate-300 text-slate-700'
                              }`}
                              data-testid={`badge-module-${obj.weekNumber}`}
                            >
                              {hasPages && <Check className="w-3 h-3 mr-1" />}
                              Módulo {obj.weekNumber}
                            </Badge>
                            <span className="flex-1 text-sm text-slate-700">{obj.title}</span>
                            <div className="flex items-center gap-2 w-[280px]">
                              <Label className="text-xs text-slate-600 font-medium whitespace-nowrap">Página:</Label>
                              <Input
                                type="number"
                                min="1"
                                className="w-20 h-9 text-center"
                                placeholder="Desde"
                                value={startPage}
                                onChange={(e) => setModulePages(prev => ({
                                  ...prev,
                                  [obj.weekNumber]: {
                                    ...prev[obj.weekNumber],
                                    startPage: e.target.value
                                  }
                                }))}
                                data-testid={`input-start-page-${obj.weekNumber}`}
                              />
                              <span className="text-slate-400">—</span>
                              <Input
                                type="number"
                                min="1"
                                className="w-20 h-9 text-center"
                                placeholder="Hasta"
                                value={endPage}
                                onChange={(e) => setModulePages(prev => ({
                                  ...prev,
                                  [obj.weekNumber]: {
                                    ...prev[obj.weekNumber],
                                    endPage: e.target.value
                                  }
                                }))}
                                data-testid={`input-end-page-${obj.weekNumber}`}
                              />
                              {hasPages && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {parseInt(endPage) - parseInt(startPage) + 1} págs
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Resumen */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-blue-900">Resumen de Configuración</p>
                          <p className="text-xs text-blue-700 mt-1">
                            {Object.values(modulePages).filter(p => p.startPage && p.endPage).length} de {objectives.length} módulos configurados
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No hay módulos configurados para esta asignatura</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-[#A51C30] hover:bg-[#8B1728] text-white rounded-none px-8"
                data-testid="save-all-button"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Todo
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
