import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models (users and sessions tables)
export * from "./models/auth";

// Enums
export const programTypeEnum = pgEnum("program_type", ["menores", "adultos"]);
export const resourceTypeEnum = pgEnum("resource_type", [
  "video", 
  "infografia", 
  "audio", 
  "presentacion", 
  "flashcards", 
  "cuestionario", 
  "resumen"
]);
export const userRoleEnum = pgEnum("user_role", ["admin", "student", "tutor"]);

// User roles - extends the auth users table
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: userRoleEnum("role").default("student").notNull(),
  levelId: varchar("level_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Import users from auth for foreign key references
import { users } from "./models/auth";

// Levels (7° Básico, 8° Básico, etc.)
export const levels = pgTable("levels", {
  id: varchar("id").primaryKey(), // e.g., "7b", "8b", "1m", etc.
  name: text("name").notNull(), // "7° Básico"
  programType: programTypeEnum("program_type").notNull(),
  totalWeeks: integer("total_weeks").default(30).notNull(),
  cadencePerOA: text("cadence_per_oa"), // "2.18 sem/OA"
  sortOrder: integer("sort_order").default(0).notNull(),
});

// Subjects (Matemáticas, Lenguaje, etc.)
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Level-Subject association (which subjects are in which levels)
export const levelSubjects = pgTable("level_subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  levelId: varchar("level_id").notNull().references(() => levels.id),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id),
  totalOAs: integer("total_oas").default(0),
  textbookPdfUrl: text("textbook_pdf_url"),
  textbookTitle: text("textbook_title"),
});

// Learning Objectives (OAs - Objetivos de Aprendizaje) / Módulos
export const learningObjectives = pgTable("learning_objectives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  levelSubjectId: varchar("level_subject_id").notNull().references(() => levelSubjects.id),
  code: text("code").notNull(), // "OA 3"
  title: text("title").notNull(),
  description: text("description"),
  weekNumber: integer("week_number").notNull(), // Actually module number (1-15)
  sortOrder: integer("sort_order").default(0).notNull(),
  textbookStartPage: integer("textbook_start_page"),
  textbookEndPage: integer("textbook_end_page"),
});

// Program Calendar Configuration
export const programCalendar = pgTable("program_calendar", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  levelId: varchar("level_id").notNull().references(() => levels.id),
  startDate: timestamp("start_date").notNull(), // March 9, 2026
  moduleDurationWeeks: integer("module_duration_weeks").default(2).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Module Evaluations (2 per module)
export const moduleEvaluations = pgTable("module_evaluations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  learningObjectiveId: varchar("learning_objective_id").notNull().references(() => learningObjectives.id),
  evaluationNumber: integer("evaluation_number").notNull(), // 1 or 2
  title: text("title").notNull(),
  description: text("description"),
  releaseDay: integer("release_day").default(5).notNull(), // Day of week (5 = Friday)
  releaseWeek: integer("release_week").notNull(), // 1 or 2 (which week of the module)
  formUrl: text("form_url"), // Google Form URL
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student Evaluation Progress
export const evaluationProgress = pgTable("evaluation_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  evaluationId: varchar("evaluation_id").notNull().references(() => moduleEvaluations.id),
  completedAt: timestamp("completed_at"),
  score: integer("score"),
  passed: boolean("passed").default(false),
});

// Weekly Resources (7 tipos por semana)
export const weeklyResources = pgTable("weekly_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  learningObjectiveId: varchar("learning_objective_id").notNull().references(() => learningObjectives.id),
  resourceType: resourceTypeEnum("resource_type").notNull(),
  title: text("title").notNull(),
  notebookLmUrl: text("notebook_lm_url"),
  barkleyFoundation: text("barkley_foundation"), // "Activación Atencional (Barkley)"
  studentHelp: text("student_help"), // "Voz al alumno" text
  pedagogicalObjective: text("pedagogical_objective"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Enrollments
export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  levelSubjectId: varchar("level_subject_id").notNull().references(() => levelSubjects.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Student Progress (tracks which resources have been completed)
export const studentProgress = pgTable("student_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  resourceId: varchar("resource_id").notNull().references(() => weeklyResources.id),
  completedAt: timestamp("completed_at").defaultNow(),
  score: integer("score"), // For cuestionario
});

// Weekly completion status
export const weeklyCompletion = pgTable("weekly_completion", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  learningObjectiveId: varchar("learning_objective_id").notNull().references(() => learningObjectives.id),
  isComplete: boolean("is_complete").default(false),
  completedAt: timestamp("completed_at"),
  examScore: integer("exam_score"),
});

// Relations
export const levelsRelations = relations(levels, ({ many }) => ({
  levelSubjects: many(levelSubjects),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  levelSubjects: many(levelSubjects),
}));

export const levelSubjectsRelations = relations(levelSubjects, ({ one, many }) => ({
  level: one(levels, {
    fields: [levelSubjects.levelId],
    references: [levels.id],
  }),
  subject: one(subjects, {
    fields: [levelSubjects.subjectId],
    references: [subjects.id],
  }),
  learningObjectives: many(learningObjectives),
}));

export const learningObjectivesRelations = relations(learningObjectives, ({ one, many }) => ({
  levelSubject: one(levelSubjects, {
    fields: [learningObjectives.levelSubjectId],
    references: [levelSubjects.id],
  }),
  resources: many(weeklyResources),
  evaluations: many(moduleEvaluations),
}));

export const programCalendarRelations = relations(programCalendar, ({ one }) => ({
  level: one(levels, {
    fields: [programCalendar.levelId],
    references: [levels.id],
  }),
}));

export const moduleEvaluationsRelations = relations(moduleEvaluations, ({ one, many }) => ({
  learningObjective: one(learningObjectives, {
    fields: [moduleEvaluations.learningObjectiveId],
    references: [learningObjectives.id],
  }),
  progress: many(evaluationProgress),
}));

export const evaluationProgressRelations = relations(evaluationProgress, ({ one }) => ({
  user: one(users, {
    fields: [evaluationProgress.userId],
    references: [users.id],
  }),
  evaluation: one(moduleEvaluations, {
    fields: [evaluationProgress.evaluationId],
    references: [moduleEvaluations.id],
  }),
}));

export const weeklyResourcesRelations = relations(weeklyResources, ({ one }) => ({
  learningObjective: one(learningObjectives, {
    fields: [weeklyResources.learningObjectiveId],
    references: [learningObjectives.id],
  }),
}));

// Insert schemas
export const insertLevelSchema = createInsertSchema(levels);
export const insertSubjectSchema = createInsertSchema(subjects).omit({ id: true, createdAt: true });
export const insertLevelSubjectSchema = createInsertSchema(levelSubjects).omit({ id: true });
export const insertLearningObjectiveSchema = createInsertSchema(learningObjectives).omit({ id: true });
export const insertWeeklyResourceSchema = createInsertSchema(weeklyResources).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, enrolledAt: true });
export const insertStudentProgressSchema = createInsertSchema(studentProgress).omit({ id: true, completedAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true });
export const insertProgramCalendarSchema = createInsertSchema(programCalendar).omit({ id: true, createdAt: true });
export const insertModuleEvaluationSchema = createInsertSchema(moduleEvaluations).omit({ id: true, createdAt: true });
export const insertEvaluationProgressSchema = createInsertSchema(evaluationProgress).omit({ id: true });

const baseLevelSubjectTextbookSchema = createInsertSchema(levelSubjects, {
  textbookPdfUrl: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().url({ message: 'Invalid URL format' }).nullable().optional()
  ),
  textbookTitle: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().nullable().optional()
  )
}).pick({
  textbookPdfUrl: true,
  textbookTitle: true
}).partial();

export const updateLevelSubjectTextbookSchema = baseLevelSubjectTextbookSchema;

const baseLearningObjectivePagesSchema = createInsertSchema(learningObjectives, {
  textbookStartPage: z.preprocess(
    (val) => {
      if (val === '' || val === null) return null;
      if (val === undefined) return undefined;
      if (typeof val === 'string') return parseInt(val, 10);
      return val;
    },
    z.number({ invalid_type_error: 'Must be a number' })
      .int({ message: 'Must be an integer' })
      .min(1, { message: 'Must be at least 1' })
      .nullable()
      .optional()
  ),
  textbookEndPage: z.preprocess(
    (val) => {
      if (val === '' || val === null) return null;
      if (val === undefined) return undefined;
      if (typeof val === 'string') return parseInt(val, 10);
      return val;
    },
    z.number({ invalid_type_error: 'Must be a number' })
      .int({ message: 'Must be an integer' })
      .min(1, { message: 'Must be at least 1' })
      .nullable()
      .optional()
  )
}).pick({
  textbookStartPage: true,
  textbookEndPage: true
}).partial();

export const updateLearningObjectivePagesSchema = baseLearningObjectivePagesSchema;

// Types
export type Level = typeof levels.$inferSelect;
export type InsertLevel = z.infer<typeof insertLevelSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type LevelSubject = typeof levelSubjects.$inferSelect;
export type InsertLevelSubject = z.infer<typeof insertLevelSubjectSchema>;
export type LearningObjective = typeof learningObjectives.$inferSelect;
export type InsertLearningObjective = z.infer<typeof insertLearningObjectiveSchema>;
export type WeeklyResource = typeof weeklyResources.$inferSelect;
export type InsertWeeklyResource = z.infer<typeof insertWeeklyResourceSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type ProgramCalendar = typeof programCalendar.$inferSelect;
export type InsertProgramCalendar = z.infer<typeof insertProgramCalendarSchema>;
export type ModuleEvaluation = typeof moduleEvaluations.$inferSelect;
export type InsertModuleEvaluation = z.infer<typeof insertModuleEvaluationSchema>;
export type EvaluationProgress = typeof evaluationProgress.$inferSelect;
export type InsertEvaluationProgress = z.infer<typeof insertEvaluationProgressSchema>;
