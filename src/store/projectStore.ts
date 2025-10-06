import { create } from 'zustand';
import { Project, Risk } from '@/types';
import { DEFAULT_CONFIG } from '@/data/defaultConfig';
import { EXAMPLE_RISKS } from '@/data/exampleRisks';
import {
  loadAllProjects,
  saveProject,
  deleteProject as deleteProjectFromStorage,
  setCurrentProjectId,
  getCurrentProjectId,
} from '@/lib/storage';

interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];

  // Zoom and Pan state
  zoomLevel: number;
  panOffset: { x: number; y: number };

  // Project actions
  loadProjects: () => void;
  setCurrentProject: (id: string) => void;
  createProject: (name: string, description?: string) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  // Risk actions
  addRisk: (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRisk: (id: string, risk: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;

  // Zoom and Pan actions
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  projects: [],
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },

  loadProjects: () => {
    const projects = loadAllProjects();

    // If no projects exist, create a default one with example risks
    if (projects.length === 0) {
      const defaultProject: Project = {
        id: crypto.randomUUID(),
        name: 'Proyecto de Ejemplo',
        description: 'Proyecto inicial con riesgos de ejemplo',
        risks: EXAMPLE_RISKS,
        config: DEFAULT_CONFIG,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
      };
      saveProject(defaultProject);
      setCurrentProjectId(defaultProject.id);
      set({ projects: [defaultProject], currentProject: defaultProject });
      return;
    }

    // Load current project
    const currentId = getCurrentProjectId();
    const currentProject = currentId
      ? projects.find(p => p.id === currentId) || projects[0]
      : projects[0];

    set({ projects, currentProject });
  },

  setCurrentProject: (id: string) => {
    const { projects } = get();
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProjectId(id);
      set({ currentProject: project });
    }
  },

  createProject: (name: string, description?: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      risks: [],
      config: DEFAULT_CONFIG,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
    };

    saveProject(newProject);
    setCurrentProjectId(newProject.id);

    const projects = loadAllProjects();
    set({ projects, currentProject: newProject });
  },

  updateProject: (project: Project) => {
    const updatedProject = {
      ...project,
      updatedAt: new Date(),
    };

    saveProject(updatedProject);

    const projects = loadAllProjects();
    set({ projects, currentProject: updatedProject });
  },

  deleteProject: (id: string) => {
    deleteProjectFromStorage(id);
    const projects = loadAllProjects();

    // If we deleted the current project, switch to first available
    const { currentProject } = get();
    if (currentProject?.id === id) {
      const newCurrent = projects[0] || null;
      setCurrentProjectId(newCurrent?.id || null);
      set({ projects, currentProject: newCurrent });
    } else {
      set({ projects });
    }
  },

  addRisk: (riskData) => {
    const { currentProject } = get();
    if (!currentProject) return;

    // Generate ID
    const existingIds = currentProject.risks.map(r => r.id);
    let newId = `R${currentProject.risks.length + 1}`;
    let counter = currentProject.risks.length + 1;
    while (existingIds.includes(newId)) {
      counter++;
      newId = `R${counter}`;
    }

    const newRisk: Risk = {
      ...riskData,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProject = {
      ...currentProject,
      risks: [...currentProject.risks, newRisk],
      updatedAt: new Date(),
    };

    saveProject(updatedProject);
    const projects = loadAllProjects();
    set({ projects, currentProject: updatedProject });
  },

  updateRisk: (id: string, riskData: Partial<Risk>) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const updatedRisks = currentProject.risks.map(risk =>
      risk.id === id ? { ...risk, ...riskData, updatedAt: new Date() } : risk
    );

    const updatedProject = {
      ...currentProject,
      risks: updatedRisks,
      updatedAt: new Date(),
    };

    saveProject(updatedProject);
    const projects = loadAllProjects();
    set({ projects, currentProject: updatedProject });
  },

  deleteRisk: (id: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const updatedRisks = currentProject.risks.filter(risk => risk.id !== id);

    const updatedProject = {
      ...currentProject,
      risks: updatedRisks,
      updatedAt: new Date(),
    };

    saveProject(updatedProject);
    const projects = loadAllProjects();
    set({ projects, currentProject: updatedProject });
  },

  // Zoom and Pan actions
  setZoomLevel: (level: number) => {
    set({ zoomLevel: Math.max(0.5, Math.min(level, 5)) });
  },

  zoomIn: () => {
    const { zoomLevel } = get();
    // Incremento más suave: 15% en lugar de 20%
    set({ zoomLevel: Math.min(zoomLevel * 1.15, 5) });
  },

  zoomOut: () => {
    const { zoomLevel } = get();
    // Decremento más suave: 15% en lugar de 20%
    set({ zoomLevel: Math.max(zoomLevel / 1.15, 0.5) });
  },

  resetZoom: () => {
    set({ zoomLevel: 1, panOffset: { x: 0, y: 0 } });
  },

  setPanOffset: (offset: { x: number; y: number }) => {
    set({ panOffset: offset });
  },
}));
