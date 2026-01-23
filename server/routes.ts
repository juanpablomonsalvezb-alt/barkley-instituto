import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { 
  insertLevelSchema, insertSubjectSchema, insertLevelSubjectSchema,
  insertLearningObjectiveSchema, insertWeeklyResourceSchema, insertStudentProgressSchema
} from "@shared/schema";

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

  return httpServer;
}
