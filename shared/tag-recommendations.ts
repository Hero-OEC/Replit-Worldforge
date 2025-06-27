// Tag recommendation system based on content analysis
export interface TagRecommendation {
  tag: string;
  confidence: number;
  matchedKeywords: string[];
}

// Predefined keyword-to-tag mappings for fantasy/fiction content
const TAG_KEYWORDS = {
  "magic": ["magic", "magical", "spell", "enchant", "wizard", "mage", "arcane", "mystical", "sorcery", "enchantment"],
  "ancient": ["ancient", "old", "ages", "centuries", "millennia", "antiquity", "primordial", "elder", "bygone"],
  "war": ["war", "battle", "conflict", "siege", "army", "soldier", "warrior", "combat", "fight", "clash"],
  "prophecy": ["prophecy", "prophecies", "foretold", "predict", "oracle", "vision", "divination", "foreseen"],
  "gods": ["god", "gods", "goddess", "divine", "deity", "celestial", "heavenly", "sacred", "holy"],
  "fire": ["fire", "flame", "burn", "ember", "blaze", "inferno", "heat", "ignite", "scorch"],
  "water": ["water", "ocean", "sea", "river", "lake", "stream", "tide", "wave", "aquatic"],
  "shadow": ["shadow", "dark", "darkness", "shade", "umbra", "eclipse", "twilight", "dusk"],
  "light": ["light", "bright", "radiant", "luminous", "glow", "shine", "beacon", "illuminat"],
  "crystal": ["crystal", "gem", "jewel", "stone", "diamond", "emerald", "ruby", "sapphire"],
  "artifact": ["artifact", "relic", "treasure", "item", "object", "tool", "weapon", "crown"],
  "temple": ["temple", "shrine", "sanctuary", "cathedral", "church", "monastery", "altar"],
  "kingdom": ["kingdom", "realm", "empire", "land", "territory", "domain", "nation", "country"],
  "forest": ["forest", "woods", "tree", "woodland", "grove", "jungle", "wilderness"],
  "mountain": ["mountain", "peak", "summit", "cliff", "hill", "ridge", "highland"],
  "desert": ["desert", "sand", "dune", "oasis", "wasteland", "barren", "arid"],
  "legend": ["legend", "legendary", "myth", "mythical", "tale", "story", "saga", "epic"],
  "hero": ["hero", "champion", "savior", "protagonist", "chosen", "destined"],
  "villain": ["villain", "evil", "dark lord", "antagonist", "corrupt", "malevolent"],
  "power": ["power", "strength", "might", "force", "energy", "ability", "skill"],
  "academy": ["academy", "school", "university", "college", "institution", "learning", "education"],
  "ritual": ["ritual", "ceremony", "rite", "tradition", "custom", "practice", "observance"],
  "curse": ["curse", "cursed", "hex", "jinx", "doom", "bane", "affliction"],
  "blessing": ["blessing", "blessed", "grace", "favor", "benediction", "gift"],
  "spirit": ["spirit", "ghost", "soul", "wraith", "phantom", "essence", "ethereal"],
  "dragon": ["dragon", "drake", "wyrm", "serpent", "beast", "creature", "monster"],
  "festival": ["festival", "celebration", "feast", "holiday", "ceremony", "gathering"],
  "order": ["order", "organization", "guild", "brotherhood", "sisterhood", "society"],
  "scroll": ["scroll", "tome", "book", "manuscript", "text", "writing", "document"],
  "tower": ["tower", "spire", "citadel", "fortress", "castle", "stronghold"],
  "moon": ["moon", "lunar", "moonlight", "crescent", "eclipse", "celestial"],
  "star": ["star", "stellar", "constellation", "cosmic", "astral", "heavens"],
  "elemental": ["elemental", "element", "primal", "natural", "essence"],
  "portal": ["portal", "gateway", "passage", "doorway", "entrance", "threshold"],
  "treasure": ["treasure", "gold", "silver", "riches", "wealth", "fortune", "hoard"],
  "wisdom": ["wisdom", "knowledge", "lore", "learning", "insight", "understanding"],
  "healing": ["healing", "heal", "cure", "medicine", "remedy", "restoration", "recovery"]
};

export function analyzeContentForTags(content: string, title: string = "", category: string = ""): TagRecommendation[] {
  if (!content || content.trim().length === 0) {
    return [];
  }

  const recommendations: TagRecommendation[] = [];
  const fullText = `${title} ${content} ${category}`.toLowerCase();
  
  // Analyze each tag category
  Object.entries(TAG_KEYWORDS).forEach(([tag, keywords]) => {
    const matchedKeywords: string[] = [];
    let totalMatches = 0;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}`, 'gi');
      const matches = fullText.match(regex);
      if (matches) {
        matchedKeywords.push(keyword);
        totalMatches += matches.length;
      }
    });
    
    if (matchedKeywords.length > 0) {
      // Calculate confidence based on number of matches and keyword frequency
      const confidence = Math.min(0.95, (totalMatches * 0.2) + (matchedKeywords.length * 0.1));
      
      recommendations.push({
        tag,
        confidence,
        matchedKeywords: matchedKeywords.slice(0, 3) // Limit to top 3 matched keywords
      });
    }
  });
  
  // Sort by confidence and return top recommendations
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8); // Limit to top 8 recommendations
}

export function getRecommendedTags(content: string, title: string = "", category: string = ""): string[] {
  const recommendations = analyzeContentForTags(content, title, category);
  return recommendations
    .filter(rec => rec.confidence > 0.3) // Only include tags with reasonable confidence
    .map(rec => rec.tag);
}

// Get category-specific base tags
export function getCategoryBaseTags(category: string): string[] {
  const baseTags: Record<string, string[]> = {
    "History": ["ancient", "war", "legend", "kingdom", "hero"],
    "Religion": ["gods", "temple", "ritual", "blessing", "order"],
    "Artifacts": ["artifact", "crystal", "treasure", "power", "magic"],
    "Prophecies": ["prophecy", "vision", "future", "destiny", "oracle"],
    "Institutions": ["academy", "order", "learning", "knowledge", "wisdom"],
    "Customs": ["festival", "tradition", "ceremony", "culture", "celebration"],
    "Politics": ["kingdom", "power", "ruler", "law", "governance"],
    "Culture": ["tradition", "custom", "society", "people", "heritage"],
    "Geography": ["mountain", "forest", "desert", "kingdom", "territory"],
    "Legends": ["legend", "myth", "hero", "ancient", "tale"]
  };
  
  return baseTags[category] || [];
}