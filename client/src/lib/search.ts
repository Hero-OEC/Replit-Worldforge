// Enhanced search functionality for InkAlchemy
export interface SearchResult {
  id: number;
  type: 'character' | 'location' | 'timeline' | 'magic' | 'lore' | 'note';
  title: string;
  description?: string;
  category?: string;
  relevance: number;
  matchedFields: string[];
}

export function searchAcrossEntities(
  query: string,
  entities: {
    characters?: any[];
    locations?: any[];
    timelineEvents?: any[];
    magicSystems?: any[];
    loreEntries?: any[];
    notes?: any[];
  }
): SearchResult[] {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  
  // Search characters
  entities.characters?.forEach(item => {
    const relevance = calculateRelevance(searchTerms, item, ['name', 'description', 'role', 'backstory']);
    if (relevance > 0) {
      results.push({
        id: item.id,
        type: 'character',
        title: item.name,
        description: item.description,
        category: item.role,
        relevance,
        matchedFields: getMatchedFields(searchTerms, item, ['name', 'description', 'role', 'backstory'])
      });
    }
  });
  
  // Search locations
  entities.locations?.forEach(item => {
    const relevance = calculateRelevance(searchTerms, item, ['name', 'description', 'geography', 'culture']);
    if (relevance > 0) {
      results.push({
        id: item.id,
        type: 'location',
        title: item.name,
        description: item.description,
        category: item.significance,
        relevance,
        matchedFields: getMatchedFields(searchTerms, item, ['name', 'description', 'geography', 'culture'])
      });
    }
  });
  
  // Search timeline events
  entities.timelineEvents?.forEach(item => {
    const relevance = calculateRelevance(searchTerms, item, ['title', 'description', 'category', 'location']);
    if (relevance > 0) {
      results.push({
        id: item.id,
        type: 'timeline',
        title: item.title,
        description: item.description,
        category: item.category,
        relevance,
        matchedFields: getMatchedFields(searchTerms, item, ['title', 'description', 'category', 'location'])
      });
    }
  });
  
  // Search magic systems
  entities.magicSystems?.forEach(item => {
    const relevance = calculateRelevance(searchTerms, item, ['name', 'description', 'rules', 'source']);
    if (relevance > 0) {
      results.push({
        id: item.id,
        type: 'magic',
        title: item.name,
        description: item.description,
        category: item.category,
        relevance,
        matchedFields: getMatchedFields(searchTerms, item, ['name', 'description', 'rules', 'source'])
      });
    }
  });
  
  // Search lore entries
  entities.loreEntries?.forEach(item => {
    const relevance = calculateRelevance(searchTerms, item, ['title', 'content', 'category']);
    if (relevance > 0) {
      results.push({
        id: item.id,
        type: 'lore',
        title: item.title,
        description: item.content?.substring(0, 100) + '...',
        category: item.category,
        relevance,
        matchedFields: getMatchedFields(searchTerms, item, ['title', 'content', 'category'])
      });
    }
  });
  
  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 20);
}

function calculateRelevance(searchTerms: string[], item: any, fields: string[]): number {
  let relevance = 0;
  
  fields.forEach(field => {
    const value = item[field]?.toLowerCase() || '';
    searchTerms.forEach(term => {
      if (value.includes(term)) {
        // Exact matches get higher scores
        if (value === term) relevance += 10;
        else if (value.startsWith(term)) relevance += 5;
        else relevance += 2;
      }
    });
  });
  
  return relevance;
}

function getMatchedFields(searchTerms: string[], item: any, fields: string[]): string[] {
  const matched: string[] = [];
  
  fields.forEach(field => {
    const value = item[field]?.toLowerCase() || '';
    if (searchTerms.some(term => value.includes(term))) {
      matched.push(field);
    }
  });
  
  return matched;
}