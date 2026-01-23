import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { 
  insertLevelSchema, insertSubjectSchema, insertLevelSubjectSchema,
  insertLearningObjectiveSchema, insertWeeklyResourceSchema, insertStudentProgressSchema,
  insertEvaluationProgressSchema
} from "@shared/schema";
import { listRootFolders, listModuleFolders, getModuleResources, searchFolderByName } from "./googleDrive";
import { 
  getAllModulesSchedule, getModuleSchedule, getCalendarSummary, 
  isModuleAvailable, isEvaluationAvailable, DEFAULT_CONFIG, formatModuleDates 
} from "./calendarUtils";

// Admin authorization middleware - must be used after isAuthenticated
const isAdmin: RequestHandler = async (req: any, res, next) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const profile = await storage.getUserProfile(userId);
    if (!profile || profile.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Failed to verify admin status" });
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication (BEFORE registering other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // === PUBLIC ROUTES ===
  
  // Get all levels
  app.get("/api/levels", async (req, res) => {
    try {
      const allLevels = await storage.getLevels();
      res.json(allLevels);
    } catch (error) {
      console.error("Error fetching levels:", error);
      res.status(500).json({ message: "Failed to fetch levels" });
    }
  });

  // Get single level
  app.get("/api/levels/:id", async (req, res) => {
    try {
      const level = await storage.getLevelById(req.params.id);
      if (!level) {
        return res.status(404).json({ message: "Level not found" });
      }
      res.json(level);
    } catch (error) {
      console.error("Error fetching level:", error);
      res.status(500).json({ message: "Failed to fetch level" });
    }
  });

  // Get subjects for a level
  app.get("/api/levels/:levelId/subjects", async (req, res) => {
    try {
      const levelSubjects = await storage.getLevelSubjects(req.params.levelId);
      res.json(levelSubjects);
    } catch (error) {
      console.error("Error fetching level subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  // Get all subjects
  app.get("/api/subjects", async (req, res) => {
    try {
      const allSubjects = await storage.getSubjects();
      res.json(allSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  // Get learning objectives for a level-subject combination
  app.get("/api/level-subjects/:id/objectives", async (req, res) => {
    try {
      const objectives = await storage.getLearningObjectives(req.params.id);
      res.json(objectives);
    } catch (error) {
      console.error("Error fetching objectives:", error);
      res.status(500).json({ message: "Failed to fetch objectives" });
    }
  });

  // Get resources for a learning objective
  app.get("/api/objectives/:id/resources", async (req, res) => {
    try {
      const resources = await storage.getResourcesByObjective(req.params.id);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // === PROTECTED ROUTES (require authentication) ===

  // Get user profile
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile || { role: "student" });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Get user's enrollments
  app.get("/api/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userEnrollments = await storage.getEnrollmentsByUser(userId);
      res.json(userEnrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Get user's progress
  app.get("/api/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getProgressByUser(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Mark resource as complete
  app.post("/api/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertStudentProgressSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const progress = await storage.markResourceComplete(parsed.data);
      res.json(progress);
    } catch (error) {
      console.error("Error saving progress:", error);
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  // === ADMIN ROUTES (require admin role) ===

  // Create level (admin only)
  app.post("/api/admin/levels", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const parsed = insertLevelSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const level = await storage.createLevel(parsed.data);
      res.json(level);
    } catch (error) {
      console.error("Error creating level:", error);
      res.status(500).json({ message: "Failed to create level" });
    }
  });

  // Create subject (admin only)
  app.post("/api/admin/subjects", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const parsed = insertSubjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const subject = await storage.createSubject(parsed.data);
      res.json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  // Create level-subject association (admin only)
  app.post("/api/admin/level-subjects", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const parsed = insertLevelSubjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const ls = await storage.createLevelSubject(parsed.data);
      res.json(ls);
    } catch (error) {
      console.error("Error creating level-subject:", error);
      res.status(500).json({ message: "Failed to create level-subject" });
    }
  });

  // Create learning objective (admin only)
  app.post("/api/admin/objectives", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const parsed = insertLearningObjectiveSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const objective = await storage.createLearningObjective(parsed.data);
      res.json(objective);
    } catch (error) {
      console.error("Error creating objective:", error);
      res.status(500).json({ message: "Failed to create objective" });
    }
  });

  // Create resource (admin only)
  app.post("/api/admin/resources", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const parsed = insertWeeklyResourceSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const resource = await storage.createResource(parsed.data);
      res.json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Update resource (admin only)
  app.patch("/api/admin/resources/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const resource = await storage.updateResource(req.params.id, req.body);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error updating resource:", error);
      res.status(500).json({ message: "Failed to update resource" });
    }
  });

  // Seed initial data endpoint (admin only - for development)
  app.post("/api/admin/seed", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      // Seed levels (15 sesiones, cada sesión planificada para 2 semanas)
      const levelsData = [
        { id: "7b", name: "7° Básico", programType: "menores" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 1 },
        { id: "8b", name: "8° Básico", programType: "menores" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 2 },
        { id: "1m", name: "1° Medio", programType: "menores" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 3 },
        { id: "2m", name: "2° Medio", programType: "menores" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 4 },
        { id: "3m", name: "3° Medio", programType: "menores" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 5 },
        { id: "4m", name: "4° Medio", programType: "menores" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 6 },
        { id: "nb1", name: "NB1 (1-4)", programType: "adultos" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 7 },
        { id: "nb2", name: "NB2 (5-6)", programType: "adultos" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 8 },
        { id: "nb3", name: "NB3 (7-8)", programType: "adultos" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 9 },
        { id: "nm1", name: "NM1 (1-2 Media)", programType: "adultos" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 10 },
        { id: "nm2", name: "NM2 (3-4 Media)", programType: "adultos" as const, totalWeeks: 15, cadencePerOA: "2 sem/sesión", sortOrder: 11 },
      ];

      for (const level of levelsData) {
        try {
          await storage.createLevel(level);
        } catch (e) {
          // Ignore duplicate key errors
        }
      }

      // Seed subjects
      const subjectsData = [
        { name: "Lengua y Literatura", slug: "lengua-y-literatura", description: "Comunicación, lectura y escritura" },
        { name: "Matemática", slug: "matematica", description: "Álgebra, geometría y estadística" },
        { name: "Ciencias Naturales", slug: "ciencias-naturales", description: "Física, química y biología" },
        { name: "Historia", slug: "historia", description: "Historia, geografía y ciencias sociales" },
        { name: "Inglés", slug: "ingles", description: "Idioma inglés" },
        { name: "Educación Ciudadana", slug: "educacion-ciudadana", description: "Formación ciudadana" },
        { name: "Filosofía", slug: "filosofia", description: "Pensamiento crítico y ética" },
      ];

      const createdSubjects: any[] = [];
      for (const subject of subjectsData) {
        try {
          const created = await storage.createSubject(subject);
          createdSubjects.push(created);
        } catch (e) {
          // Ignore duplicate key errors
        }
      }

      res.json({ message: "Seed completed", levels: levelsData.length, subjects: subjectsData.length });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ message: "Failed to seed data" });
    }
  });

  // === GOOGLE DRIVE INTEGRATION ROUTES ===

  // List all folders in Google Drive (admin only)
  app.get("/api/admin/drive/folders", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const folders = await listRootFolders();
      res.json(folders);
    } catch (error) {
      console.error("Error listing Drive folders:", error);
      res.status(500).json({ message: "Failed to list Drive folders" });
    }
  });

  // Search folder by name (admin only)
  app.get("/api/admin/drive/search", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const folderName = req.query.name as string;
      if (!folderName) {
        return res.status(400).json({ message: "Folder name is required" });
      }
      const folder = await searchFolderByName(folderName);
      res.json(folder);
    } catch (error) {
      console.error("Error searching Drive folder:", error);
      res.status(500).json({ message: "Failed to search folder" });
    }
  });

  // List modules in a subject folder (admin only)
  app.get("/api/admin/drive/folders/:folderId/modules", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const modules = await listModuleFolders(req.params.folderId);
      res.json(modules);
    } catch (error) {
      console.error("Error listing modules:", error);
      res.status(500).json({ message: "Failed to list modules" });
    }
  });

  // Get resources from a specific folder (admin only)
  app.get("/api/admin/drive/folders/:folderId/resources", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const resources = await getModuleResources(req.params.folderId);
      res.json(resources);
    } catch (error) {
      console.error("Error getting resources:", error);
      res.status(500).json({ message: "Failed to get resources" });
    }
  });

  // Sync resources from Drive folder to a learning objective (admin only)
  app.post("/api/admin/drive/sync", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { folderId, learningObjectiveId, moduleNumber } = req.body;
      
      if (!folderId || !learningObjectiveId) {
        return res.status(400).json({ message: "folderId and learningObjectiveId are required" });
      }

      const resources = await getModuleResources(folderId);
      const createdResources: any[] = [];

      const resourceTypeOrder: Record<string, number> = {
        'video': 1,
        'image': 2,
        'audio': 3,
        'slides': 4,
        'document': 5,
        'form': 6,
        'unknown': 7
      };

      const sortedResources = [...resources].sort((a, b) => {
        return (resourceTypeOrder[a.type] || 99) - (resourceTypeOrder[b.type] || 99);
      });

      for (let i = 0; i < sortedResources.length; i++) {
        const resource = sortedResources[i];
        
        const resourceTypeMap: Record<string, string> = {
          'video': 'video',
          'audio': 'audio',
          'image': 'infografia',
          'slides': 'presentacion',
          'document': 'resumen',
          'form': 'cuestionario'
        };

        const created = await storage.createResource({
          learningObjectiveId: learningObjectiveId,
          resourceType: resourceTypeMap[resource.type] as any || 'resumen',
          title: resource.name,
          notebookLmUrl: resource.embedUrl,
          sortOrder: i + 1
        });
        createdResources.push(created);
      }

      res.json({ 
        message: "Sync completed", 
        resourcesCreated: createdResources.length,
        resources: createdResources
      });
    } catch (error) {
      console.error("Error syncing resources:", error);
      res.status(500).json({ message: "Failed to sync resources" });
    }
  });

  // === CALENDAR AND MODULE ACCESS ROUTES ===

  // Get calendar summary
  app.get("/api/calendar/summary", async (req, res) => {
    try {
      const summary = getCalendarSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error getting calendar summary:", error);
      res.status(500).json({ message: "Failed to get calendar summary" });
    }
  });

  // Get all modules schedule for a level-subject (with access control)
  app.get("/api/level-subjects/:id/calendar", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const levelSubjectId = req.params.id;
      const currentDate = new Date();

      const completedModules = await storage.getUserCompletedModules(userId, levelSubjectId);
      const objectives = await storage.getLearningObjectives(levelSubjectId);
      
      const modulesSchedule = getAllModulesSchedule(currentDate, completedModules);
      
      const modulesWithDetails = modulesSchedule.map(schedule => {
        const objective = objectives.find(o => o.weekNumber === schedule.moduleNumber);
        const dates = formatModuleDates(schedule);
        
        return {
          ...schedule,
          ...dates,
          objective: objective ? {
            id: objective.id,
            code: objective.code,
            title: objective.title,
            description: objective.description,
          } : null,
        };
      });

      res.json({
        levelSubjectId,
        modules: modulesWithDetails,
        summary: getCalendarSummary(),
      });
    } catch (error) {
      console.error("Error getting calendar:", error);
      res.status(500).json({ message: "Failed to get calendar" });
    }
  });

  // Check if a specific module is accessible
  app.get("/api/modules/:moduleNumber/access", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const moduleNumber = parseInt(req.params.moduleNumber);
      const levelSubjectId = req.query.levelSubjectId as string;
      
      if (!levelSubjectId) {
        return res.status(400).json({ message: "levelSubjectId is required" });
      }

      const currentDate = new Date();
      const completedModules = await storage.getUserCompletedModules(userId, levelSubjectId);
      
      const previousCompleted = moduleNumber === 1 || completedModules.includes(moduleNumber - 1);
      const isAvailable = isModuleAvailable(moduleNumber, currentDate, previousCompleted);
      
      const schedule = getModuleSchedule(moduleNumber, currentDate, previousCompleted, completedModules.includes(moduleNumber));
      const dates = formatModuleDates(schedule);

      res.json({
        ...schedule,
        ...dates,
        reason: !schedule.isAvailable 
          ? (schedule.daysUntilStart > 0 
              ? `Disponible en ${schedule.daysUntilStart} días` 
              : "Completa el módulo anterior primero")
          : null,
      });
    } catch (error) {
      console.error("Error checking module access:", error);
      res.status(500).json({ message: "Failed to check module access" });
    }
  });

  // Check evaluation availability
  app.get("/api/modules/:moduleNumber/evaluations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const moduleNumber = parseInt(req.params.moduleNumber);
      const levelSubjectId = req.query.levelSubjectId as string;
      const currentDate = new Date();

      if (!levelSubjectId) {
        return res.status(400).json({ message: "levelSubjectId is required" });
      }

      const objectives = await storage.getLearningObjectives(levelSubjectId);
      const objective = objectives.find(o => o.weekNumber === moduleNumber);
      
      if (!objective) {
        return res.status(404).json({ message: "Module not found" });
      }

      const evaluations = await storage.getModuleEvaluations(objective.id);
      const userProgress = await storage.getEvaluationProgressByUser(userId, evaluations.map(e => e.id));
      
      const schedule = getModuleSchedule(moduleNumber, currentDate, true, false);

      const evaluationsWithStatus = [
        {
          number: 1,
          title: "Evaluación Formativa 1",
          releaseDate: schedule.evaluation1ReleaseDate,
          releaseDateFormatted: formatModuleDates(schedule).eval1Formatted,
          isAvailable: isEvaluationAvailable(moduleNumber, 1, currentDate),
          evaluation: evaluations.find(e => e.evaluationNumber === 1),
          completed: userProgress.some(p => evaluations.find(e => e.evaluationNumber === 1 && e.id === p.evaluationId)),
        },
        {
          number: 2,
          title: "Evaluación Formativa 2",
          releaseDate: schedule.evaluation2ReleaseDate,
          releaseDateFormatted: formatModuleDates(schedule).eval2Formatted,
          isAvailable: isEvaluationAvailable(moduleNumber, 2, currentDate),
          evaluation: evaluations.find(e => e.evaluationNumber === 2),
          completed: userProgress.some(p => evaluations.find(e => e.evaluationNumber === 2 && e.id === p.evaluationId) && p.passed),
        },
      ];

      res.json({
        moduleNumber,
        objectiveId: objective.id,
        evaluations: evaluationsWithStatus,
      });
    } catch (error) {
      console.error("Error getting evaluations:", error);
      res.status(500).json({ message: "Failed to get evaluations" });
    }
  });

  // Mark evaluation as complete
  app.post("/api/evaluations/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const evaluationId = req.params.id;
      const { score, passed } = req.body;

      const progress = await storage.markEvaluationComplete({
        userId,
        evaluationId,
        completedAt: new Date(),
        score: score || null,
        passed: passed !== undefined ? passed : true,
      });

      res.json(progress);
    } catch (error) {
      console.error("Error completing evaluation:", error);
      res.status(500).json({ message: "Failed to complete evaluation" });
    }
  });

  // Update textbook PDF for a level-subject
  app.put("/api/admin/level-subjects/:id/textbook", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { textbookPdfUrl, textbookTitle } = req.body;
      
      const updated = await storage.updateLevelSubjectTextbook(id, { textbookPdfUrl, textbookTitle });
      if (!updated) {
        return res.status(404).json({ message: "Level subject not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating textbook:", error);
      res.status(500).json({ message: "Failed to update textbook" });
    }
  });

  // Update page range for a learning objective (module)
  app.put("/api/admin/learning-objectives/:id/pages", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { textbookStartPage, textbookEndPage } = req.body;
      
      const updated = await storage.updateLearningObjectivePages(id, { 
        textbookStartPage: textbookStartPage ? Number(textbookStartPage) : undefined, 
        textbookEndPage: textbookEndPage ? Number(textbookEndPage) : undefined 
      });
      if (!updated) {
        return res.status(404).json({ message: "Learning objective not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating page range:", error);
      res.status(500).json({ message: "Failed to update page range" });
    }
  });

  // Get textbook info for a module
  app.get("/api/level-subjects/:id/textbook", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { moduleNumber } = req.query;
      
      const levelSubject = await storage.getLevelSubjectById(id);
      if (!levelSubject) {
        return res.status(404).json({ message: "Level subject not found" });
      }
      
      let modulePages = null;
      if (moduleNumber) {
        const objectives = await storage.getLearningObjectives(id);
        const objective = objectives.find(o => o.weekNumber === Number(moduleNumber));
        if (objective) {
          modulePages = {
            startPage: objective.textbookStartPage,
            endPage: objective.textbookEndPage
          };
        }
      }
      
      res.json({
        textbookPdfUrl: levelSubject.textbookPdfUrl,
        textbookTitle: levelSubject.textbookTitle,
        modulePages
      });
    } catch (error) {
      console.error("Error getting textbook info:", error);
      res.status(500).json({ message: "Failed to get textbook info" });
    }
  });

  return httpServer;
}
