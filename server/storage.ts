import { 
  projects, characters, locations, timelineEvents, magicSystems, loreEntries,
  type Project, type InsertProject, type Character, type InsertCharacter,
  type Location, type InsertLocation, type TimelineEvent, type InsertTimelineEvent,
  type MagicSystem, type InsertMagicSystem, type LoreEntry, type InsertLoreEntry,
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

  // Lore Entries
  getLoreEntries(projectId: number): Promise<LoreEntry[]>;
  getLoreEntry(id: number): Promise<LoreEntry | undefined>;
  createLoreEntry(entry: InsertLoreEntry): Promise<LoreEntry>;
  updateLoreEntry(id: number, entry: Partial<InsertLoreEntry>): Promise<LoreEntry | undefined>;
  deleteLoreEntry(id: number): Promise<boolean>;

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
  
  private currentProjectId = 1;
  private currentCharacterId = 1;
  private currentLocationId = 1;
  private currentTimelineEventId = 1;
  private currentMagicSystemId = 1;
  private currentLoreEntryId = 1;

  constructor() {
    this.seedSampleData();
  }

  private seedSampleData() {
    // Sample projects
    const project1: Project = {
      id: 1,
      title: "The Chronicles of Elena",
      genre: "High Fantasy",
      description: "A fantasy epic about a young mage discovering her true potential in a world of magic and political intrigue.",
      status: "active",
      createdAt: new Date("2024-06-20"),
      updatedAt: new Date("2024-06-20")
    };

    const project2: Project = {
      id: 2,
      title: "Neon Shadows",
      genre: "Cyberpunk",
      description: "A cyberpunk thriller set in Neo-Tokyo where hackers fight against corporate overlords.",
      status: "planning",
      createdAt: new Date("2024-06-18"),
      updatedAt: new Date("2024-06-18")
    };

    this.projects.set(1, project1);
    this.projects.set(2, project2);
    this.currentProjectId = 3;

    // Sample characters for project 1
    this.characters.set(1, {
      id: 1,
      projectId: 1,
      name: "Elena Brightflame",
      description: "The protagonist mage",
      appearance: "Auburn hair, emerald eyes",
      personality: "Determined and compassionate",
      backstory: "Orphaned at young age",
      role: "protagonist",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add more characters to reach the numbers shown in the image
    for (let i = 2; i <= 12; i++) {
      this.characters.set(i, {
        id: i,
        projectId: 1,
        name: `Character ${i}`,
        description: null,
        appearance: null,
        personality: null,
        backstory: null,
        role: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Sample characters for project 2
    for (let i = 13; i <= 19; i++) {
      this.characters.set(i, {
        id: i,
        projectId: 2,
        name: `Character ${i}`,
        description: null,
        appearance: null,
        personality: null,
        backstory: null,
        role: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Sample locations
    for (let i = 1; i <= 8; i++) {
      this.locations.set(i, {
        id: i,
        projectId: 1,
        name: `Location ${i}`,
        description: null,
        geography: null,
        culture: null,
        significance: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    for (let i = 9; i <= 13; i++) {
      this.locations.set(i, {
        id: i,
        projectId: 2,
        name: `Location ${i}`,
        description: null,
        geography: null,
        culture: null,
        significance: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Sample timeline events
    for (let i = 1; i <= 25; i++) {
      this.timelineEvents.set(i, {
        id: i,
        projectId: 1,
        title: `Event ${i}`,
        description: null,
        date: null,
        category: null,
        order: i,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    for (let i = 26; i <= 43; i++) {
      this.timelineEvents.set(i, {
        id: i,
        projectId: 2,
        title: `Event ${i}`,
        description: null,
        date: null,
        category: null,
        order: i - 25,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    this.currentCharacterId = 20;
    this.currentLocationId = 14;
    this.currentTimelineEventId = 44;
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
      ...insertSystem,
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

export const storage = new MemStorage();
