// Enhanced entity relationships for InkAlchemy
// This file defines the missing connections between entities

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Many-to-many relationship tables for better connections

// Characters can be connected to multiple magic systems
export const characterMagicSystems = sqliteTable("character_magic_systems", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  magicSystemId: integer("magic_system_id").notNull().references(() => magicSystems.id, { onDelete: "cascade" }),
  proficiencyLevel: text("proficiency_level").default("beginner"), // beginner, intermediate, advanced, master
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// Timeline events can involve multiple characters
export const timelineEventCharacters = sqliteTable("timeline_event_characters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timelineEventId: integer("timeline_event_id").notNull().references(() => timelineEvents.id, { onDelete: "cascade" }),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  role: text("role"), // protagonist, antagonist, witness, etc.
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// Lore entries can reference multiple entities
export const loreEntityReferences = sqliteTable("lore_entity_references", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  loreEntryId: integer("lore_entry_id").notNull().references(() => loreEntries.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(), // character, location, timeline_event, magic_system
  entityId: integer("entity_id").notNull(),
  relevance: text("relevance").default("mentioned"), // mentioned, central, background
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// Character relationships (family, friends, enemies, etc.)
export const characterRelationships = sqliteTable("character_relationships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  relatedCharacterId: integer("related_character_id").notNull().references(() => characters.id, { onDelete: "cascade" }),
  relationshipType: text("relationship_type").notNull(), // family, friend, enemy, ally, rival, mentor, student, romantic
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// Location hierarchies (city in country, room in building, etc.)
export const locationHierarchies = sqliteTable("location_hierarchies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  locationId: integer("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  parentLocationId: integer("parent_location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
  hierarchyType: text("hierarchy_type").default("contains"), // contains, part_of, adjacent_to, connected_to
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => Date.now()),
});

// Enhanced schema types
export type CharacterMagicSystem = typeof characterMagicSystems.$inferSelect;
export type InsertCharacterMagicSystem = z.infer<typeof createInsertSchema(characterMagicSystems)>;

export type TimelineEventCharacter = typeof timelineEventCharacters.$inferSelect;
export type InsertTimelineEventCharacter = z.infer<typeof createInsertSchema(timelineEventCharacters)>;

export type LoreEntityReference = typeof loreEntityReferences.$inferSelect;
export type InsertLoreEntityReference = z.infer<typeof createInsertSchema(loreEntityReferences)>;

export type CharacterRelationship = typeof characterRelationships.$inferSelect;
export type InsertCharacterRelationship = z.infer<typeof createInsertSchema(characterRelationships)>;

export type LocationHierarchy = typeof locationHierarchies.$inferSelect;
export type InsertLocationHierarchy = z.infer<typeof createInsertSchema(locationHierarchies)>;

// Helper functions for managing relationships
export interface EntityConnection {
  sourceId: number;
  sourceType: string;
  targetId: number;
  targetType: string;
  connectionType: string;
  description?: string;
}

export interface CharacterWithConnections extends Character {
  magicSystems?: MagicSystem[];
  relationships?: (CharacterRelationship & { relatedCharacter: Character })[];
  timelineEvents?: TimelineEvent[];
  loreReferences?: LoreEntry[];
  currentLocation?: Location;
  originLocation?: Location;
}

export interface TimelineEventWithConnections extends TimelineEvent {
  involvedCharacters?: (TimelineEventCharacter & { character: Character })[];
  location?: Location;
  relatedLore?: LoreEntry[];
}

export interface LoreEntryWithConnections extends LoreEntry {
  referencedCharacters?: Character[];
  referencedLocations?: Location[];
  referencedEvents?: TimelineEvent[];
  referencedMagicSystems?: MagicSystem[];
}

// Advanced query helpers
export function getCharacterConnections(characterId: number): EntityConnection[] {
  // This would be implemented with proper database queries
  // Returns all connections for a character across all entity types
  return [];
}

export function getEntityNetwork(entityType: string, entityId: number, depth: number = 1): EntityConnection[] {
  // Returns a network of connected entities up to specified depth
  // Useful for visualization and relationship mapping
  return [];
}

export function findConnectionPath(
  sourceType: string, 
  sourceId: number, 
  targetType: string, 
  targetId: number
): EntityConnection[] {
  // Finds the shortest path between two entities
  // Useful for discovering indirect relationships
  return [];
}