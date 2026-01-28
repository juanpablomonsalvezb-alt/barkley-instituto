import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, Save, ExternalLink, CheckCircle, AlertCircle, Loader2, Calendar, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EvaluationLink {
  id?: string;
  courseId: string;
  moduleNumber: number;
  evaluationNumber: 1 | 2 | 3 | 4;
  geminiLink: string;
  title?: string;
  releaseDate?: string;
}

interface LevelSubject {
  id: string;
  levelId: string;
  subjectId: string;
  level?: { id: string; name: string };
  subject?: { id: string; name: string; slug: string };
}

interface EvaluationSchedule {
  evaluationNumber: 1 | 2 | 3 | 4;
  releaseDate: Date;
  releaseDateFormatted: string;
  weekLabel: string;
  dayLabel: string;
}

export default function EvaluationLinksAdmin() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<number>(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estado para los 4 links de evaluación
  const [links, setLinks] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: ""
  });

  // Fetch real courses from level-subjects
  const { data: levelSubjects, isLoading: isLoadingCourses } = useQuery<LevelSubject[]>({
    queryKey: ["/api/level-subjects"],
  });

  // Fetch existing links for selected course and module
  const { data: existingLinks, isLoading: isLoadingLinks } = useQuery<EvaluationLink[]>({
    queryKey: [`/api/evaluation-links/${selectedCourse}/${selectedModule}`],
    enabled: selectedCourse !== null,
  });

  // Fetch evaluation schedules for the selected module
  const { data: evaluationSchedules } = useQuery<EvaluationSchedule[]>({
    queryKey: [`/api/evaluation-schedules/${selectedModule}`],
    queryFn: async () => {
      // Calculate release dates based on module number
      const evaluations: EvaluationSchedule[] = [
        {
          evaluationNumber: 1,
          releaseDate: getEvaluationReleaseDate(selectedModule, 1),
          releaseDateFormatted: formatReleaseDate(getEvaluationReleaseDate(selectedModule, 1)),
          weekLabel: "Semana 1",
          dayLabel: "Miércoles"
        },
        {
          evaluationNumber: 2,
          releaseDate: getEvaluationReleaseDate(selectedModule, 2),
          releaseDateFormatted: formatReleaseDate(getEvaluationReleaseDate(selectedModule, 2)),
          weekLabel: "Semana 1",
          dayLabel: "Viernes"
        },
        {
          evaluationNumber: 3,
          releaseDate: getEvaluationReleaseDate(selectedModule, 3),
          releaseDateFormatted: formatReleaseDate(getEvaluationReleaseDate(selectedModule, 3)),
          weekLabel: "Semana 2",
          dayLabel: "Miércoles"
        },
        {
          evaluationNumber: 4,
          releaseDate: getEvaluationReleaseDate(selectedModule, 4),
          releaseDateFormatted: formatReleaseDate(getEvaluationReleaseDate(selectedModule, 4)),
          weekLabel: "Semana 2",
          dayLabel: "Viernes"
        }
      ];
      return evaluations;
    }
  });

  // Load existing links when they change
  useEffect(() => {
    if (existingLinks && existingLinks.length > 0) {
      const loadedLinks: Record<number, string> = { 1: "", 2: "", 3: "", 4: "" };
      existingLinks.forEach(link => {
        loadedLinks[link.evaluationNumber] = link.geminiLink;
      });
      setLinks(loadedLinks);
    } else {
      setLinks({ 1: "", 2: "", 3: "", 4: "" });
    }
  }, [existingLinks]);

  // Helper functions for date calculations
  const getEvaluationReleaseDate = (moduleNumber: number, evaluationNumber: number): Date => {
    const programStartDate = new Date(2026, 2, 9); // Monday, March 9, 2026
    const moduleDurationWeeks = 2;
    
    // Calculate module start (accounting for eval weeks after modules 7 and 15)
    let weeksOffset = (moduleNumber - 1) * moduleDurationWeeks;
    if (moduleNumber > 7) weeksOffset += 1; // Add eval week after module 7
    if (moduleNumber > 15) weeksOffset += 1; // Add eval week after module 15
    
    const moduleStart = new Date(programStartDate);
    moduleStart.setDate(moduleStart.getDate() + (weeksOffset * 7));
    
    // Calculate specific evaluation date
    if (evaluationNumber === 1) {
      // Week 1 Wednesday (day 2 of module)
      return new Date(moduleStart.getTime() + (2 * 24 * 60 * 60 * 1000));
    } else if (evaluationNumber === 2) {
      // Week 1 Friday (day 4 of module)
      return new Date(moduleStart.getTime() + (4 * 24 * 60 * 60 * 1000));
    } else if (evaluationNumber === 3) {
      // Week 2 Wednesday (day 9 of module)
      return new Date(moduleStart.getTime() + (9 * 24 * 60 * 60 * 1000));
    } else {
      // Week 2 Friday (day 11 of module)
      return new Date(moduleStart.getTime() + (11 * 24 * 60 * 60 * 1000));
    }
  };

  const formatReleaseDate = (date: Date): string => {
    return format(date, "EEEE d 'de' MMMM, yyyy", { locale: es });
  };

  // Mutation to save links
  const saveLinksMutation = useMutation({
    mutationFn: async (data: EvaluationLink[]) => {
      const response = await fetch("/api/evaluation-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Error al guardar");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Guardado exitoso",
        description: "Los links de evaluación se han guardado correctamente",
      });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/evaluation-links/${selectedCourse}/${selectedModule}`] 
      });
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar los links",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    if (!selectedCourse) {
      toast({
        title: "⚠️ Curso no seleccionado",
        description: "Por favor selecciona un curso primero",
        variant: "destructive",
      });
      return;
    }

    const evaluationLinks: EvaluationLink[] = Object.entries(links)
      .filter(([_, link]) => link.trim() !== "")
      .map(([evalNum, link]) => {
        const evalNumber = parseInt(evalNum) as 1 | 2 | 3 | 4;
        return {
          courseId: selectedCourse,
          moduleNumber: selectedModule,
          evaluationNumber: evalNumber,
          geminiLink: link,
          title: `Evaluación ${evalNum} - Módulo ${selectedModule}`
        };
      });

    if (evaluationLinks.length === 0) {
      toast({
        title: "⚠️ Sin datos",
        description: "Agrega al menos un link de evaluación",
        variant: "destructive",
      });
      return;
    }

    saveLinksMutation.mutate(evaluationLinks);
  };

  const validateLink = (link: string): boolean => {
    try {
      const url = new URL(link);
      return url.hostname.includes("gemini") || url.hostname.includes("google");
    } catch {
      return false;
    }
  };

  // Get course display name
  const getCourseDisplayName = (ls: LevelSubject): string => {
    return `${ls.subject?.name} - ${ls.level?.name}`;
  };

  // Count total links saved
  const totalLinksSaved = Object.values(links).filter(link => link.trim() !== "").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            📝 Configuración de Evaluaciones Gemini
          </h1>
          <p className="text-slate-600">
            Gestiona los links de evaluaciones generadas por Gemini. Cada módulo tiene 4 evaluaciones que se liberan los martes y viernes.
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Sistema de evaluaciones:</strong> Cada módulo dura 2 semanas y tiene 4 evaluaciones programadas.
            Las fechas se calculan automáticamente según el calendario del programa que inicia el 9 de marzo, 2026.
          </AlertDescription>
        </Alert>

        {/* Course Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5 text-primary" />
              1. Seleccionar Asignatura
            </CardTitle>
            <CardDescription>
              Elige la asignatura para la cual deseas configurar las evaluaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-slate-600">Cargando asignaturas...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelSubjects?.map((ls: LevelSubject) => (
                  <button
                    key={ls.id}
                    onClick={() => setSelectedCourse(ls.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedCourse === ls.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-slate-200 hover:border-primary/50 hover:shadow-sm"
                    }`}
                  >
                    <h3 className="font-bold text-slate-900 mb-1">{getCourseDisplayName(ls)}</h3>
                    <p className="text-sm text-slate-600">
                      15 módulos · 60 evaluaciones
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module Selection */}
        {selectedCourse && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                2. Seleccionar Módulo
              </CardTitle>
              <CardDescription>
                Selecciona el módulo para gestionar sus 4 evaluaciones (Miércoles y Viernes de cada semana)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedModule.toString()} onValueChange={(v) => setSelectedModule(parseInt(v))}>
                <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2 h-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                    <TabsTrigger key={num} value={num.toString()} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Módulo {num}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Evaluation Links Form */}
        {selectedCourse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5 text-primary" />
                  3. Configurar Links de Evaluaciones - Módulo {selectedModule}
                </span>
                {saveLinksMutation.isPending && (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                )}
              </CardTitle>
              <CardDescription>
                Pega los links de las evaluaciones generadas por Gemini. Las fechas de liberación se calculan automáticamente.
                {totalLinksSaved > 0 && (
                  <span className="block mt-1 text-green-600 font-medium">
                    ✓ {totalLinksSaved} de 4 evaluaciones configuradas
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingLinks ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-slate-600">Cargando evaluaciones...</span>
                </div>
              ) : (
                <>
                  {/* Evaluación 1 - Miércoles Semana 1 */}
                  {evaluationSchedules?.map((schedule) => (
                    <div key={schedule.evaluationNumber} className="space-y-3 p-4 rounded-lg border bg-white">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`eval${schedule.evaluationNumber}`} className="text-base font-semibold flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {schedule.evaluationNumber}
                          </span>
                          Evaluación {schedule.evaluationNumber}
                        </Label>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {schedule.dayLabel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {schedule.weekLabel}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>Se libera: {schedule.releaseDateFormatted}</span>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          id={`eval${schedule.evaluationNumber}`}
                          placeholder="https://gemini.google.com/app/..."
                          value={links[schedule.evaluationNumber]}
                          onChange={(e) => setLinks({ ...links, [schedule.evaluationNumber]: e.target.value })}
                          className={links[schedule.evaluationNumber] && !validateLink(links[schedule.evaluationNumber]) ? "border-red-500" : ""}
                        />
                        {links[schedule.evaluationNumber] && validateLink(links[schedule.evaluationNumber]) && (
                          <CheckCircle className="w-10 h-10 text-green-600 shrink-0" />
                        )}
                        {links[schedule.evaluationNumber] && !validateLink(links[schedule.evaluationNumber]) && (
                          <AlertCircle className="w-10 h-10 text-red-600 shrink-0" />
                        )}
                      </div>
                      
                      {links[schedule.evaluationNumber] && (
                        <a
                          href={links[schedule.evaluationNumber]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Probar link en nueva pestaña
                        </a>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Save Button */}
              <div className="pt-6 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setLinks({ 1: "", 2: "", 3: "", 4: "" })}
                >
                  Limpiar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saveLinksMutation.isPending}
                  className="gap-2"
                >
                  {saveLinksMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Links
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
