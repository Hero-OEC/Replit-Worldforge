import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, insertCharacterSchema, insertLocationSchema,
  insertTimelineEventSchema, insertMagicSystemSchema, insertLoreEntrySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsWithStats();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProjectWithStats(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Characters
  app.get("/api/projects/:projectId/characters", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const characters = await storage.getCharacters(projectId);
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.getCharacter(id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  app.post("/api/characters", async (req, res) => {
    try {
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      res.status(400).json({ message: "Invalid character data" });
    }
  });

  app.put("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCharacterSchema.partial().parse(req.body);
      const character = await storage.updateCharacter(id, validatedData);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(400).json({ message: "Invalid character data" });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCharacter(id);
      if (!deleted) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete character" });
    }
  });

  // Get characters by query parameter (for magic system detail page)
  app.get("/api/characters", async (req, res) => {
    try {
      const projectId = parseInt(req.query.projectId as string);
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
      const characters = await storage.getCharacters(projectId);
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  // Locations
  app.get("/api/projects/:projectId/locations", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const locations = await storage.getLocations(projectId);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const validatedData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(validatedData);
      res.status(201).json(location);
    } catch (error) {
      res.status(400).json({ message: "Invalid location data" });
    }
  });

  // Timeline Events
  app.get("/api/projects/:projectId/timeline", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const events = await storage.getTimelineEvents(projectId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });

  app.post("/api/timeline-events", async (req, res) => {
    try {
      const validatedData = insertTimelineEventSchema.parse(req.body);
      const event = await storage.createTimelineEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid timeline event data" });
    }
  });

  // Magic Systems
  app.get("/api/projects/:projectId/magic-systems", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const systems = await storage.getMagicSystems(projectId);
      res.json(systems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch magic systems" });
    }
  });

  app.get("/api/magic-systems", async (req, res) => {
    try {
      const projectId = parseInt(req.query.projectId as string);
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
      const systems = await storage.getMagicSystems(projectId);
      res.json(systems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch magic systems" });
    }
  });

  app.get("/api/magic-systems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const system = await storage.getMagicSystem(id);
      if (!system) {
        return res.status(404).json({ message: "Magic system not found" });
      }
      res.json(system);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch magic system" });
    }
  });

  app.post("/api/magic-systems", async (req, res) => {
    try {
      const validatedData = insertMagicSystemSchema.parse(req.body);
      const system = await storage.createMagicSystem(validatedData);
      res.status(201).json(system);
    } catch (error) {
      res.status(400).json({ message: "Invalid magic system data" });
    }
  });

  app.put("/api/magic-systems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMagicSystemSchema.partial().parse(req.body);
      const system = await storage.updateMagicSystem(id, validatedData);
      if (!system) {
        return res.status(404).json({ message: "Magic system not found" });
      }
      res.json(system);
    } catch (error) {
      res.status(400).json({ message: "Invalid magic system data" });
    }
  });

  app.delete("/api/magic-systems/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMagicSystem(id);
      if (!success) {
        return res.status(404).json({ message: "Magic system not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete magic system" });
    }
  });

  // Lore Entries
  app.get("/api/projects/:projectId/lore", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const entries = await storage.getLoreEntries(projectId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lore entries" });
    }
  });

  app.post("/api/lore-entries", async (req, res) => {
    try {
      const validatedData = insertLoreEntrySchema.parse(req.body);
      const entry = await storage.createLoreEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid lore entry data" });
    }
  });

  // Edit History
  app.get("/api/edit-history", async (req, res) => {
    try {
      const projectId = parseInt(req.query.projectId as string);
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
      const history = await storage.getEditHistory(projectId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch edit history" });
    }
  });

  // Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getOverallStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
