
import { db } from './db';
import * as schema from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export async function migratePowerSystems() {
  console.log('Starting power systems migration...');
  
  try {
    // Get all characters with powerSystems
    const characters = await db.query.characters.findMany({
      where: schema.characters.powerSystems,
    });

    // Get all magic systems for mapping names to IDs
    const magicSystems = await db.query.magicSystems.findMany();
    const magicSystemMap = new Map(magicSystems.map(ms => [ms.name, ms.id]));

    let migrated = 0;
    let skipped = 0;

    for (const character of characters) {
      if (!character.powerSystems || character.powerSystems.length === 0) {
        continue;
      }

      for (const powerSystemName of character.powerSystems) {
        const magicSystemId = magicSystemMap.get(powerSystemName);
        
        if (!magicSystemId) {
          console.warn(`Magic system not found: ${powerSystemName} for character ${character.name}`);
          skipped++;
          continue;
        }

        // Check if relationship already exists
        const existing = await db.query.characterMagicSystems.findFirst({
          where: and(
            eq(schema.characterMagicSystems.characterId, character.id),
            eq(schema.characterMagicSystems.magicSystemId, magicSystemId)
          ),
        });

        if (existing) {
          console.log(`Relationship already exists: ${character.name} -> ${powerSystemName}`);
          continue;
        }

        // Create new relationship
        await db.insert(schema.characterMagicSystems).values({
          characterId: character.id,
          magicSystemId,
          proficiencyLevel: 'intermediate', // Default for existing data
          notes: `Migrated from powerSystems array`,
        });

        console.log(`Created relationship: ${character.name} -> ${powerSystemName}`);
        migrated++;
      }
    }

    console.log(`Migration complete: ${migrated} relationships created, ${skipped} skipped`);
    return { migrated, skipped };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}
