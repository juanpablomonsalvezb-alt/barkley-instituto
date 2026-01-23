import { addWeeks, addDays, startOfWeek, isBefore, isAfter, isSameDay, nextFriday, format } from "date-fns";
import { es } from "date-fns/locale";

export interface ModuleSchedule {
  moduleNumber: number;
  startDate: Date;
  endDate: Date;
  evaluation1ReleaseDate: Date;
  evaluation2ReleaseDate: Date;
  isAvailable: boolean;
  isCompleted: boolean;
  daysUntilStart: number;
  status: "locked" | "available" | "in_progress" | "completed";
}

export interface CalendarConfig {
  programStartDate: Date;
  moduleDurationWeeks: number;
  totalModules: number;
}

export const DEFAULT_CONFIG: CalendarConfig = {
  programStartDate: new Date(2026, 2, 9),
  moduleDurationWeeks: 2,
  totalModules: 15,
};

export function getModuleStartDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const weeksOffset = (moduleNumber - 1) * config.moduleDurationWeeks;
  return addWeeks(config.programStartDate, weeksOffset);
}

export function getModuleEndDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const startDate = getModuleStartDate(moduleNumber, config);
  return addDays(addWeeks(startDate, config.moduleDurationWeeks), -1);
}

export function getEvaluation1ReleaseDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const startDate = getModuleStartDate(moduleNumber, config);
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
  return nextFriday(weekStart);
}

export function getEvaluation2ReleaseDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const eval1Date = getEvaluation1ReleaseDate(moduleNumber, config);
  return addWeeks(eval1Date, 1);
}

export function isModuleAvailable(
  moduleNumber: number, 
  currentDate: Date,
  previousModuleCompleted: boolean,
  config: CalendarConfig = DEFAULT_CONFIG
): boolean {
  if (moduleNumber === 1) {
    const startDate = getModuleStartDate(1, config);
    return !isBefore(currentDate, startDate);
  }
  
  const startDate = getModuleStartDate(moduleNumber, config);
  const dateAvailable = !isBefore(currentDate, startDate);
  
  return dateAvailable && previousModuleCompleted;
}

export function isEvaluationAvailable(
  moduleNumber: number,
  evaluationNumber: 1 | 2,
  currentDate: Date,
  config: CalendarConfig = DEFAULT_CONFIG
): boolean {
  const releaseDate = evaluationNumber === 1 
    ? getEvaluation1ReleaseDate(moduleNumber, config)
    : getEvaluation2ReleaseDate(moduleNumber, config);
  
  return !isBefore(currentDate, releaseDate);
}

export function getModuleSchedule(
  moduleNumber: number,
  currentDate: Date,
  previousModuleCompleted: boolean,
  currentModuleEval2Completed: boolean,
  config: CalendarConfig = DEFAULT_CONFIG
): ModuleSchedule {
  const startDate = getModuleStartDate(moduleNumber, config);
  const endDate = getModuleEndDate(moduleNumber, config);
  const evaluation1ReleaseDate = getEvaluation1ReleaseDate(moduleNumber, config);
  const evaluation2ReleaseDate = getEvaluation2ReleaseDate(moduleNumber, config);
  
  const isAvailable = isModuleAvailable(moduleNumber, currentDate, previousModuleCompleted, config);
  const isCompleted = currentModuleEval2Completed;
  
  const daysUntilStart = Math.ceil((startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let status: ModuleSchedule["status"];
  if (isCompleted) {
    status = "completed";
  } else if (!isAvailable) {
    status = "locked";
  } else if (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
    status = "in_progress";
  } else {
    status = "available";
  }
  
  return {
    moduleNumber,
    startDate,
    endDate,
    evaluation1ReleaseDate,
    evaluation2ReleaseDate,
    isAvailable,
    isCompleted,
    daysUntilStart: Math.max(0, daysUntilStart),
    status,
  };
}

export function getAllModulesSchedule(
  currentDate: Date,
  completedModules: number[],
  config: CalendarConfig = DEFAULT_CONFIG
): ModuleSchedule[] {
  const schedules: ModuleSchedule[] = [];
  
  for (let i = 1; i <= config.totalModules; i++) {
    const previousCompleted = i === 1 || completedModules.includes(i - 1);
    const currentCompleted = completedModules.includes(i);
    
    schedules.push(getModuleSchedule(i, currentDate, previousCompleted, currentCompleted, config));
  }
  
  return schedules;
}

export function formatModuleDates(schedule: ModuleSchedule): {
  startFormatted: string;
  endFormatted: string;
  eval1Formatted: string;
  eval2Formatted: string;
} {
  return {
    startFormatted: format(schedule.startDate, "d 'de' MMMM", { locale: es }),
    endFormatted: format(schedule.endDate, "d 'de' MMMM", { locale: es }),
    eval1Formatted: format(schedule.evaluation1ReleaseDate, "EEEE d 'de' MMMM", { locale: es }),
    eval2Formatted: format(schedule.evaluation2ReleaseDate, "EEEE d 'de' MMMM", { locale: es }),
  };
}

export function getCalendarSummary(config: CalendarConfig = DEFAULT_CONFIG): {
  programStart: string;
  programEnd: string;
  totalDuration: string;
} {
  const endDate = getModuleEndDate(config.totalModules, config);
  const totalWeeks = config.totalModules * config.moduleDurationWeeks;
  
  return {
    programStart: format(config.programStartDate, "d 'de' MMMM, yyyy", { locale: es }),
    programEnd: format(endDate, "d 'de' MMMM, yyyy", { locale: es }),
    totalDuration: `${totalWeeks} semanas (${config.totalModules} módulos)`,
  };
}
