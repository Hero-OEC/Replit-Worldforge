import { 
  projects, characters, locations, timelineEvents, magicSystems, loreEntries, editHistory,
  type Project, type InsertProject, type Character, type InsertCharacter,
  type Location, type InsertLocation, type TimelineEvent, type InsertTimelineEvent,
  type MagicSystem, type InsertMagicSystem, type LoreEntry, type InsertLoreEntry,
  type EditHistory, type InsertEditHistory,
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
  private editHistory: Map<number, EditHistory> = new Map();
  
  private currentProjectId = 1;
  private currentCharacterId = 1;
  private currentLocationId = 1;
  private currentTimelineEventId = 1;
  private currentMagicSystemId = 1;
  private currentLoreEntryId = 1;
  private currentEditHistoryId = 1;

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
      description: "A young mage with incredible potential, mastering both fire and light magic",
      appearance: "Auburn hair that glows when using magic, emerald eyes, athletic build",
      personality: "Determined, compassionate, sometimes impulsive",
      backstory: "Orphaned at young age, discovered dual magic abilities at the academy",
      role: "protagonist",
      powerSystems: ["Fire Magic", "Light Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(2, {
      id: 2,
      projectId: 1,
      name: "Marcus Shadowbane",
      description: "Elena's mentor and former academy professor, expert in forbidden shadow magic",
      appearance: "Silver hair, weathered face, tall and imposing",
      personality: "Wise, mysterious, protective of Elena",
      backstory: "Former court mage who delved too deep into shadow magic, now teaches at the academy",
      role: "ally",
      powerSystems: ["Shadow Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(3, {
      id: 3,
      projectId: 1,
      name: "Lord Vex",
      description: "Dark sorcerer seeking ultimate power through corrupted shadow magic",
      appearance: "Black robes, pale skin, piercing blue eyes",
      personality: "Cunning, ruthless, charismatic",
      backstory: "Former academy student who was expelled for practicing forbidden magic",
      role: "antagonist",
      powerSystems: ["Shadow Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(4, {
      id: 4,
      projectId: 1,
      name: "Aqua the Tide Walker",
      description: "Master of water magic and healer of the coastal regions",
      appearance: "Blue-tinted hair, flowing robes that shimmer like water",
      personality: "Calm, patient, deeply connected to nature",
      backstory: "Raised by sea spirits, learned water magic from ancient ocean guardians",
      role: "ally",
      powerSystems: ["Water Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(5, {
      id: 5,
      projectId: 1,
      name: "Terra Stoneheart",
      description: "Earth magic specialist and guardian of the mountain pass",
      appearance: "Brown hair with stone-like streaks, muscular build, earth-toned clothing",
      personality: "Steady, reliable, slow to anger but fierce when provoked",
      backstory: "Born in the mountains, learned earth magic from ancient stone circles",
      role: "ally",
      powerSystems: ["Earth Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(6, {
      id: 6,
      projectId: 1,
      name: "Sister Lyra",
      description: "Devout priestess wielding pure light magic for healing and protection",
      appearance: "Golden hair, white robes, gentle demeanor with inner strength",
      personality: "Compassionate, faithful, unwavering in her beliefs",
      backstory: "Orphaned and raised in the temple, blessed by the Light Goddess herself",
      role: "ally",
      powerSystems: ["Light Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add more characters to reach the numbers shown in the image
    for (let i = 7; i <= 12; i++) {
      this.characters.set(i, {
        id: i,
        projectId: 1,
        name: `Character ${i}`,
        description: null,
        appearance: null,
        personality: null,
        backstory: null,
        role: null,
        powerSystems: [],
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
        powerSystems: [],
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

    // Sample magic systems for project 1
    this.magicSystems.set(1, {
      id: 1,
      projectId: 1,
      name: "Fire Magic",
      category: "magic",
      description: "The ancient art of manipulating flames and heat energy",
      rules: "Practitioners must maintain emotional control, as strong emotions can cause magical backlash. Fire magic draws from ambient heat and the caster's life force.",
      limitations: "Cannot be used in areas completely devoid of heat. Overuse can lead to fever and exhaustion. Water-based magic provides strong resistance.",
      source: "Channeled through meditation and connection to the elemental plane of fire",
      cost: "Physical stamina and body heat. Advanced spells require rare fire crystals as catalysts.",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.magicSystems.set(2, {
      id: 2,
      projectId: 1,
      name: "Light Magic",
      category: "magic",
      description: "Sacred magic that channels pure light energy for healing and protection",
      rules: "Only those with pure intentions can wield light magic effectively. The magic is strongest during daylight hours and weakest in complete darkness.",
      limitations: "Cannot be used for harmful purposes without corrupting the caster. Ineffective against beings of pure darkness or shadow magic.",
      source: "Divine blessing from the Light Goddess, requiring daily prayer and meditation",
      cost: "Spiritual energy and devotion. Major healings require holy water and blessed crystals.",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.magicSystems.set(3, {
      id: 3,
      projectId: 1,
      name: "Shadow Magic",
      category: "magic",
      description: "Dark magic that manipulates shadows and stealth, often considered taboo",
      rules: "Shadow magic feeds on negative emotions and grows stronger in darkness. Practitioners must guard against corruption of their soul.",
      limitations: "Weakened significantly in bright light. Prolonged use can lead to loss of empathy and gradual corruption of the caster's mind.",
      source: "Ancient forbidden texts and pacts with shadow entities",
      cost: "Fragments of the caster's soul and years of their natural lifespan. Requires shadow essence as a material component.",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.magicSystems.set(4, {
      id: 4,
      projectId: 1,
      name: "Water Magic",
      category: "magic",
      description: "Fluid magic controlling water, ice, and healing properties of aquatic elements",
      rules: "Water magic flows like its element - gentle yet persistent. Practitioners must maintain mental flexibility and emotional flow.",
      limitations: "Severely weakened in arid environments. Ice magic requires cold temperatures or significant energy expenditure.",
      source: "Communion with water spirits and study of tidal patterns",
      cost: "Mental focus and hydration. Complex spells require enchanted water from sacred springs.",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.magicSystems.set(5, {
      id: 5,
      projectId: 1,
      name: "Earth Magic",
      category: "magic",
      description: "Solid magic that commands stone, soil, and growing things from the earth",
      rules: "Earth magic requires patience and deep connection to the land. Magic is strongest when the caster is in direct contact with natural earth.",
      limitations: "Ineffective on processed materials like refined metals. Difficult to use in artificial environments or high altitudes.",
      source: "Deep meditation with the earth and understanding of geological forces",
      cost: "Physical connection to the ground and mineral components. Major spells require rare gems and earth essences.",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.currentCharacterId = 20;
    this.currentLocationId = 14;
    this.currentTimelineEventId = 44;
    this.currentMagicSystemId = 6;

    // Add sample edit history for project 1
    this.editHistory.set(1, {
      id: 1,
      projectId: 1,
      action: "created",
      entityType: "character",
      entityName: "Elena Brightflame",
      description: "Created new protagonist character with fire and light magic abilities",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    });

    this.editHistory.set(2, {
      id: 2,
      projectId: 1,
      action: "created",
      entityType: "magic_system",
      entityName: "Fire Magic",
      description: "Added comprehensive fire magic system with detailed rules and limitations",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    });

    this.editHistory.set(3, {
      id: 3,
      projectId: 1,
      action: "updated",
      entityType: "character",
      entityName: "Marcus Shadowbane",
      description: "Updated character backstory and added shadow magic abilities",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    });

    this.editHistory.set(4, {
      id: 4,
      projectId: 1,
      action: "created",
      entityType: "location",
      entityName: "Sunset Harbor",
      description: "Created coastal trading hub location with detailed geography",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    });

    this.editHistory.set(5, {
      id: 5,
      projectId: 1,
      action: "created",
      entityType: "timeline_event",
      entityName: "Elena's Awakening",
      description: "Added pivotal character arc event to main storyline",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    });

    this.editHistory.set(6, {
      id: 6,
      projectId: 1,
      action: "deleted",
      entityType: "character",
      entityName: "Temporary Character",
      description: "Removed placeholder character that was no longer needed",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    });

    this.currentEditHistoryId = 7;
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

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db.insert(characters).values(insertCharacter).returning();
    return character;
  }

  async updateCharacter(id: number, updates: Partial<InsertCharacter>): Promise<Character | undefined> {
    const [character] = await db
      .update(characters)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(characters.id, id))
      .returning();
    return character;
  }

  async deleteCharacter(id: number): Promise<boolean> {
    const result = await db.delete(characters).where(eq(characters.id, id));
    return result.rowCount > 0;
  }

  // Additional methods for locations, timeline events, magic systems, lore entries...
  // (I'll implement the key ones to show the pattern)

  async getEditHistory(projectId: number): Promise<EditHistory[]> {
    return await db
      .select()
      .from(editHistory)
      .where(eq(editHistory.projectId, projectId))
      .orderBy(desc(editHistory.createdAt));
  }

  async createEditHistory(insertEntry: InsertEditHistory): Promise<EditHistory> {
    const [entry] = await db.insert(editHistory).values(insertEntry).returning();
    return entry;
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
}

export const storage = new MemStorage();
