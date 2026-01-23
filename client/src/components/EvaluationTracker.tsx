import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  Lock, 
  Calendar, 
  AlertCircle,
  FileCheck,
  Clock,
  ExternalLink,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EvaluationData {
  number: number;
  title: string;
  releaseDate: string;
  releaseDateFormatted: string;
  isReleased: boolean;
  evaluation: {
    id: string;
    title: string;
    formUrl: string | null;
    learningObjectiveId: string;
    evaluationNumber: number;
  } | null;
  completed: boolean;
}

interface ModuleEvaluationsResponse {
  moduleNumber: number;
  learningObjectiveId: string;
  evaluations: EvaluationData[];
}

interface EvaluationTrackerProps {
  levelSubjectId: string;
  moduleNumber: number;
  onEvaluationComplete?: () => void;
}

export function EvaluationTracker({ levelSubjectId, moduleNumber, onEvaluationComplete }: EvaluationTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ModuleEvaluationsResponse>({
    queryKey: ['/api/modules', moduleNumber, 'evaluations', levelSubjectId],
    queryFn: async () => {
      const res = await fetch(`/api/modules/${moduleNumber}/evaluations?levelSubjectId=${levelSubjectId}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch evaluations');
      return res.json();
    },
    enabled: !!levelSubjectId && moduleNumber > 0
  });

  const markComplete = useMutation({
    mutationFn: async ({ evaluationId, score, passed }: { evaluationId: string; score: number; passed: boolean }) => {
      return apiRequest('POST', `/api/evaluations/${evaluationId}/complete`, { score, passed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/modules', moduleNumber, 'evaluations', levelSubjectId] });
      queryClient.invalidateQueries({ queryKey: ['/api/level-subjects', levelSubjectId, 'calendar'] });
      toast({
        title: "Evaluación Completada",
        description: "Tu progreso ha sido guardado.",
      });
      onEvaluationComplete?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo guardar el progreso. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <Card className="rounded-none border-slate-200">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="rounded-none border-slate-200">
        <CardContent className="p-6 flex items-center justify-center text-slate-400">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm">No hay evaluaciones configuradas</span>
        </CardContent>
      </Card>
    );
  }

  const allCompleted = data.evaluations.every(e => e.completed);
  const canAdvance = data.evaluations[1]?.completed === true;

  return (
    <Card className="rounded-none border-slate-200">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-serif">
            <FileCheck className="w-5 h-5 text-[#A51C30]" />
            Evaluaciones Formativas
          </CardTitle>
          {allCompleted && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completadas
            </Badge>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Módulo {moduleNumber} - Debes aprobar ambas evaluaciones para avanzar
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {data.evaluations.map((evaluation) => (
          <div
            key={evaluation.number}
            className={cn(
              "p-4 border transition-all",
              evaluation.completed
                ? "bg-green-50 border-green-200"
                : evaluation.isReleased
                  ? "bg-white border-slate-200 hover:border-[#A51C30]"
                  : "bg-slate-50 border-slate-100 opacity-60"
            )}
            data-testid={`evaluation-${evaluation.number}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-[#0A192F]">
                    {evaluation.title}
                  </span>
                  {evaluation.completed ? (
                    <Badge className="bg-green-100 text-green-700 text-[8px]">Aprobada</Badge>
                  ) : !evaluation.isReleased ? (
                    <Badge className="bg-slate-100 text-slate-500 text-[8px]">
                      <Lock className="w-2 h-2 mr-1" />
                      Bloqueada
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-700 text-[8px]">Disponible</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {evaluation.isReleased ? 'Liberada' : 'Se libera'}: {evaluation.releaseDateFormatted}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {evaluation.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : evaluation.isReleased && evaluation.evaluation ? (
                  <div className="flex flex-col gap-2">
                    {evaluation.evaluation.formUrl && (
                      <Button
                        size="sm"
                        className="bg-[#A51C30] hover:bg-[#821626] text-white rounded-none text-[9px] px-3 h-7"
                        onClick={() => window.open(evaluation.evaluation!.formUrl!, '_blank')}
                        data-testid={`start-evaluation-${evaluation.number}`}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Iniciar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none text-[9px] px-3 h-7"
                      onClick={() => markComplete.mutate({ 
                        evaluationId: evaluation.evaluation!.id, 
                        score: 100, 
                        passed: true 
                      })}
                      disabled={markComplete.isPending}
                      data-testid={`mark-complete-${evaluation.number}`}
                    >
                      {markComplete.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        'Marcar Completada'
                      )}
                    </Button>
                  </div>
                ) : evaluation.isReleased ? (
                  <Clock className="w-5 h-5 text-slate-400" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-300" />
                )}
              </div>
            </div>

            {!evaluation.isReleased && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 italic">
                  Esta evaluación estará disponible el {evaluation.releaseDateFormatted}
                </p>
              </div>
            )}
          </div>
        ))}

        {canAdvance && (
          <div className="mt-4 p-4 bg-[#0A192F] text-white">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm font-bold">¡Módulo Completado!</p>
                <p className="text-[10px] text-white/60">
                  Has aprobado ambas evaluaciones. Puedes avanzar al siguiente módulo.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
