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

    // Sample locations that match timeline events
    this.locations.set(1, {
      id: 1,
      projectId: 1,
      name: "Brightblade Manor",
      description: "Ancestral home of the noble Brightblade family, where Elena was born",
      geography: "Located on rolling hills with vast gardens and a private magical training ground",
      culture: "Traditional noble customs with respect for magical arts",
      significance: "Elena's birthplace and childhood home",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.locations.set(2, {
      id: 2,
      projectId: 1,
      name: "Mystic Academy",
      description: "Prestigious magical institution for training young mages",
      geography: "Floating towers connected by bridges above a mystical lake",
      culture: "Academic excellence and magical discipline",
      significance: "Where Elena learned to control her dual fire and light magic",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.locations.set(3, {
      id: 3,
      projectId: 1,
      name: "Shadow Guild Hideout",
      description: "Hidden underground base of the secretive Shadow Assassins",
      geography: "Network of tunnels beneath the Royal Capital",
      culture: "Loyalty through fear, shadows and secrecy",
      significance: "Where Marcus was trained in forbidden shadow arts",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.locations.set(4, {
      id: 4,
      projectId: 1,
      name: "Temple of Light",
      description: "Sacred temple dedicated to the Light Goddess",
      geography: "Gleaming white marble structure atop a hill overlooking the city",
      culture: "Peaceful worship and healing traditions",
      significance: "Sister Lyra's home and place of divine visions",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.locations.set(5, {
      id: 5,
      projectId: 1,
      name: "Crystal Caverns",
      description: "Hidden cave system filled with ancient earth magic crystals",
      geography: "Deep mountain caves with crystalline formations",
      culture: "Sacred to earth magic practitioners",
      significance: "Where Terra discovered her earth magic potential",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.locations.set(6, {
      id: 6,
      projectId: 1,
      name: "Whispering Woods",
      description: "Enchanted forest where Elena and Marcus first met",
      geography: "Dense woodland with ancient trees that seem to whisper secrets",
      culture: "Neutral ground respected by all factions",
      significance: "The fateful meeting place of two heroes",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.locations.set(7, {
      id: 7,
      projectId: 1,
      name: "Temple of Elements",
      description: "Ancient temple where all five heroes were brought together",
      geography: "Stone temple with chambers representing each element",
      culture: "Sacred to practitioners of all magic types",
      significance: "The convergence point of destiny",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.locations.set(8, {
      id: 8,
      projectId: 1,
      name: "The Shadowlands",
      description: "Corrupted realm where the Dark Lord awakened",
      geography: "Twisted landscape of shadow and decay",
      culture: "No culture remains, only corruption and evil",
      significance: "Source of the darkness threatening the world",
      createdAt: new Date(),
      updatedAt: new Date()
    });

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

    // Sample timeline events - detailed story events for Elena's Chronicles
    this.timelineEvents.set(1, {
      id: 1,
      projectId: 1,
      title: "Elena's Birth",
      description: "Elena Brightblade is born to nobility under a rare solar eclipse, showing signs of magical potential",
      date: "Year 1, Day 1",
      category: "Character Arc",
      importance: "high",
      location: "Brightblade Manor",
      characters: ["Elena Brightblade"],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(2, {
      id: 2,
      projectId: 1,
      title: "First Magic Manifestation",
      description: "Elena accidentally sets her nursery on fire during a tantrum, revealing her fire magic abilities",
      date: "Year 1, Day 5",
      category: "Character Arc",
      importance: "high",
      location: "Brightblade Manor",
      characters: ["Elena Brightblade"],
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(3, {
      id: 3,
      projectId: 1,
      title: "Academy Enrollment",
      description: "Elena is enrolled in the prestigious Mystic Academy to learn control over her growing magical powers",
      date: "Year 1, Day 15",
      category: "World Event",
      importance: "medium",
      location: "Mystic Academy",
      characters: ["Elena Brightblade"],
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(4, {
      id: 4,
      projectId: 1,
      title: "Marcus's Dark Training Begins",
      description: "Marcus Shadowbane begins his training with the Shadow Assassins guild, learning forbidden arts",
      date: "Year 1, Day 20",
      category: "Character Arc",
      importance: "medium",
      location: "Shadow Guild Hideout",
      characters: ["Marcus Shadowbane"],
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(5, {
      id: 5,
      projectId: 1,
      title: "Aqua's Village Destroyed",
      description: "Pirates destroy Aqua's coastal village, leaving her as the sole survivor to be raised by sea spirits",
      date: "Year 1, Day 25",
      category: "Tragedy",
      importance: "high",
      location: "Tidecaller Village",
      characters: ["Aqua Tidecaller"],
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(6, {
      id: 6,
      projectId: 1,
      title: "Elena's First Duel",
      description: "Elena faces her first magical duel at the academy against a rival student, discovering her light magic",
      date: "Year 1, Day 30",
      category: "Battle",
      importance: "medium",
      location: "Mystic Academy",
      characters: ["Elena Brightblade"],
      order: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(7, {
      id: 7,
      projectId: 1,
      title: "The Crystal Cave Discovery",
      description: "Terra Stoneheart discovers ancient earth magic crystals in a hidden mountain cave",
      date: "Year 1, Day 35",
      category: "Discovery",
      importance: "medium",
      location: "Crystal Caverns",
      characters: ["Terra Stoneheart"],
      order: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(8, {
      id: 8,
      projectId: 1,
      title: "Sister Lyra's Divine Vision",
      description: "Sister Lyra receives a prophetic vision from the Light Goddess about a coming darkness",
      date: "Year 1, Day 40",
      category: "Prophecy",
      importance: "high",
      location: "Temple of Light",
      characters: ["Sister Lyra"],
      order: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(9, {
      id: 9,
      projectId: 1,
      title: "Marcus's First Assignment",
      description: "Marcus Shadowbane completes his first assassination mission, but begins to question the guild's methods",
      date: "Year 1, Day 45",
      category: "Character Arc",
      importance: "medium",
      location: "Royal Capital",
      characters: ["Marcus Shadowbane"],
      order: 9,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(10, {
      id: 10,
      projectId: 1,
      title: "The Academy Tournament",
      description: "Annual tournament at Mystic Academy where Elena showcases her dual fire and light magic abilities",
      date: "Year 1, Day 50",
      category: "Competition",
      importance: "medium",
      location: "Mystic Academy",
      characters: ["Elena Brightblade"],
      order: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(11, {
      id: 11,
      projectId: 1,
      title: "Aqua's Water Spirit Pact",
      description: "Aqua forms a binding pact with ancient water spirits, gaining mastery over the seas",
      date: "Year 1, Day 55",
      category: "Magic Ritual",
      importance: "high",
      location: "Sacred Tide Pools",
      characters: ["Aqua Tidecaller"],
      order: 11,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(12, {
      id: 12,
      projectId: 1,
      title: "The Shadow Guild Betrayal",
      description: "Marcus discovers the Shadow Guild plans to assassinate innocent nobles and refuses to participate",
      date: "Year 1, Day 60",
      category: "Betrayal",
      importance: "high",
      location: "Shadow Guild Hideout",
      characters: ["Marcus Shadowbane"],
      order: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(13, {
      id: 13,
      projectId: 1,
      title: "Elena's Graduation Test",
      description: "Elena faces the final graduation test at the academy, demonstrating mastery of both fire and light magic",
      date: "Year 1, Day 65",
      category: "Character Arc",
      importance: "medium",
      location: "Mystic Academy",
      characters: ["Elena Brightblade"],
      order: 13,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(14, {
      id: 14,
      projectId: 1,
      title: "The Dark Lord's Awakening",
      description: "Ancient evil stirs in the Shadowlands, beginning to corrupt the surrounding areas",
      date: "Year 1, Day 70",
      category: "World Event",
      importance: "high",
      location: "The Shadowlands",
      characters: [],
      order: 14,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(15, {
      id: 15,
      projectId: 1,
      title: "Marcus Flees the Guild",
      description: "Marcus escapes the Shadow Guild after refusing their assassination orders, becoming a wanted man",
      date: "Year 1, Day 75",
      category: "Escape",
      importance: "high",
      location: "Royal Capital",
      characters: ["Marcus Shadowbane"],
      order: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(16, {
      id: 16,
      projectId: 1,
      title: "Elena and Marcus First Meeting",
      description: "Elena encounters the fugitive Marcus in the forest and offers him sanctuary despite his dark past",
      date: "Year 1, Day 80",
      category: "Alliance",
      importance: "high",
      location: "Whispering Woods",
      characters: ["Elena Brightblade", "Marcus Shadowbane"],
      order: 16,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(17, {
      id: 17,
      projectId: 1,
      title: "The Coastal Raid",
      description: "Pirates attack coastal villages, prompting Aqua to emerge from her oceanic sanctuary to help",
      date: "Year 1, Day 85",
      category: "Battle",
      importance: "medium",
      location: "Coral Bay",
      characters: ["Aqua Tidecaller"],
      order: 17,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(18, {
      id: 18,
      projectId: 1,
      title: "Terra's Mountain Guardian Trial",
      description: "Terra faces the ancient trial to become the official Guardian of the Mountain Pass",
      date: "Year 1, Day 90",
      category: "Character Arc",
      importance: "medium",
      location: "Guardian's Peak",
      characters: ["Terra Stoneheart"],
      order: 18,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(19, {
      id: 19,
      projectId: 1,
      title: "The Oracle's Prophecy",
      description: "An ancient oracle reveals a prophecy about five heroes who must unite to face the coming darkness",
      date: "Year 1, Day 95",
      category: "Prophecy",
      importance: "high",
      location: "Oracle's Sanctum",
      characters: ["Sister Lyra"],
      order: 19,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(20, {
      id: 20,
      projectId: 1,
      title: "The Great Convergence",
      description: "Elena, Marcus, Aqua, Terra, and Sister Lyra are brought together by fate at the Temple of Elements",
      date: "Year 1, Day 100",
      category: "Alliance",
      importance: "high",
      location: "Temple of Elements",
      characters: ["Elena Brightblade", "Marcus Shadowbane", "Aqua Tidecaller", "Terra Stoneheart", "Sister Lyra"],
      order: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(21, {
      id: 21,
      projectId: 1,
      title: "The First Shadow Attack",
      description: "Shadow creatures attack the temple during the heroes' first meeting, testing their combined abilities",
      date: "Year 1, Day 102",
      category: "Battle",
      importance: "high",
      location: "Temple of Elements",
      characters: ["Elena Brightblade", "Marcus Shadowbane", "Aqua Tidecaller", "Terra Stoneheart", "Sister Lyra"],
      order: 21,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(22, {
      id: 22,
      projectId: 1,
      title: "The Elemental Trials Begin",
      description: "The heroes begin the ancient Elemental Trials to prove their worthiness to face the Dark Lord",
      date: "Year 1, Day 105",
      category: "Quest",
      importance: "medium",
      location: "Trial Grounds",
      characters: ["Elena Brightblade", "Marcus Shadowbane", "Aqua Tidecaller", "Terra Stoneheart", "Sister Lyra"],
      order: 22,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(23, {
      id: 23,
      projectId: 1,
      title: "Trial of Fire and Light",
      description: "Elena faces her personal trial, learning to balance the opposing forces of fire and light within her",
      date: "Year 1, Day 110",
      category: "Character Arc",
      importance: "medium",
      location: "Fire Temple",
      characters: ["Elena Brightblade"],
      order: 23,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(24, {
      id: 24,
      projectId: 1,
      title: "Marcus Confronts His Past",
      description: "Marcus faces his former guild master in combat, finally breaking free from his shadow magic addiction",
      date: "Year 1, Day 115",
      category: "Character Arc",
      importance: "high",
      location: "Shadow Realm",
      characters: ["Marcus Shadowbane"],
      order: 24,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.timelineEvents.set(25, {
      id: 25,
      projectId: 1,
      title: "The Final Battle Preparation",
      description: "The heroes gather allies and prepare for the final confrontation with the awakened Dark Lord",
      date: "Year 1, Day 120",
      category: "Preparation",
      importance: "high",
      location: "Alliance Stronghold",
      characters: ["Elena Brightblade", "Marcus Shadowbane", "Aqua Tidecaller", "Terra Stoneheart", "Sister Lyra"],
      order: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    for (let i = 26; i <= 43; i++) {
      this.timelineEvents.set(i, {
        id: i,
        projectId: 2,
        title: `Event ${i}`,
        description: null,
        date: null,
        category: null,
        importance: null,
        location: null,
        characters: [],
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

    // Add sample characters with power systems for demonstration
    this.characters.set(1, {
      id: 1,
      projectId: 1,
      name: "Elena Brightblade",
      description: "A young mage with incredible potential and a mysterious past.",
      appearance: "Auburn hair that catches fire when she uses magic, emerald eyes, average height with an athletic build from training",
      personality: "Determined, compassionate, but sometimes impulsive.",
      backstory: "Born into nobility but discovered her magical abilities late in life.",
      role: "Protagonist",
      powerSystems: ["Fire Magic", "Light Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(2, {
      id: 2,
      projectId: 1,
      name: "Marcus Shadowbane",
      description: "A former assassin turned reluctant hero with a dark past.",
      appearance: "Black hair, piercing blue eyes, tall and lean with numerous scars",
      personality: "Brooding, loyal once trust is earned, struggles with his dark nature.",
      backstory: "Trained as a shadow assassin before abandoning his order to fight for justice.",
      role: "Ally",
      powerSystems: ["Shadow Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(3, {
      id: 3,
      projectId: 1,
      name: "Aqua Tidecaller",
      description: "A sea priestess with mastery over water and healing arts.",
      appearance: "Silver-blue hair that flows like water, sea-green eyes, medium height",
      personality: "Calm, wise, protective of nature and innocent life.",
      backstory: "Raised by the sea spirits after her village was destroyed by pirates.",
      role: "Supporting",
      powerSystems: ["Water Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(4, {
      id: 4,
      projectId: 1,
      name: "Gareth Stoneward",
      description: "A dwarven earth mage and master craftsman.",
      appearance: "Braided brown beard, stocky build, hands permanently stained with earth and stone dust",
      personality: "Steady, reliable, takes pride in his craft and magical abilities.",
      backstory: "Heir to a long line of earth mages who protect the mountain kingdoms.",
      role: "Ally",
      powerSystems: ["Earth Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(5, {
      id: 5,
      projectId: 1,
      name: "Lady Seraphina",
      description: "A noble paladin devoted to the Light Goddess.",
      appearance: "Golden hair, radiant blue eyes, tall and graceful with an aura of divine light",
      personality: "Righteous, compassionate, unwavering in her faith and moral convictions.",
      backstory: "Chosen by the Light Goddess at a young age to be her champion.",
      role: "Ally",
      powerSystems: ["Light Magic"],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.characters.set(6, {
      id: 6,
      projectId: 1,
      name: "Lord Vex the Corrupted",
      description: "A powerful sorcerer consumed by shadow magic and malice.",
      appearance: "Pale skin, black eyes with no pupils, tall and gaunt with shadow tendrils emanating from his form",
      personality: "Cruel, manipulative, driven by a hunger for power and revenge.",
      backstory: "Once a promising light mage who fell to darkness after a great tragedy.",
      role: "Antagonist",
      powerSystems: ["Shadow Magic", "Fire Magic"],
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

    // Sample lore entries for project 1
    this.loreEntries.set(1, {
      id: 1,
      projectId: 1,
      title: "The Ancient War of Shadows",
      content: "A thousand years ago, the realm was plunged into darkness when the Shadow Lords attempted to overthrow the Circle of Light. This war lasted for three centuries and reshaped the magical landscape of the world, creating the mystical barriers that still protect our lands today.",
      category: "History",
      tags: ["war", "ancient", "magic", "shadow lords", "circle of light"],
      createdAt: new Date(Date.now() - 86400000 * 30),
      updatedAt: new Date(Date.now() - 86400000 * 5)
    });

    this.loreEntries.set(2, {
      id: 2,
      projectId: 1,
      title: "The Crystal of Eternal Flame",
      content: "A legendary artifact said to contain the first flame ever created by the gods. It is said that whoever possesses it can command fire magic beyond mortal comprehension. The crystal was last seen during the Battle of Crimson Peak, where it vanished into the ethereal realm.",
      category: "Artifacts",
      tags: ["artifact", "fire", "crystal", "legendary", "gods", "crimson peak"],
      createdAt: new Date(Date.now() - 86400000 * 15),
      updatedAt: new Date(Date.now() - 86400000 * 2)
    });

    this.loreEntries.set(3, {
      id: 3,
      projectId: 1,
      title: "The Prophecy of the Chosen One",
      content: "Ancient texts speak of one who will rise when the realm faces its darkest hour. Born under the eclipse, marked by flame, they will either save the world or destroy it. The prophecy was first recorded by the Oracle of Moonvale and has been passed down through generations.",
      category: "Prophecies",
      tags: ["prophecy", "chosen one", "eclipse", "flame", "oracle", "moonvale"],
      createdAt: new Date(Date.now() - 86400000 * 20),
      updatedAt: new Date(Date.now() - 86400000 * 1)
    });

    this.loreEntries.set(4, {
      id: 4,
      projectId: 1,
      title: "The Academy of Mystic Arts",
      content: "Founded by Archmage Theron after the Shadow War to ensure that magical knowledge would never again be hoarded by the few. The Academy stands as a beacon of learning, where students from all walks of life can study the arcane arts under the guidance of master wizards.",
      category: "Institutions",
      tags: ["academy", "founding", "education", "theron", "mystic arts", "learning"],
      createdAt: new Date(Date.now() - 86400000 * 10),
      updatedAt: new Date(Date.now() - 86400000 * 3)
    });

    this.loreEntries.set(5, {
      id: 5,
      projectId: 1,
      title: "The Festival of Starlight",
      content: "An annual celebration held during the winter solstice, where citizens light thousands of lanterns to honor the celestial spirits. The tradition began as a way to ward off the darkness during the longest night of the year and has evolved into a joyous community gathering.",
      category: "Customs",
      tags: ["festival", "starlight", "winter solstice", "lanterns", "celestial spirits", "tradition"],
      createdAt: new Date(Date.now() - 86400000 * 7),
      updatedAt: new Date(Date.now() - 86400000 * 1)
    });

    this.loreEntries.set(6, {
      id: 6,
      projectId: 1,
      title: "The Order of the Silver Dawn",
      content: "A religious organization dedicated to the worship of Lumina, the goddess of light and healing. The Order maintains temples throughout the realm and provides healing services to those in need. Their priests are known for their distinctive silver robes and crescent moon pendants.",
      category: "Religion",
      tags: ["order", "silver dawn", "lumina", "goddess", "healing", "temples", "priests"],
      createdAt: new Date(Date.now() - 86400000 * 12),
      updatedAt: new Date(Date.now() - 86400000 * 4)
    });

    this.currentLoreEntryId = 7;
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

export const storage = new DatabaseStorage();
