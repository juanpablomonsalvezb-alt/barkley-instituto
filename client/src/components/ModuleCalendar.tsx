import { useQuery } from "@tanstack/react-query";
import { 
  Lock, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  AlertCircle,
  ChevronRight,
  PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModuleSchedule {
  moduleNumber: number;
  startDate: string;
  endDate: string;
  evaluation1ReleaseDate: string;
  evaluation2ReleaseDate: string;
  isAvailable: boolean;
  isCompleted: boolean;
  daysUntilStart: number;
  status: "locked" | "available" | "in_progress" | "completed";
  startFormatted: string;
  endFormatted: string;
  eval1Formatted: string;
  eval2Formatted: string;
  objective: {
    id: string;
    code: string;
    title: string;
    description: string | null;
  } | null;
}

interface CalendarData {
  levelSubjectId: string;
  modules: ModuleSchedule[];
  summary: {
    programStart: string;
    programEnd: string;
    totalDuration: string;
  };
}

interface ModuleCalendarProps {
  levelSubjectId: string;
  currentModule: number;
  onModuleSelect: (moduleNumber: number) => void;
  compact?: boolean;
}

function getStatusColor(status: ModuleSchedule["status"]) {
  switch (status) {
    case "completed": return "bg-green-500";
    case "in_progress": return "bg-[#A51C30]";
    case "available": return "bg-blue-500";
    case "locked": return "bg-slate-300";
  }
}

function getStatusIcon(status: ModuleSchedule["status"]) {
  switch (status) {
    case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "in_progress": return <PlayCircle className="w-4 h-4 text-[#A51C30]" />;
    case "available": return <ChevronRight className="w-4 h-4 text-blue-500" />;
    case "locked": return <Lock className="w-4 h-4 text-slate-400" />;
  }
}

function getStatusLabel(status: ModuleSchedule["status"]) {
  switch (status) {
    case "completed": return "Completado";
    case "in_progress": return "En Curso";
    case "available": return "Disponible";
    case "locked": return "Bloqueado";
  }
}

export function ModuleCalendar({ levelSubjectId, currentModule, onModuleSelect, compact = false }: ModuleCalendarProps) {
  const { data: calendar, isLoading, error } = useQuery<CalendarData>({
    queryKey: ['/api/level-subjects', levelSubjectId, 'calendar'],
    enabled: !!levelSubjectId,
    queryFn: async () => {
      const res = await fetch(`/api/level-subjects/${levelSubjectId}/calendar`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch calendar');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-slate-400 text-sm">Cargando calendario...</div>
      </div>
    );
  }

  if (error || !calendar) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span className="text-sm">Error al cargar calendario</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex justify-center gap-2 overflow-x-auto pb-4 px-4">
        {calendar.modules.map((module) => (
          <button
            key={module.moduleNumber}
            onClick={() => module.isAvailable && onModuleSelect(module.moduleNumber)}
            disabled={!module.isAvailable}
            className={cn(
              "min-w-[44px] h-11 border text-[10px] font-bold transition-all relative group",
              currentModule === module.moduleNumber 
                ? "bg-[#0A192F] border-[#0A192F] text-white shadow-lg scale-110" 
                : module.isCompleted
                  ? "bg-green-50 border-green-200 text-green-600 hover:border-green-400"
                  : module.isAvailable
                    ? "bg-white border-slate-100 text-slate-500 hover:text-[#0A192F] hover:border-slate-300"
                    : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
            )}
            data-testid={`module-button-${module.moduleNumber}`}
          >
            {module.isCompleted && (
              <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
            )}
            {!module.isAvailable && !module.isCompleted && (
              <Lock className="absolute -top-1 -right-1 w-3 h-3 text-slate-400" />
            )}
            M{module.moduleNumber}
            
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-[#0A192F] text-white p-3 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl rounded-sm">
              <p className="font-bold mb-1">{module.startFormatted} - {module.endFormatted}</p>
              {module.objective && (
                <p className="opacity-80 truncate">{module.objective.title}</p>
              )}
              {!module.isAvailable && module.daysUntilStart > 0 && (
                <p className="text-[#A51C30] mt-1">Disponible en {module.daysUntilStart} días</p>
              )}
              {!module.isAvailable && module.daysUntilStart === 0 && !module.isCompleted && (
                <p className="text-[#A51C30] mt-1">Completa el módulo anterior</p>
              )}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0A192F]" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <Card className="rounded-none border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <Calendar className="w-5 h-5 text-[#A51C30]" />
          Calendario del Programa
        </CardTitle>
        <p className="text-xs text-slate-500">
          {calendar.summary.programStart} - {calendar.summary.programEnd}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {calendar.modules.map((module) => (
          <button
            key={module.moduleNumber}
            onClick={() => module.isAvailable && onModuleSelect(module.moduleNumber)}
            disabled={!module.isAvailable}
            className={cn(
              "w-full p-4 border text-left transition-all group",
              currentModule === module.moduleNumber 
                ? "bg-[#0A192F] border-[#0A192F] text-white" 
                : module.isAvailable
                  ? "bg-white border-slate-100 hover:border-[#A51C30] hover:shadow-md"
                  : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
            )}
            data-testid={`calendar-module-${module.moduleNumber}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    currentModule === module.moduleNumber ? "text-white/60" : "text-slate-400"
                  )}>
                    Módulo {module.moduleNumber}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[8px] px-2 py-0",
                      module.status === "completed" && "bg-green-100 text-green-700",
                      module.status === "in_progress" && "bg-[#A51C30]/10 text-[#A51C30]",
                      module.status === "available" && "bg-blue-100 text-blue-700",
                      module.status === "locked" && "bg-slate-100 text-slate-500"
                    )}
                  >
                    {getStatusLabel(module.status)}
                  </Badge>
                </div>
                
                {module.objective && (
                  <p className={cn(
                    "text-sm font-medium truncate",
                    currentModule === module.moduleNumber ? "text-white" : "text-[#0A192F]"
                  )}>
                    {module.objective.title}
                  </p>
                )}
                
                <div className={cn(
                  "flex items-center gap-4 mt-2 text-[10px]",
                  currentModule === module.moduleNumber ? "text-white/60" : "text-slate-400"
                )}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {module.startFormatted}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                {getStatusIcon(module.status)}
              </div>
            </div>

            {module.isAvailable && !module.isCompleted && (
              <div className={cn(
                "mt-3 pt-3 border-t text-[9px]",
                currentModule === module.moduleNumber ? "border-white/10" : "border-slate-100"
              )}>
                <div className="flex justify-between">
                  <span>Evaluación 1:</span>
                  <span className="font-medium">{module.eval1Formatted}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Evaluación 2:</span>
                  <span className="font-medium">{module.eval2Formatted}</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

export function ModuleCalendarCompact({ levelSubjectId, currentModule, onModuleSelect }: Omit<ModuleCalendarProps, 'compact'>) {
  return (
    <ModuleCalendar 
      levelSubjectId={levelSubjectId} 
      currentModule={currentModule} 
      onModuleSelect={onModuleSelect} 
      compact={true} 
    />
  );
}
