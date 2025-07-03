import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema, insertCharacterSchema, insertLocationSchema,
  insertTimelineEventSchema, insertMagicSystemSchema, insertLoreEntrySchema,
  insertNoteSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsWithStats();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
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

  app.post("/api/projects/:projectId/characters", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const validatedData = insertCharacterSchema.parse({ ...req.body, projectId });
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      console.error("Character creation error:", error);
      res.status(400).json({ message: "Invalid character data" });
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

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.getLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch location" });
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

  app.put("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, validatedData);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(400).json({ message: "Invalid location data" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLocation(id);
      if (!deleted) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete location" });
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

  app.get("/api/timeline-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getTimelineEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Timeline event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline event" });
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

  app.put("/api/timeline-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTimelineEventSchema.partial().parse(req.body);
      const event = await storage.updateTimelineEvent(id, validatedData);
      if (!event) {
        return res.status(404).json({ message: "Timeline event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid timeline event data" });
    }
  });

  app.delete("/api/timeline-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTimelineEvent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Timeline event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete timeline event" });
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
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Valid project ID is required" });
      }

      const magicSystems = await storage.getMagicSystems(projectId);

      res.json(magicSystems);
    } catch (error) {
      console.error("Error fetching magic systems:", error);
      res.status(500).json({ error: "Failed to fetch magic systems" });
    }
  });

  // Get characters connected to a magic system
  app.get("/api/magic-systems/:id/characters", async (req, res) => {
    try {
      const magicSystemId = parseInt(req.params.id);
      const magicSystem = await storage.getMagicSystem(magicSystemId);
      if (!magicSystem) {
        return res.status(404).json({ message: "Magic system not found" });
      }
      const projectId = magicSystem.projectId;

      // Get all characters in the project
      const allCharacters = await storage.getCharacters(projectId);
      
      // Filter characters that have this magic system in their powerSystems array
      const connectedCharacters = allCharacters.filter(character => 
        character.powerSystems && 
        Array.isArray(character.powerSystems) && 
        character.powerSystems.includes(magicSystem.name)
      );

      res.json(connectedCharacters);
    } catch (error) {
      console.error("Error fetching connected characters:", error);
      res.status(500).json({ error: "Failed to fetch connected characters" });
    }
  });

  // Get magic systems for a character
  app.get("/api/characters/:id/magic-systems", async (req, res) => {
    try {
      const characterId = parseInt(req.params.id);
      const relationships = await storage.getCharacterMagicSystems(characterId);
      res.json(relationships);
    } catch (error) {
      console.error("Error fetching character magic systems:", error);
      res.status(500).json({ error: "Failed to fetch character magic systems" });
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

  // Lore Entries
  app.get("/api/lore-entries", async (req, res) => {
    try {
      const projectId = parseInt(req.query.projectId as string);
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
      const loreEntries = await storage.getLoreEntries(projectId);
      res.json(loreEntries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lore entries" });
    }
  });

  app.get("/api/lore-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const loreEntry = await storage.getLoreEntry(id);
      if (!loreEntry) {
        return res.status(404).json({ message: "Lore entry not found" });
      }
      res.json(loreEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lore entry" });
    }
  });

  app.post("/api/lore-entries", async (req, res) => {
    try {
      const loreEntry = await storage.createLoreEntry(req.body);
      res.status(201).json(loreEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to create lore entry" });
    }
  });

  app.put("/api/lore-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const loreEntry = await storage.updateLoreEntry(id, req.body);
      if (!loreEntry) {
        return res.status(404).json({ message: "Lore entry not found" });
      }
      res.json(loreEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lore entry" });
    }
  });

  app.delete("/api/lore-entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLoreEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Lore entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete lore entry" });
    }
  });

  // Notes
  app.get("/api/projects/:projectId/notes", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const notes = await storage.getNotes(projectId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes", async (req, res) => {
    try {
      const projectId = parseInt(req.query.projectId as string);
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
      const notes = await storage.getNotes(projectId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNote(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(id, validatedData);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNote(id);
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
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