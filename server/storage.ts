import { 
  levels, subjects, levelSubjects, learningObjectives, weeklyResources,
  enrollments, studentProgress, weeklyCompletion, userProfiles,
  programCalendar, moduleEvaluations, evaluationProgress,
  type Level, type InsertLevel, type Subject, type InsertSubject,
  type LevelSubject, type InsertLevelSubject, type LearningObjective, type InsertLearningObjective,
  type WeeklyResource, type InsertWeeklyResource, type Enrollment, type InsertEnrollment,
  type StudentProgress, type InsertStudentProgress, type UserProfile, type InsertUserProfile,
  type ProgramCalendar, type InsertProgramCalendar, type ModuleEvaluation, type InsertModuleEvaluation,
  type EvaluationProgress, type InsertEvaluationProgress
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";

export interface IStorage {
  // Levels
  getLevels(): Promise<Level[]>;
  getLevelById(id: string): Promise<Level | undefined>;
  createLevel(level: InsertLevel): Promise<Level>;
  
  // Subjects
  getSubjects(): Promise<Subject[]>;
  getSubjectById(id: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Level-Subjects
  getLevelSubjects(levelId: string): Promise<(LevelSubject & { subject: Subject })[]>;
  getLevelSubjectById(id: string): Promise<LevelSubject | undefined>;
  createLevelSubject(ls: InsertLevelSubject): Promise<LevelSubject>;
  updateLevelSubjectTextbook(id: string, data: { textbookPdfUrl?: string | null; textbookTitle?: string | null }): Promise<LevelSubject | undefined>;
  
  // Learning Objectives
  getLearningObjectives(levelSubjectId: string): Promise<LearningObjective[]>;
  getLearningObjectiveById(id: string): Promise<LearningObjective | undefined>;
  createLearningObjective(lo: InsertLearningObjective): Promise<LearningObjective>;
  updateLearningObjectivePages(id: string, data: { textbookStartPage?: number; textbookEndPage?: number }): Promise<LearningObjective | undefined>;
  
  // Weekly Resources
  getResourcesByObjective(learningObjectiveId: string): Promise<WeeklyResource[]>;
  getResourceById(id: string): Promise<WeeklyResource | undefined>;
  createResource(resource: InsertWeeklyResource): Promise<WeeklyResource>;
  updateResource(id: string, resource: Partial<InsertWeeklyResource>): Promise<WeeklyResource | undefined>;
  
  // Enrollments
  getEnrollmentsByUser(userId: string): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  
  // Student Progress
  getProgressByUser(userId: string): Promise<StudentProgress[]>;
  markResourceComplete(progress: InsertStudentProgress): Promise<StudentProgress>;
  
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createOrUpdateUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  
  // Program Calendar
  getProgramCalendar(levelId: string): Promise<ProgramCalendar | undefined>;
  createProgramCalendar(calendar: InsertProgramCalendar): Promise<ProgramCalendar>;
  
  // Module Evaluations
  getModuleEvaluations(learningObjectiveId: string): Promise<ModuleEvaluation[]>;
  getModuleEvaluationById(id: string): Promise<ModuleEvaluation | undefined>;
  createModuleEvaluation(evaluation: InsertModuleEvaluation): Promise<ModuleEvaluation>;
  upsertEvaluationHtml(objectiveId: string, evaluationNumber: number, htmlContent: string): Promise<ModuleEvaluation>;
  getEvaluationHtml(objectiveId: string, evaluationNumber: number): Promise<ModuleEvaluation | undefined>;
  upsertEvaluationQuestions(
    objectiveId: string, 
    evaluationNumber: number, 
    questionsJson: string, 
    totalQuestions: number
  ): Promise<ModuleEvaluation>;
  
  // Evaluation Progress
  getEvaluationProgressByUser(userId: string, evaluationIds?: string[]): Promise<EvaluationProgress[]>;
  getUserCompletedModules(userId: string, levelSubjectId: string): Promise<number[]>;
  markEvaluationComplete(progress: InsertEvaluationProgress): Promise<EvaluationProgress>;
  saveEvaluationAttempt(
    userId: string,
    evaluationId: string,
    totalCorrect: number,
    totalQuestions: number,
    answersJson: string,
    passed: boolean
  ): Promise<EvaluationProgress>;
}

export class DatabaseStorage implements IStorage {
  // Levels
  async getLevels(): Promise<Level[]> {
    return db.select().from(levels).orderBy(levels.sortOrder);
  }

  async getLevelById(id: string): Promise<Level | undefined> {
    const [level] = await db.select().from(levels).where(eq(levels.id, id));
    return level;
  }

  async createLevel(level: InsertLevel): Promise<Level> {
    const [created] = await db.insert(levels).values(level).returning();
    return created;
  }

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return db.select().from(subjects);
  }

  async getSubjectById(id: string): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject;
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [created] = await db.insert(subjects).values(subject).returning();
    return created;
  }

  // Level-Subjects
  async getLevelSubjects(levelId: string): Promise<(LevelSubject & { subject: Subject })[]> {
    const result = await db
      .select({
        id: levelSubjects.id,
        levelId: levelSubjects.levelId,
        subjectId: levelSubjects.subjectId,
        totalOAs: levelSubjects.totalOAs,
        textbookPdfUrl: levelSubjects.textbookPdfUrl,
        textbookTitle: levelSubjects.textbookTitle,
        subject: subjects,
      })
      .from(levelSubjects)
      .innerJoin(subjects, eq(levelSubjects.subjectId, subjects.id))
      .where(eq(levelSubjects.levelId, levelId));
    
    return result.map(r => ({
      id: r.id,
      levelId: r.levelId,
      subjectId: r.subjectId,
      totalOAs: r.totalOAs,
      textbookPdfUrl: r.textbookPdfUrl,
      textbookTitle: r.textbookTitle,
      subject: r.subject,
    }));
  }

  async getLevelSubjectById(id: string): Promise<LevelSubject | undefined> {
    const [ls] = await db.select().from(levelSubjects).where(eq(levelSubjects.id, id));
    return ls;
  }

  async createLevelSubject(ls: InsertLevelSubject): Promise<LevelSubject> {
    const [created] = await db.insert(levelSubjects).values(ls).returning();
    return created;
  }

  async updateLevelSubjectTextbook(id: string, data: { textbookPdfUrl?: string | null; textbookTitle?: string | null }): Promise<LevelSubject | undefined> {
    // Filter out undefined values, but keep null values to allow clearing fields
    const updateData: Record<string, string | null> = {};
    if (data.textbookPdfUrl !== undefined) updateData.textbookPdfUrl = data.textbookPdfUrl;
    if (data.textbookTitle !== undefined) updateData.textbookTitle = data.textbookTitle;
    
    // If no values to update, just return the existing record
    if (Object.keys(updateData).length === 0) {
      const [existing] = await db.select().from(levelSubjects).where(eq(levelSubjects.id, id));
      return existing;
    }
    
    const [updated] = await db
      .update(levelSubjects)
      .set(updateData)
      .where(eq(levelSubjects.id, id))
      .returning();
    return updated;
  }

  // Learning Objectives
  async getLearningObjectives(levelSubjectId: string): Promise<LearningObjective[]> {
    return db.select().from(learningObjectives)
      .where(eq(learningObjectives.levelSubjectId, levelSubjectId))
      .orderBy(learningObjectives.weekNumber, learningObjectives.sortOrder);
  }

  async getLearningObjectiveById(id: string): Promise<LearningObjective | undefined> {
    const [lo] = await db.select().from(learningObjectives).where(eq(learningObjectives.id, id));
    return lo;
  }

  async createLearningObjective(lo: InsertLearningObjective): Promise<LearningObjective> {
    const [created] = await db.insert(learningObjectives).values(lo).returning();
    return created;
  }

  async updateLearningObjectivePages(id: string, data: { textbookStartPage?: number; textbookEndPage?: number }): Promise<LearningObjective | undefined> {
    const [updated] = await db
      .update(learningObjectives)
      .set(data)
      .where(eq(learningObjectives.id, id))
      .returning();
    return updated;
  }

  // Weekly Resources
  async getResourcesByObjective(learningObjectiveId: string): Promise<WeeklyResource[]> {
    return db.select().from(weeklyResources)
      .where(eq(weeklyResources.learningObjectiveId, learningObjectiveId))
      .orderBy(weeklyResources.sortOrder);
  }

  async getResourceById(id: string): Promise<WeeklyResource | undefined> {
    const [resource] = await db.select().from(weeklyResources).where(eq(weeklyResources.id, id));
    return resource;
  }

  async createResource(resource: InsertWeeklyResource): Promise<WeeklyResource> {
    const [created] = await db.insert(weeklyResources).values(resource).returning();
    return created;
  }

  async updateResource(id: string, resource: Partial<InsertWeeklyResource>): Promise<WeeklyResource | undefined> {
    const [updated] = await db
      .update(weeklyResources)
      .set({ ...resource, updatedAt: new Date() })
      .where(eq(weeklyResources.id, id))
      .returning();
    return updated;
  }

  // Enrollments
  async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [created] = await db.insert(enrollments).values(enrollment).returning();
    return created;
  }

  // Student Progress
  async getProgressByUser(userId: string): Promise<StudentProgress[]> {
    return db.select().from(studentProgress).where(eq(studentProgress.userId, userId));
  }

  async markResourceComplete(progress: InsertStudentProgress): Promise<StudentProgress> {
    const [created] = await db.insert(studentProgress).values(progress).returning();
    return created;
  }

  // User Profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createOrUpdateUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const existing = await this.getUserProfile(profile.userId);
    if (existing) {
      const [updated] = await db
        .update(userProfiles)
        .set(profile)
        .where(eq(userProfiles.userId, profile.userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  // Program Calendar
  async getProgramCalendar(levelId: string): Promise<ProgramCalendar | undefined> {
    const [calendar] = await db.select().from(programCalendar).where(eq(programCalendar.levelId, levelId));
    return calendar;
  }

  async createProgramCalendar(calendar: InsertProgramCalendar): Promise<ProgramCalendar> {
    const [created] = await db.insert(programCalendar).values(calendar).returning();
    return created;
  }

  // Module Evaluations
  async getModuleEvaluations(learningObjectiveId: string): Promise<ModuleEvaluation[]> {
    return db.select().from(moduleEvaluations)
      .where(eq(moduleEvaluations.learningObjectiveId, learningObjectiveId))
      .orderBy(moduleEvaluations.evaluationNumber);
  }

  async createModuleEvaluation(evaluation: InsertModuleEvaluation): Promise<ModuleEvaluation> {
    const [created] = await db.insert(moduleEvaluations).values(evaluation).returning();
    return created;
  }

  async upsertEvaluationHtml(objectiveId: string, evaluationNumber: number, htmlContent: string): Promise<ModuleEvaluation> {
    const existing = await db.select().from(moduleEvaluations)
      .where(and(
        eq(moduleEvaluations.learningObjectiveId, objectiveId),
        eq(moduleEvaluations.evaluationNumber, evaluationNumber)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      const [updated] = await db.update(moduleEvaluations)
        .set({ htmlContent })
        .where(eq(moduleEvaluations.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const releaseDay = evaluationNumber % 2 === 1 ? 3 : 5;
      const releaseWeek = evaluationNumber <= 2 ? 1 : 2;
      
      const [created] = await db.insert(moduleEvaluations).values({
        learningObjectiveId: objectiveId,
        evaluationNumber,
        title: `Evaluación Formativa ${evaluationNumber}`,
        releaseDay,
        releaseWeek,
        htmlContent,
      }).returning();
      return created;
    }
  }

  async getEvaluationHtml(objectiveId: string, evaluationNumber: number): Promise<ModuleEvaluation | undefined> {
    const [evaluation] = await db.select().from(moduleEvaluations)
      .where(and(
        eq(moduleEvaluations.learningObjectiveId, objectiveId),
        eq(moduleEvaluations.evaluationNumber, evaluationNumber)
      ))
      .limit(1);
    return evaluation;
  }

  async getModuleEvaluationById(id: string): Promise<ModuleEvaluation | undefined> {
    const [evaluation] = await db.select().from(moduleEvaluations)
      .where(eq(moduleEvaluations.id, id))
      .limit(1);
    return evaluation;
  }

  async upsertEvaluationQuestions(
    objectiveId: string, 
    evaluationNumber: number, 
    questionsJson: string, 
    totalQuestions: number
  ): Promise<ModuleEvaluation> {
    const existing = await db.select().from(moduleEvaluations)
      .where(and(
        eq(moduleEvaluations.learningObjectiveId, objectiveId),
        eq(moduleEvaluations.evaluationNumber, evaluationNumber)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      const [updated] = await db.update(moduleEvaluations)
        .set({ 
          questionsJson, 
          totalQuestions,
          passingScore: 60,
          generatedAt: new Date()
        })
        .where(eq(moduleEvaluations.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const releaseDay = evaluationNumber % 2 === 1 ? 3 : 5;
      const releaseWeek = evaluationNumber <= 2 ? 1 : 2;
      
      const [created] = await db.insert(moduleEvaluations).values({
        learningObjectiveId: objectiveId,
        evaluationNumber,
        title: `Evaluación Formativa ${evaluationNumber}`,
        releaseDay,
        releaseWeek,
        questionsJson,
        totalQuestions,
        passingScore: 60,
        generatedAt: new Date(),
      }).returning();
      return created;
    }
  }

  // Evaluation Progress
  async getEvaluationProgressByUser(userId: string, evaluationIds?: string[]): Promise<EvaluationProgress[]> {
    if (evaluationIds && evaluationIds.length > 0) {
      return db.select().from(evaluationProgress)
        .where(and(
          eq(evaluationProgress.userId, userId),
          inArray(evaluationProgress.evaluationId, evaluationIds)
        ));
    }
    return db.select().from(evaluationProgress)
      .where(eq(evaluationProgress.userId, userId));
  }

  async getUserCompletedModules(userId: string, levelSubjectId: string): Promise<number[]> {
    const objectivesForSubject = await db.select({ id: learningObjectives.id, weekNumber: learningObjectives.weekNumber })
      .from(learningObjectives)
      .where(eq(learningObjectives.levelSubjectId, levelSubjectId));
    
    if (objectivesForSubject.length === 0) return [];
    
    const objectiveIds = objectivesForSubject.map(o => o.id);
    
    const eval2s = await db.select()
      .from(moduleEvaluations)
      .where(and(
        inArray(moduleEvaluations.learningObjectiveId, objectiveIds),
        eq(moduleEvaluations.evaluationNumber, 2)
      ));
    
    if (eval2s.length === 0) return [];
    
    const eval2Ids = eval2s.map(e => e.id);
    
    const completedEvals = await db.select()
      .from(evaluationProgress)
      .where(and(
        eq(evaluationProgress.userId, userId),
        inArray(evaluationProgress.evaluationId, eval2Ids),
        eq(evaluationProgress.passed, true)
      ));
    
    const completedEvalIds = new Set(completedEvals.map(e => e.evaluationId));
    
    const completedModules: number[] = [];
    for (const eval2 of eval2s) {
      if (completedEvalIds.has(eval2.id)) {
        const objective = objectivesForSubject.find(o => o.id === eval2.learningObjectiveId);
        if (objective) {
          completedModules.push(objective.weekNumber);
        }
      }
    }
    
    return completedModules.sort((a, b) => a - b);
  }

  async markEvaluationComplete(progress: InsertEvaluationProgress): Promise<EvaluationProgress> {
    const [created] = await db.insert(evaluationProgress).values(progress).returning();
    return created;
  }

  async saveEvaluationAttempt(
    userId: string,
    evaluationId: string,
    totalCorrect: number,
    totalQuestions: number,
    answersJson: string,
    passed: boolean
  ): Promise<EvaluationProgress> {
    const score = Math.round((totalCorrect / totalQuestions) * 100);
    
    const [created] = await db.insert(evaluationProgress).values({
      userId,
      evaluationId,
      completedAt: new Date(),
      score,
      totalCorrect,
      totalQuestions,
      answersJson,
      passed,
    }).returning();
    return created;
  }

  async updateLearningObjectiveModuleInfo(
    id: string, 
    data: { moduleOAs?: string | null; moduleContents?: string | null; moduleDateRange?: string | null; wordDocUrl?: string | null }
  ): Promise<LearningObjective | undefined> {
    const [updated] = await db
      .update(learningObjectives)
      .set(data)
      .where(eq(learningObjectives.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
