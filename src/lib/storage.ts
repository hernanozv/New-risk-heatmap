import { Project } from '@/types';

const STORAGE_KEYS = {
  CURRENT_PROJECT_ID: 'heatmap_current_project_id',
  PROJECTS: 'heatmap_projects',
  USER_PREFERENCES: 'heatmap_preferences',
};

export function saveProject(project: Project): void {
  try {
    const projects = loadAllProjects();
    const index = projects.findIndex(p => p.id === project.id);

    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving project:', error);
    throw new Error('Failed to save project');
  }
}

export function loadAllProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) return [];

    const projects = JSON.parse(data);
    // Convert date strings back to Date objects
    return projects.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      risks: p.risks.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      })),
    }));
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

export function loadProject(id: string): Project | null {
  const projects = loadAllProjects();
  return projects.find(p => p.id === id) || null;
}

export function deleteProject(id: string): void {
  try {
    const projects = loadAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}

export function setCurrentProjectId(id: string | null): void {
  if (id === null) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PROJECT_ID);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROJECT_ID, id);
  }
}

export function getCurrentProjectId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_PROJECT_ID);
}
