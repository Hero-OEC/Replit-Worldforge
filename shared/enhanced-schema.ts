// Enhanced schema additions for InkAlchemy
// These are the missing connections that would significantly improve the system

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// 1. Many-to-many: Characters <-> Magic Systems with proficiency
export const characterMagicSystems = sqliteTable("character_magic_systems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").notNull(),
  magicSystemId: integer("magic_system_id").notNull(),
  proficiencyLevel: text("proficiency_level").default("beginner"), // beginner, intermediate, advanced, master
  notes: text("notes"), // how they learned it, special abilities, etc.
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// 2. Many-to-many: Timeline Events <-> Characters with roles
export const timelineEventCharacters = sqliteTable("timeline_event_characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timelineEventId: integer("timeline_event_id").notNull(),
  characterId: integer("character_id").notNull(),
  role: text("role"), // protagonist, antagonist, witness, victim, etc.
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// 3. Character relationships (family, friends, enemies)
export const characterRelationships = sqliteTable("character_relationships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").notNull(),
  relatedCharacterId: integer("related_character_id").notNull(),
  relationshipType: text("relationship_type").notNull(), // family, friend, enemy, ally, rival, mentor, romantic
  description: text("description"),
  status: text("status").default("active"), // active, past, complicated
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// 4. Lore entity references (lore can reference any entity)
export const loreEntityReferences = sqliteTable("lore_entity_references", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  loreEntryId: integer("lore_entry_id").notNull(),
  entityType: text("entity_type").notNull(), // character, location, timeline_event, magic_system
  entityId: integer("entity_id").notNull(),
  relevance: text("relevance").default("mentioned"), // central, mentioned, background
  description: text("description"), // how this entity relates to the lore
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// 5. Character location associations
export const characterLocations = sqliteTable("character_locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").notNull(),
  locationId: integer("location_id").notNull(),
  locationType: text("location_type").notNull(), // origin, current, visited, owns, works_at
  description: text("description"),
  timeframe: text("timeframe"), // when they were there (flexible format)
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// These connection types would enable:

// Character Queries:
// - Find all characters who use Fire Magic
// - Get Elena's friends and enemies
// - Show characters from Arcanum City
// - List mentors and students

// Timeline Queries:
// - Events where Elena was the protagonist
// - All battles Marcus participated in
// - Events that happened in the Royal Palace

// Lore Queries:
// - All lore entries about Elena
// - Historical events related to Fire Magic
// - Background information for locations

// Cross-Entity Analysis:
// - Character interaction networks
// - Location-based story clusters
// - Magic system lineages and schools
// - Historical connections between events