import { sqliteTable, text, integer, blob, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  genre: text("genre").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"), // active, planning, completed, archived
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const characters = sqliteTable("characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  appearance: text("appearance"),
  personality: text("personality"),
  backstory: text("backstory"),
  role: text("role"), // protagonist, antagonist, supporting, etc.
  powerSystems: text("power_systems", { mode: "json" }).$type<string[]>().$defaultFn(() => []), // array of power/magic system names
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

export const locations = sqliteTable("locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  geography: text("geography"),
  culture: text("culture"),
  significance: text("significance"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const timelineEvents = sqliteTable("timeline_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date"), // flexible date format for fictional timelines
  category: text("category"), // plot, character, world, etc.
  importance: text("importance").default("medium"), // high, medium, low
  location: text("location"), // location name where event occurs
  characters: text("characters", { mode: "json" }).$type<string[]>().$defaultFn(() => []), // character names involved
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const magicSystems = sqliteTable("magic_systems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull().default("magic"), // magic or power
  description: text("description"),
  rules: text("rules"),
  limitations: text("limitations"),
  source: text("source"), // where magic comes from
  cost: text("cost"), // what using magic costs
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const loreEntries = sqliteTable("lore_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  category: text("category"), // history, religion, politics, etc.
  tags: text("tags", { mode: "json" }).$type<string[]>().$defaultFn(() => []),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

export const editHistory = sqliteTable("edit_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  action: text("action").notNull(), // created, updated, deleted
  entityType: text("entity_type").notNull(), // character, location, timeline_event, magic_system, lore_entry
  entityName: text("entity_name").notNull(),
  description: text("description"), // detailed description of what was changed
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
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

export const charactersRelations = relations(characters, ({ one }) => ({
  project: one(projects, {
    fields: [characters.projectId],
    references: [projects.id],
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

export const magicSystemsRelations = relations(magicSystems, ({ one }) => ({
  project: one(projects, {
    fields: [magicSystems.projectId],
    references: [projects.id],
  }),
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