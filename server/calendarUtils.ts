import { addWeeks, addDays, startOfWeek, isBefore, isAfter, isSameDay, format } from "date-fns";
import { es } from "date-fns/locale";

export interface ModuleSchedule {
  moduleNumber: number;
  startDate: Date;
  endDate: Date;
  // 4 mini evaluations: Week 1 Wednesday, Week 1 Friday, Week 2 Wednesday, Week 2 Friday
  evaluation1ReleaseDate: Date; // Week 1 Wednesday
  evaluation2ReleaseDate: Date; // Week 1 Friday
  evaluation3ReleaseDate: Date; // Week 2 Wednesday
  evaluation4ReleaseDate: Date; // Week 2 Friday
  isAvailable: boolean;
  isCompleted: boolean;
  daysUntilStart: number;
  status: "locked" | "available" | "in_progress" | "completed";
  dateRange: string; // Formatted date range for display
}

export interface GeneralEvaluationWeek {
  type: "general_evaluation";
  name: string;
  startDate: Date;
  endDate: Date;
  afterModule: number;
}

export interface CalendarConfig {
  programStartDate: Date;
  moduleDurationWeeks: number;
  totalModules: number;
  generalEvaluationWeeks: { afterModule: number; name: string }[];
}

export const DEFAULT_CONFIG: CalendarConfig = {
  programStartDate: new Date(2026, 2, 9), // Monday, March 9, 2026
  moduleDurationWeeks: 2,
  totalModules: 15,
  generalEvaluationWeeks: [
    { afterModule: 7, name: "Semana de Evaluaciones Generales (Primer Semestre)" },
    { afterModule: 15, name: "Semana de Evaluaciones Finales" }
  ]
};

// Calculate module start date accounting for general evaluation weeks
export function getModuleStartDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  let weeksOffset = (moduleNumber - 1) * config.moduleDurationWeeks;

  // Add extra weeks for general evaluation periods before this module
  for (const evalWeek of config.generalEvaluationWeeks) {
    if (moduleNumber > evalWeek.afterModule) {
      weeksOffset += 1; // Add 1 week for each general evaluation period
    }
  }

  return addWeeks(config.programStartDate, weeksOffset);
}

export function getModuleEndDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const startDate = getModuleStartDate(moduleNumber, config);
  return addDays(addWeeks(startDate, config.moduleDurationWeeks), -1);
}

// Get Wednesday of a given week
function getWednesday(weekStart: Date): Date {
  return addDays(weekStart, 2); // Monday + 2 = Wednesday
}

// Get Friday of a given week
function getFriday(weekStart: Date): Date {
  return addDays(weekStart, 4); // Monday + 4 = Friday
}

// 4 mini evaluations per module
export function getEvaluation1ReleaseDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const startDate = getModuleStartDate(moduleNumber, config);
  return getWednesday(startDate); // Week 1 Wednesday
}

export function getEvaluation2ReleaseDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const startDate = getModuleStartDate(moduleNumber, config);
  return getFriday(startDate); // Week 1 Friday
}

export function getEvaluation3ReleaseDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const startDate = getModuleStartDate(moduleNumber, config);
  const week2Start = addWeeks(startDate, 1);
  return getWednesday(week2Start); // Week 2 Wednesday
}

export function getEvaluation4ReleaseDate(moduleNumber: number, config: CalendarConfig = DEFAULT_CONFIG): Date {
  const startDate = getModuleStartDate(moduleNumber, config);
  const week2Start = addWeeks(startDate, 1);
  return getFriday(week2Start); // Week 2 Friday
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
  evaluationNumber: 1 | 2 | 3 | 4,
  currentDate: Date,
  config: CalendarConfig = DEFAULT_CONFIG
): boolean {
  let releaseDate: Date;
  switch (evaluationNumber) {
    case 1: releaseDate = getEvaluation1ReleaseDate(moduleNumber, config); break;
    case 2: releaseDate = getEvaluation2ReleaseDate(moduleNumber, config); break;
    case 3: releaseDate = getEvaluation3ReleaseDate(moduleNumber, config); break;
    case 4: releaseDate = getEvaluation4ReleaseDate(moduleNumber, config); break;
  }

  return !isBefore(currentDate, releaseDate);
}

export function getModuleSchedule(
  moduleNumber: number,
  currentDate: Date,
  previousModuleCompleted: boolean,
  currentModuleCompleted: boolean,
  config: CalendarConfig = DEFAULT_CONFIG
): ModuleSchedule {
  const startDate = getModuleStartDate(moduleNumber, config);
  const endDate = getModuleEndDate(moduleNumber, config);
  const evaluation1ReleaseDate = getEvaluation1ReleaseDate(moduleNumber, config);
  const evaluation2ReleaseDate = getEvaluation2ReleaseDate(moduleNumber, config);
  const evaluation3ReleaseDate = getEvaluation3ReleaseDate(moduleNumber, config);
  const evaluation4ReleaseDate = getEvaluation4ReleaseDate(moduleNumber, config);

  const isAvailable = isModuleAvailable(moduleNumber, currentDate, previousModuleCompleted, config);
  const isCompleted = currentModuleCompleted;

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

  // Format date range for display
  const dateRange = `${format(startDate, "d MMM", { locale: es })} - ${format(endDate, "d MMM", { locale: es })}`;

  return {
    moduleNumber,
    startDate,
    endDate,
    evaluation1ReleaseDate,
    evaluation2ReleaseDate,
    evaluation3ReleaseDate,
    evaluation4ReleaseDate,
    isAvailable,
    isCompleted,
    daysUntilStart: Math.max(0, daysUntilStart),
    status,
    dateRange,
  };
}

export function getAllModulesSchedule(
  currentDate: Date,
  completedModules: number[],
  config: CalendarConfig = DEFAULT_CONFIG,
  adminBypass: boolean = false
): ModuleSchedule[] {
  const schedules: ModuleSchedule[] = [];

  for (let i = 1; i <= config.totalModules; i++) {
    const previousCompleted = i === 1 || completedModules.includes(i - 1);
    const currentCompleted = completedModules.includes(i);

    const schedule = getModuleSchedule(i, currentDate, previousCompleted, currentCompleted, config);

    // Admin bypass: force all modules to be available
    if (adminBypass) {
      schedule.isAvailable = true;
      schedule.status = currentCompleted ? "completed" : "available";
    }

    schedules.push(schedule);
  }

  return schedules;
}

// Get general evaluation weeks
export function getGeneralEvaluationWeeks(config: CalendarConfig = DEFAULT_CONFIG): GeneralEvaluationWeek[] {
  return config.generalEvaluationWeeks.map(evalWeek => {
    const lastModuleEndDate = getModuleEndDate(evalWeek.afterModule, config);
    const startDate = addDays(lastModuleEndDate, 1);
    const endDate = addDays(startDate, 6);

    return {
      type: "general_evaluation" as const,
      name: evalWeek.name,
      startDate,
      endDate,
      afterModule: evalWeek.afterModule
    };
  });
}

export function formatModuleDates(schedule: ModuleSchedule): {
  startFormatted: string;
  endFormatted: string;
  eval1Formatted: string;
  eval2Formatted: string;
  eval3Formatted: string;
  eval4Formatted: string;
  dateRangeFormatted: string;
} {
  return {
    startFormatted: format(schedule.startDate, "d 'de' MMMM", { locale: es }),
    endFormatted: format(schedule.endDate, "d 'de' MMMM", { locale: es }),
    eval1Formatted: format(schedule.evaluation1ReleaseDate, "EEEE d 'de' MMMM", { locale: es }),
    eval2Formatted: format(schedule.evaluation2ReleaseDate, "EEEE d 'de' MMMM", { locale: es }),
    eval3Formatted: format(schedule.evaluation3ReleaseDate, "EEEE d 'de' MMMM", { locale: es }),
    eval4Formatted: format(schedule.evaluation4ReleaseDate, "EEEE d 'de' MMMM", { locale: es }),
    dateRangeFormatted: schedule.dateRange,
  };
}

export function getCalendarSummary(config: CalendarConfig = DEFAULT_CONFIG): {
  programStart: string;
  programEnd: string;
  totalDuration: string;
  generalEvaluationWeeks: { name: string; dates: string }[];
} {
  const endDate = getModuleEndDate(config.totalModules, config);
  const totalWeeks = config.totalModules * config.moduleDurationWeeks + config.generalEvaluationWeeks.length;

  const evalWeeks = getGeneralEvaluationWeeks(config);

  return {
    programStart: format(config.programStartDate, "d 'de' MMMM, yyyy", { locale: es }),
    programEnd: format(addDays(endDate, 7), "d 'de' MMMM, yyyy", { locale: es }), // +1 week for final eval
    totalDuration: `${totalWeeks} semanas (${config.totalModules} módulos + ${config.generalEvaluationWeeks.length} semanas de evaluaciones)`,
    generalEvaluationWeeks: evalWeeks.map(w => ({
      name: w.name,
      dates: `${format(w.startDate, "d 'de' MMMM", { locale: es })} - ${format(w.endDate, "d 'de' MMMM", { locale: es })}`
    }))
  };
}
