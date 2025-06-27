// Data export/import functionality for InkAlchemy
import type { Project, Character, Location, TimelineEvent, MagicSystem, LoreEntry } from "@shared/schema";

export interface ProjectExport {
  project: Project;
  characters: Character[];
  locations: Location[];
  timelineEvents: TimelineEvent[];
  magicSystems: MagicSystem[];
  loreEntries: LoreEntry[];
  exportedAt: string;
  version: string;
}

export async function exportProject(projectId: string): Promise<ProjectExport> {
  const responses = await Promise.all([
    fetch(`/api/projects/${projectId}`),
    fetch(`/api/characters?projectId=${projectId}`),
    fetch(`/api/locations?projectId=${projectId}`),
    fetch(`/api/timeline-events?projectId=${projectId}`),
    fetch(`/api/magic-systems?projectId=${projectId}`),
    fetch(`/api/lore-entries?projectId=${projectId}`)
  ]);

  const [project, characters, locations, timelineEvents, magicSystems, loreEntries] = 
    await Promise.all(responses.map(r => r.json()));

  return {
    project,
    characters,
    locations,
    timelineEvents,
    magicSystems,
    loreEntries,
    exportedAt: new Date().toISOString(),
    version: "1.0"
  };
}

export function downloadProjectExport(exportData: ProjectExport, filename?: string) {
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${exportData.project.title.replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToMarkdown(exportData: ProjectExport): string {
  const { project, characters, locations, timelineEvents, magicSystems, loreEntries } = exportData;
  
  let markdown = `# ${project.title}\n\n`;
  markdown += `**Genre:** ${project.genre}\n\n`;
  markdown += `**Description:** ${project.description}\n\n`;
  markdown += `**Status:** ${project.status}\n\n`;
  markdown += `---\n\n`;

  // Characters section
  if (characters.length > 0) {
    markdown += `## Characters\n\n`;
    characters.forEach(char => {
      markdown += `### ${char.name}\n\n`;
      if (char.role) markdown += `**Role:** ${char.role}\n\n`;
      if (char.description) markdown += `${char.description}\n\n`;
      if (char.appearance) markdown += `**Appearance:** ${char.appearance}\n\n`;
      if (char.personality) markdown += `**Personality:** ${char.personality}\n\n`;
      if (char.backstory) markdown += `**Backstory:** ${char.backstory}\n\n`;
      markdown += `---\n\n`;
    });
  }

  // Locations section
  if (locations.length > 0) {
    markdown += `## Locations\n\n`;
    locations.forEach(loc => {
      markdown += `### ${loc.name}\n\n`;
      if (loc.description) markdown += `${loc.description}\n\n`;
      if (loc.geography) markdown += `**Geography:** ${loc.geography}\n\n`;
      if (loc.culture) markdown += `**Culture:** ${loc.culture}\n\n`;
      if (loc.significance) markdown += `**Significance:** ${loc.significance}\n\n`;
      markdown += `---\n\n`;
    });
  }

  // Timeline section
  if (timelineEvents.length > 0) {
    markdown += `## Timeline\n\n`;
    const sortedEvents = [...timelineEvents].sort((a, b) => a.order - b.order);
    sortedEvents.forEach(event => {
      markdown += `### ${event.title}\n\n`;
      if (event.date) markdown += `**Date:** ${event.date}\n\n`;
      if (event.category) markdown += `**Category:** ${event.category}\n\n`;
      if (event.description) markdown += `${event.description}\n\n`;
      markdown += `---\n\n`;
    });
  }

  // Magic Systems section
  if (magicSystems.length > 0) {
    markdown += `## Magic & Power Systems\n\n`;
    magicSystems.forEach(system => {
      markdown += `### ${system.name}\n\n`;
      if (system.category) markdown += `**Type:** ${system.category}\n\n`;
      if (system.description) markdown += `${system.description}\n\n`;
      if (system.rules) markdown += `**Rules:** ${system.rules}\n\n`;
      if (system.limitations) markdown += `**Limitations:** ${system.limitations}\n\n`;
      if (system.source) markdown += `**Source:** ${system.source}\n\n`;
      if (system.cost) markdown += `**Cost:** ${system.cost}\n\n`;
      markdown += `---\n\n`;
    });
  }

  // Lore section
  if (loreEntries.length > 0) {
    markdown += `## Lore\n\n`;
    loreEntries.forEach(entry => {
      markdown += `### ${entry.title}\n\n`;
      if (entry.category) markdown += `**Category:** ${entry.category}\n\n`;
      if (entry.content) markdown += `${entry.content}\n\n`;
      markdown += `---\n\n`;
    });
  }

  markdown += `\n*Exported from InkAlchemy on ${new Date().toLocaleDateString()}*`;
  return markdown;
}

export function downloadMarkdownExport(exportData: ProjectExport, filename?: string) {
  const markdown = exportToMarkdown(exportData);
  const dataBlob = new Blob([markdown], { type: 'text/markdown' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${exportData.project.title.replace(/\s+/g, '_')}_export_${new Date().toISOString().split('T')[0]}.md`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}