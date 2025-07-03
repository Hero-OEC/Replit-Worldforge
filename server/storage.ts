import { 
  projects, characters, locations, timelineEvents, magicSystems, loreEntries, notes, editHistory,
  type Project, type InsertProject, type Character, type InsertCharacter,
  type Location, type InsertLocation, type TimelineEvent, type InsertTimelineEvent,
  type MagicSystem, type InsertMagicSystem, type LoreEntry, type InsertLoreEntry,
  type Note, type InsertNote, type EditHistory, type InsertEditHistory,
  type ProjectWithStats, type ProjectStats
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectWithStats(id: number): Promise<ProjectWithStats | undefined>;
  getProjectsWithStats(): Promise<ProjectWithStats[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Characters
  getCharacters(projectId: number): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, character: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: number): Promise<boolean>;

  // Locations
  getLocations(projectId: number): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;

  // Timeline Events
  getTimelineEvents(projectId: number): Promise<TimelineEvent[]>;
  getTimelineEvent(id: number): Promise<TimelineEvent | undefined>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
  updateTimelineEvent(id: number, event: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined>;
  deleteTimelineEvent(id: number): Promise<boolean>;

  // Magic Systems
  getMagicSystems(projectId: number): Promise<MagicSystem[]>;
  getMagicSystem(id: number): Promise<MagicSystem | undefined>;
  createMagicSystem(system: InsertMagicSystem): Promise<MagicSystem>;
  updateMagicSystem(id: number, system: Partial<InsertMagicSystem>): Promise<MagicSystem | undefined>;
  deleteMagicSystem(id: number): Promise<boolean>;

  // Character Magic Systems relationships
  getCharacterMagicSystems(characterId: number): Promise<any[]>;

  // Lore Entries
  getLoreEntries(projectId: number): Promise<LoreEntry[]>;
  getLoreEntry(id: number): Promise<LoreEntry | undefined>;
  createLoreEntry(entry: InsertLoreEntry): Promise<LoreEntry>;
  updateLoreEntry(id: number, entry: Partial<InsertLoreEntry>): Promise<LoreEntry | undefined>;
  deleteLoreEntry(id: number): Promise<boolean>;

  // Notes
  getNotes(projectId: number): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;

  // Edit History
  getEditHistory(projectId: number): Promise<EditHistory[]>;
  createEditHistory(entry: InsertEditHistory): Promise<EditHistory>;

  // Stats
  getOverallStats(): Promise<{
    totalProjects: number;
    totalCharacters: number;
    totalLocations: number;
    totalEvents: number;
  }>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project> = new Map();
  private characters: Map<number, Character> = new Map();
  private locations: Map<number, Location> = new Map();
  private timelineEvents: Map<number, TimelineEvent> = new Map();
  private magicSystems: Map<number, MagicSystem> = new Map();
  private loreEntries: Map<number, LoreEntry> = new Map();
  private notes: Map<number, Note> = new Map();
  private editHistory: Map<number, EditHistory> = new Map();

  private currentProjectId = 1;
  private currentCharacterId = 1;
  private currentLocationId = 1;
  private currentTimelineEventId = 1;
  private currentMagicSystemId = 1;
  private currentLoreEntryId = 1;
  private currentNoteId = 1;
  private currentEditHistoryId = 1;

  constructor() {
    this.seedSampleData();
  }

  private seedSampleData() {
    // Initialize with empty data - no hardcoded sample content
    this.currentProjectId = 1;
    this.currentCharacterId = 1;
    this.currentLocationId = 1;
    this.currentTimelineEventId = 1;
    this.currentMagicSystemId = 1;
    this.currentLoreEntryId = 1;
    this.currentNoteId = 1;
    this.currentEditHistoryId = 1;

    // Add sample notes data for testing
    this.notes.set(1, {
      id: 1,
      title: "Character Development Ideas",
      content: "Elena needs a stronger motivation for pursuing shadow magic. Consider adding a family tragedy that drives her quest for power. Perhaps her younger brother was killed by someone who used corrupted light magic.",
      category: "Characters",
      tags: "Elena,motivation,backstory",
      projectId: 1,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000),
    });

    this.notes.set(2, {
      id: 2,
      title: "Plot Twist Concepts",
      content: "What if Marcus Shadowbane is actually Elena's father? This would explain his protective nature and deep knowledge of shadow magic. The revelation could come during the confrontation with Lord Vex.",
      category: "Plot",
      tags: "plot twist,Marcus,Elena,family",
      projectId: 1,
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000),
    });

    this.notes.set(3, {
      id: 3,
      title: "Magic System Balance",
      content: "The shadow magic system needs more limitations to prevent it from being overpowered. Consider: 1) Physical exhaustion after use, 2) Risk of corruption with overuse, 3) Inability to use in pure light environments.",
      category: "World Building",
      tags: "magic system,balance,limitations",
      projectId: 1,
      createdAt: new Date(Date.now() - 259200000), // 3 days ago
      updatedAt: new Date(Date.now() - 259200000),
    });

    this.currentNoteId = 4;
  }
  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectWithStats(id: number): Promise<ProjectWithStats | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const stats = await this.getProjectStats(id);
    return { ...project, stats };
  }

  async getProjectsWithStats(): Promise<ProjectWithStats[]> {
    const projects = await this.getProjects();
    const projectsWithStats: ProjectWithStats[] = [];

    for (const project of projects) {
      const stats = await this.getProjectStats(project.id);
      projectsWithStats.push({ ...project, stats });
    }

    return projectsWithStats;
  }

  private async getProjectStats(projectId: number): Promise<ProjectStats> {
    const charactersCount = Array.from(this.characters.values()).filter(c => c.projectId === projectId).length;
    const locationsCount = Array.from(this.locations.values()).filter(l => l.projectId === projectId).length;
    const eventsCount = Array.from(this.timelineEvents.values()).filter(e => e.projectId === projectId).length;
    const magicSystemsCount = Array.from(this.magicSystems.values()).filter(m => m.projectId === projectId).length;
    const loreEntriesCount = Array.from(this.loreEntries.values()).filter(l => l.projectId === projectId).length;

    return {
      charactersCount,
      locationsCount,
      eventsCount,
      magicSystemsCount,
      loreEntriesCount,
    };
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const now = new Date();
    const project: Project = {
      id: this.currentProjectId++,
      ...insertProject,
      status: insertProject.status || "active",
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    // Delete all related data
    Array.from(this.characters.entries())
      .filter(([, character]) => character.projectId === id)
      .forEach(([charId]) => this.characters.delete(charId));

    Array.from(this.locations.entries())
      .filter(([, location]) => location.projectId === id)
      .forEach(([locId]) => this.locations.delete(locId));

    Array.from(this.timelineEvents.entries())
      .filter(([, event]) => event.projectId === id)
      .forEach(([eventId]) => this.timelineEvents.delete(eventId));

    Array.from(this.magicSystems.entries())
      .filter(([, system]) => system.projectId === id)
      .forEach(([systemId]) => this.magicSystems.delete(systemId));

    Array.from(this.loreEntries.entries())
      .filter(([, entry]) => entry.projectId === id)
      .forEach(([entryId]) => this.loreEntries.delete(entryId));

    return this.projects.delete(id);
  }

  // Characters
  async getCharacters(projectId: number): Promise<Character[]> {
    return Array.from(this.characters.values())
      .filter(character => character.projectId === projectId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const now = new Date();
    const character: Character = {
      id: this.currentCharacterId++,
      ...insertCharacter,
      description: insertCharacter.description || null,
      appearance: insertCharacter.appearance || null,
      personality: insertCharacter.personality || null,
      backstory: insertCharacter.backstory || null,
      role: insertCharacter.role || null,
      powerSystems: insertCharacter.powerSystems || [],
      createdAt: now,
      updatedAt: now,
    };
    this.characters.set(character.id, character);
    return character;
  }

  async updateCharacter(id: number, updates: Partial<InsertCharacter>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;

    const updatedCharacter: Character = {
      ...character,
      ...updates,
      powerSystems: updates.powerSystems || character.powerSystems,
      updatedAt: new Date(),
    };
    this.characters.set(id, updatedCharacter);
    return updatedCharacter;
  }

  async deleteCharacter(id: number): Promise<boolean> {
    return this.characters.delete(id);
  }

  // Locations
  async getLocations(projectId: number): Promise<Location[]> {
    return Array.from(this.locations.values())
      .filter(location => location.projectId === projectId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const now = new Date();
    const location: Location = {
      id: this.currentLocationId++,
      ...insertLocation,
      description: insertLocation.description || null,
      geography: insertLocation.geography || null,
      culture: insertLocation.culture || null,
      significance: insertLocation.significance || null,
      createdAt: now,
      updatedAt: now,
    };
    this.locations.set(location.id, location);
    return location;
  }

  async updateLocation(id: number, updates: Partial<InsertLocation>): Promise<Location | undefined> {
    const location = this.locations.get(id);
    if (!location) return undefined;

    const updatedLocation: Location = {
      ...location,
      ...updates,
      updatedAt: new Date(),
    };
    this.locations.set(id, updatedLocation);
    return updatedLocation;
  }

  async deleteLocation(id: number): Promise<boolean> {
    return this.locations.delete(id);
  }

  // Timeline Events
  async getTimelineEvents(projectId: number): Promise<TimelineEvent[]> {
    return Array.from(this.timelineEvents.values())
      .filter(event => event.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async getTimelineEvent(id: number): Promise<TimelineEvent | undefined> {
    return this.timelineEvents.get(id);
  }

  async createTimelineEvent(insertEvent: InsertTimelineEvent): Promise<TimelineEvent> {
    const now = new Date();
    const event: TimelineEvent = {
      id: this.currentTimelineEventId++,
      ...insertEvent,
      description: insertEvent.description || null,
      date: insertEvent.date || null,
      category: insertEvent.category || null,
      order: insertEvent.order || 0,
      createdAt: now,
      updatedAt: now,
    };
    this.timelineEvents.set(event.id, event);
    return event;
  }

  async updateTimelineEvent(id: number, updates: Partial<InsertTimelineEvent>): Promise<TimelineEvent | undefined> {
    const event = this.timelineEvents.get(id);
    if (!event) return undefined;

    const updatedEvent: TimelineEvent = {
      ...event,
      ...updates,
      updatedAt: new Date(),
    };
    this.timelineEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteTimelineEvent(id: number): Promise<boolean> {
    return this.timelineEvents.delete(id);
  }

  // Magic Systems
  async getMagicSystems(projectId: number): Promise<MagicSystem[]> {
    return Array.from(this.magicSystems.values())
      .filter(system => system.projectId === projectId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getMagicSystem(id: number): Promise<MagicSystem | undefined> {
    return this.magicSystems.get(id);
  }

  async createMagicSystem(insertSystem: InsertMagicSystem): Promise<MagicSystem> {
    const now = new Date();
    const system: MagicSystem = {
      id: this.currentMagicSystemId++,
      projectId: insertSystem.projectId,
      name: insertSystem.name,
      category: insertSystem.category ?? "magic",
      description: insertSystem.description || null,
      rules: insertSystem.rules || null,
      limitations: insertSystem.limitations || null,
      source: insertSystem.source || null,
      cost: insertSystem.cost || null,
      createdAt: now,
      updatedAt: now,
    };
    this.magicSystems.set(system.id, system);
    return system;
  }

  async updateMagicSystem(id: number, updates: Partial<InsertMagicSystem>): Promise<MagicSystem | undefined> {
    const system = this.magicSystems.get(id);
    if (!system) return undefined;

    const updatedSystem: MagicSystem = {
      ...system,
      ...updates,
      updatedAt: new Date(),
    };
    this.magicSystems.set(id, updatedSystem);
    return updatedSystem;
  }

  async deleteMagicSystem(id: number): Promise<boolean> {
    return this.magicSystems.delete(id);
  }

  // Lore Entries
  async getLoreEntries(projectId: number): Promise<LoreEntry[]> {
    return Array.from(this.loreEntries.values())
      .filter(entry => entry.projectId === projectId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getLoreEntry(id: number): Promise<LoreEntry | undefined> {
    return this.loreEntries.get(id);
  }

  async createLoreEntry(insertEntry: InsertLoreEntry): Promise<LoreEntry> {
    const now = new Date();
    const entry: LoreEntry = {
      id: this.currentLoreEntryId++,
      ...insertEntry,
      content: insertEntry.content || null,
      category: insertEntry.category || null,
      tags: insertEntry.tags ? insertEntry.tags as string[] : null,
      createdAt: now,
      updatedAt: now,
    };
    this.loreEntries.set(entry.id, entry);
    return entry;
  }

  async updateLoreEntry(id: number, updates: Partial<InsertLoreEntry>): Promise<LoreEntry | undefined> {
    const entry = this.loreEntries.get(id);
    if (!entry) return undefined;

    const updatedEntry: LoreEntry = {
      ...entry,
      ...updates,
      tags: updates.tags ? updates.tags as string[] : entry.tags,
      updatedAt: new Date(),
    };
    this.loreEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteLoreEntry(id: number): Promise<boolean> {
    return this.loreEntries.delete(id);
  }

  // Notes
  async getNotes(projectId: number): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const note: Note = {
      id: this.currentNoteId++,
      ...insertNote,
      content: insertNote.content || null,
      tags: insertNote.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notes.set(note.id, note);
    return note;
  }

  async updateNote(id: number, updates: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;

    const updatedNote: Note = {
      ...note,
      ...updates,
      updatedAt: new Date(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Edit History
  async getEditHistory(projectId: number): Promise<EditHistory[]> {
    return Array.from(this.editHistory.values())
      .filter(entry => entry.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createEditHistory(insertEntry: InsertEditHistory): Promise<EditHistory> {
    const entry: EditHistory = {
      id: this.currentEditHistoryId++,
      ...insertEntry,
      description: insertEntry.description || null,
      createdAt: new Date(),
    };
    this.editHistory.set(entry.id, entry);
    return entry;
  }

  // Character Magic Systems relationships
  async getCharacterMagicSystems(characterId: number): Promise<any[]> {
    try {
      // For now, return empty array since we don't have the relationship table set up yet
      // This will be implemented when we add the character_magic_systems table
      return [];
    } catch (error) {
      console.error('Error fetching character magic systems:', error);
      return [];
    }
  }

  // Stats
  async getOverallStats(): Promise<{
    totalProjects: number;
    totalCharacters: number;
    totalLocations: number;
    totalEvents: number;
  }> {
    return {
      totalProjects: this.projects.size,
      totalCharacters: this.characters.size,
      totalLocations: this.locations.size,
      totalEvents: this.timelineEvents.size,
    };
  }
}

import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectWithStats(id: number): Promise<ProjectWithStats | undefined> {
    const project = await this.getProject(id);
    if (!project) return undefined;

    const stats = await this.getProjectStats(id);
    return { ...project, stats };
  }

  async getProjectsWithStats(): Promise<ProjectWithStats[]> {
    const allProjects = await this.getProjects();
    const projectsWithStats = await Promise.all(
      allProjects.map(async (project) => {
        const stats = await this.getProjectStats(project.id);
        return { ...project, stats };
      })
    );
    return projectsWithStats;
  }

  private async getProjectStats(projectId: number): Promise<ProjectStats> {
    const [
      charactersCount,
      locationsCount, 
      eventsCount,
      magicSystemsCount,
      loreEntriesCount
    ] = await Promise.all([
      db.select().from(characters).where(eq(characters.projectId, projectId)).then(r => r.length),
      db.select().from(locations).where(eq(locations.projectId, projectId)).then(r => r.length),
      db.select().from(timelineEvents).where(eq(timelineEvents.projectId, projectId)).then(r => r.length),
      db.select().from(magicSystems).where(eq(magicSystems.projectId, projectId)).then(r => r.length),
      db.select().from(loreEntries).where(eq(loreEntries.projectId, projectId)).then(r => r.length)
    ]);

    return {
      charactersCount,
      locationsCount,
      eventsCount,
      magicSystemsCount,
      loreEntriesCount
    };
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  // Characters
  async getCharacters(projectId: number): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.projectId, projectId));
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character;
  }

  async createCharacter(data: InsertCharacter): Promise<Character> {
    const [character] = await db.insert(characters).values(data).returning();

    // Record edit history
    await this.recordEditHistory(
      data.projectId,
      'created',
      'character',
      data.name,
      `Created character with ${data.role || 'unspecified'} role`
    );

    return character;
  }

  async updateCharacter(id: number, data: Partial<InsertCharacter>): Promise<Character | null> {
    const existing = await this.getCharacter(id);
    if (!existing) return null;

    const [character] = await db
      .update(characters)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(characters.id, id))
      .returning();

    // Record edit history
    await this.recordEditHistory(
      existing.projectId,
      'updated',
      'character',
      existing.name,
      `Updated character details`
    );

    return character || null;
  }

  async deleteCharacter(id: number): Promise<boolean> {
    const existing = await this.getCharacter(id);
    if (!existing) return false;

    const result = await db.delete(characters).where(eq(characters.id, id));
    const success = result.rowCount > 0;

    if (success) {
      // Record edit history
      await this.recordEditHistory(
        existing.projectId,
        'deleted',
        'character',
        existing.name,
        `Deleted character`
      );
    }

    return success;
  }

  // Locations
  async getLocations(projectId: number): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.projectId, projectId));
  }

  async getLocation(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  }

  async createLocation(data: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(data).returning();

    // Record edit history
    await this.recordEditHistory(
      data.projectId,
      'created',
      'location',
      data.name,
      `Created location of type ${data.type || 'unspecified'}`
    );

    return location;
  }

  async updateLocation(id: number, data: Partial<InsertLocation>): Promise<Location | null> {
    const existing = await this.getLocation(id);
    if (!existing) return null;

    const [location] = await db
      .update(locations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(locations.id, id))
      .returning();

    // Record edit history
    await this.recordEditHistory(
      existing.projectId,
      'updated',
      'location',
      existing.name,
      `Updated location details`
    );

    return location || null;
  }

  async deleteLocation(id: number): Promise<boolean> {
    const existing = await this.getLocation(id);
    if (!existing) return false;

    const result = await db.delete(locations).where(eq(locations.id, id));
    const success = result.rowCount > 0;

    if (success) {
      // Record edit history
      await this.recordEditHistory(
        existing.projectId,
        'deleted',
        'location',
        existing.name,
        `Deleted location`
      );
    }

    return success;
  }

  // Timeline Events
  async getTimelineEvents(projectId: number): Promise<TimelineEvent[]> {
    return await db.select().from(timelineEvents).where(eq(timelineEvents.projectId, projectId));
  }

  async getTimelineEvent(id: number): Promise<TimelineEvent | undefined> {
    const [event] = await db.select().from(timelineEvents).where(eq(timelineEvents.id, id));
    return event;
  }

  async createTimelineEvent(data: InsertTimelineEvent): Promise<TimelineEvent> {
    const [event] = await db.insert(timelineEvents).values(data).returning();

    // Record edit history
    await this.recordEditHistory(
      data.projectId,
      'created',
      'timeline_event',
      data.title,
      `Created timeline event for ${data.date || 'unspecified date'}`
    );

    return event;
  }

  async updateTimelineEvent(id: number, data: Partial<InsertTimelineEvent>): Promise<TimelineEvent | null> {
    const existing = await this.getTimelineEvent(id);
    if (!existing) return null;

    const [event] = await db
      .update(timelineEvents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(timelineEvents.id, id))
      .returning();

    // Record edit history
    await this.recordEditHistory(
      existing.projectId,
      'updated',
      'timeline_event',
      existing.title,
      `Updated timeline event details`
    );

    return event || null;
  }

  async deleteTimelineEvent(id: number): Promise<boolean> {
    const existing = await this.getTimelineEvent(id);
    if (!existing) return false;

    const result = await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
    const success = result.rowCount > 0;

    if (success) {
      // Record edit history
      await this.recordEditHistory(
        existing.projectId,
        'deleted',
        'timeline_event',
        existing.title,
        `Deleted timeline event`
      );
    }

    return success;
  }

  // Magic Systems
  async getMagicSystems(projectId: number): Promise<MagicSystem[]> {
    return await db.select().from(magicSystems).where(eq(magicSystems.projectId, projectId));
  }

  async getMagicSystem(id: number): Promise<MagicSystem | undefined> {
    const [system] = await db.select().from(magicSystems).where(eq(magicSystems.id, id));
    return system;
  }

  async createMagicSystem(data: InsertMagicSystem): Promise<MagicSystem> {
    const [system] = await db.insert(magicSystems).values(data).returning();

    // Record edit history
    await this.recordEditHistory(
      data.projectId,
      'created',
      'magic_system',
      data.name,
      `Created magic system with ${data.type || 'unspecified'} type`
    );

    return system;
  }

  async updateMagicSystem(id: number, data: Partial<InsertMagicSystem>): Promise<MagicSystem | null> {
    const existing = await this.getMagicSystem(id);
    if (!existing) return null;

    const [system] = await db
      .update(magicSystems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(magicSystems.id, id))
      .returning();

    // Record edit history
    await this.recordEditHistory(
      existing.projectId,
      'updated',
      'magic_system',
      existing.name,
      `Updated magic system details`
    );

    return system || null;
  }

  async deleteMagicSystem(id: number): Promise<boolean> {
    const existing = await this.getMagicSystem(id);
    if (!existing) return false;

    const result = await db.delete(magicSystems).where(eq(magicSystems.id, id));
    const success = result.rowCount > 0;

    if (success) {
      // Record edit history
      await this.recordEditHistory(
        existing.projectId,
        'deleted',
        'magic_system',
        existing.name,
        `Deleted magic system`
      );
    }

    return success;
  }

  // Lore Entries
  async getLoreEntries(projectId: number): Promise<LoreEntry[]> {
    return await db.select().from(loreEntries).where(eq(loreEntries.projectId, projectId));
  }

  async getLoreEntry(id: number): Promise<LoreEntry | undefined> {
    const [entry] = await db.select().from(loreEntries).where(eq(loreEntries.id, id));
    return entry;
  }

  async createLoreEntry(data: InsertLoreEntry): Promise<LoreEntry> {
    const [entry] = await db.insert(loreEntries).values(data).returning();

    // Record edit history
    await this.recordEditHistory(
      data.projectId,
      'created',
      'lore_entry',
      data.title,
      `Created lore entry of type ${data.type || 'general'}`
    );

    return entry;
  }

  async updateLoreEntry(id: number, data: Partial<InsertLoreEntry>): Promise<LoreEntry | null> {
    const existing = await this.getLoreEntry(id);
    if (!existing) return null;

    const [entry] = await db
      .update(loreEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(loreEntries.id, id))
      .returning();

    // Record edit history
    await this.recordEditHistory(
      existing.projectId,
      'updated',
      'lore_entry',
      existing.title,
      `Updated lore entry details`
    );

    return entry || null;
  }

  async deleteLoreEntry(id: number): Promise<boolean> {
    const existing = await this.getLoreEntry(id);
    if (!existing) return false;

    const result = await db.delete(loreEntries).where(eq(loreEntries.id, id));
    const success = result.rowCount > 0;

    if (success) {
      // Record edit history
      await this.recordEditHistory(
        existing.projectId,
        'deleted',
        'lore_entry',
        existing.title,
        `Deleted lore entry`
      );
    }

    return success;
  }

  // Edit History
  async getEditHistory(projectId: number): Promise<EditHistory[]> {
    return await db
      .select()
      .from(editHistory)
      .where(eq(editHistory.projectId, projectId))
      .orderBy(desc(editHistory.createdAt))
      .limit(50);
  }

  private async recordEditHistory(
    projectId: number,
    action: 'created' | 'updated' | 'deleted',
    entityType: 'character' | 'location' | 'timeline_event' | 'magic_system' | 'lore_entry' | 'note',
    entityName: string,
    description?: string
  ): Promise<void> {
    try {
      await db.insert(editHistory).values({
        projectId,
        action,
        entityType,
        entityName,
        description,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Failed to record edit history:', error);
      // Don't throw error to avoid breaking the main operation
    }
  }

  async createEditHistory(insertEntry: InsertEditHistory): Promise<EditHistory> {
    const [entry] = await db.insert(editHistory).values(insertEntry).returning();
    return entry;
  }

  // Character Magic Systems relationships
  async getCharacterMagicSystems(characterId: number): Promise<any[]> {
    try {
      // For now, return empty array since we don't have the relationship table set up yet
      // This will be implemented when we add the character_magic_systems table
      return [];
    } catch (error) {
      console.error('Error fetching character magic systems:', error);
      return [];
    }
  }

  async getOverallStats(): Promise<{
    totalProjects: number;
    totalCharacters: number;
    totalLocations: number;
    totalEvents: number;
  }> {
    const [
      totalProjects,
      totalCharacters,
      totalLocations,
      totalEvents
    ] = await Promise.all([
      db.select().from(projects).then(r => r.length),
      db.select().from(characters).then(r => r.length),
      db.select().from(locations).then(r => r.length),
      db.select().from(timelineEvents).then(r => r.length)
    ]);

    return {
      totalProjects,
      totalCharacters,
      totalLocations,
      totalEvents
    };
  }

  // Notes
  async getNotes(projectId: number): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.projectId, projectId))
      .orderBy(desc(notes.createdAt));
  }

  async getNote(id: number): Promise<Note | undefined> {
    const result = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
    return result[0];
  }

  async createNote(data: InsertNote): Promise<Note> {
    const noteData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [note] = await db.insert(notes).values(noteData).returning();

    // Record edit history
    await this.recordEditHistory(
      note.projectId,
      'created',
      'note',
      note.title,
      `Created note`
    );

    return note;
  }

  async updateNote(id: number, data: Partial<InsertNote>): Promise<Note | undefined> {
    const existing = await this.getNote(id);
    if (!existing) return undefined;

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const [note] = await db
      .update(notes)
      .set(updateData)
      .where(eq(notes.id, id))
      .returning();

    if (note) {
      // Record edit history
      await this.recordEditHistory(
        note.projectId,
        'updated',
        'note',
        note.title,
        `Updated note`
      );
    }

    return note || undefined;
  }

  async deleteNote(id: number): Promise<boolean> {
    const existing = await this.getNote(id);
    if (!existing) return false;

    const result = await db.delete(notes).where(eq(notes.id, id));
    const success = result.rowCount! > 0;

    if (success) {
      // Record edit history
      await this.recordEditHistory(
        existing.projectId,
        'deleted',
        'note',
        existing.title,
        `Deleted note`
      );
    }

    return success;
  }
}

export const storage = new DatabaseStorage();