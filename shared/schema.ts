import { pgTable, text, integer, timestamp, serial, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // active, planning, completed, archived
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  prefix: text("prefix"), // optional prefix like "Sir", "Dr.", "Lady", etc.
  suffix: text("suffix"), // optional suffix like "Jr.", "III", "the Great", etc.
  description: text("description"),
  appearance: text("appearance"),
  personality: text("personality"),
  backstory: text("backstory"),
  role: text("role"), // protagonist, antagonist, supporting, etc.
  age: text("age"), // flexible age format (e.g., "25", "Ancient", "Immortal")
  race: text("race"), // character's race/species
  weapons: text("weapons"), // weapons and equipment
  powerSystems: json("power_systems").$type<string[]>().default([]), // array of power/magic system names
  imageUrl: text("image_url"), // URL to character image in Supabase Storage
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").default("Other"), // City, Forest, Academy, Palace, Village, Caves, Harbor, Ruins, etc.
  description: text("description"),
  geography: text("geography"),
  culture: text("culture"),
  significance: text("significance"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date"), // flexible date format for fictional timelines
  category: text("category"), // plot, character, world, etc.
  importance: text("importance").default("medium"), // high, medium, low
  location: text("location"), // location name where event occurs
  characters: json("characters").$type<string[]>().default([]), // character names involved
  order: integer("order").notNull().default(0),
  // Writing progress fields
  writingStatus: text("writing_status").default("planning"), // planning, writing, first_draft, editing, complete
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const magicSystems = pgTable("magic_systems", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull().default("magic"), // magic or power
  description: text("description"),
  rules: text("rules"),
  limitations: text("limitations"),
  source: text("source"), // where magic comes from
  cost: text("cost"), // what using magic costs
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const loreEntries = pgTable("lore_entries", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  category: text("category"), // history, religion, politics, etc.
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  category: text("category"), // Plot, Characters, World Building, Research
  tags: text("tags"), // comma-separated tags
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Character-Magic System relationship table
export const characterMagicSystems = pgTable("character_magic_systems", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  magicSystemId: integer("magic_system_id").notNull().references(() => magicSystems.id, { onDelete: "cascade" }),
  proficiencyLevel: text("proficiency_level").default("beginner"), // beginner, intermediate, advanced, master
  notes: text("notes"), // how they learned it, special abilities, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const editHistory = pgTable("edit_history", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // created, updated, deleted
  entityType: text("entity_type").notNull(), // character, location, timeline_event, magic_system, lore_entry
  entityName: text("entity_name").notNull(),
  description: text("description"), // detailed description of what was changed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMagicSystemSchema = createInsertSchema(magicSystems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLoreEntrySchema = createInsertSchema(loreEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCharacterMagicSystemSchema = createInsertSchema(characterMagicSystems).omit({
  id: true,
  createdAt: true,
});

export const insertEditHistorySchema = createInsertSchema(editHistory).omit({
  id: true,
  createdAt: true,
});

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;

export type MagicSystem = typeof magicSystems.$inferSelect;
export type InsertMagicSystem = z.infer<typeof insertMagicSystemSchema>;

export type LoreEntry = typeof loreEntries.$inferSelect;
export type InsertLoreEntry = z.infer<typeof insertLoreEntrySchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type CharacterMagicSystem = typeof characterMagicSystems.$inferSelect;
export type InsertCharacterMagicSystem = z.infer<typeof insertCharacterMagicSystemSchema>;

export type EditHistory = typeof editHistory.$inferSelect;
export type InsertEditHistory = z.infer<typeof insertEditHistorySchema>;

// Project stats interface
export interface ProjectStats {
  charactersCount: number;
  locationsCount: number;
  eventsCount: number;
  magicSystemsCount: number;
  loreEntriesCount: number;
}

export interface ProjectWithStats extends Project {
  stats: ProjectStats;
}

// Define relations for better querying
export const projectsRelations = relations(projects, ({ many }) => ({
  characters: many(characters),
  locations: many(locations),
  timelineEvents: many(timelineEvents),
  magicSystems: many(magicSystems),
  loreEntries: many(loreEntries),
  editHistory: many(editHistory),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  project: one(projects, {
    fields: [characters.projectId],
    references: [projects.id],
  }),
  characterMagicSystems: many(characterMagicSystems),
}));

export const characterMagicSystemsRelations = relations(characterMagicSystems, ({ one }) => ({
  character: one(characters, {
    fields: [characterMagicSystems.characterId],
    references: [characters.id],
  }),
  magicSystem: one(magicSystems, {
    fields: [characterMagicSystems.magicSystemId],
    references: [magicSystems.id],
  }),
}));

export const locationsRelations = relations(locations, ({ one }) => ({
  project: one(projects, {
    fields: [locations.projectId],
    references: [projects.id],
  }),
}));

export const timelineEventsRelations = relations(timelineEvents, ({ one }) => ({
  project: one(projects, {
    fields: [timelineEvents.projectId],
    references: [projects.id],
  }),
}));

export const magicSystemsRelations = relations(magicSystems, ({ one, many }) => ({
  project: one(projects, {
    fields: [magicSystems.projectId],
    references: [projects.id],
  }),
  characterMagicSystems: many(characterMagicSystems),
}));

export const loreEntriesRelations = relations(loreEntries, ({ one }) => ({
  project: one(projects, {
    fields: [loreEntries.projectId],
    references: [projects.id],
  }),
}));

export const editHistoryRelations = relations(editHistory, ({ one }) => ({
  project: one(projects, {
    fields: [editHistory.projectId],
    references: [projects.id],
  }),
}));

// Constants
export const noteCategories = ["Plot", "Characters", "World Building", "Research"] as const;