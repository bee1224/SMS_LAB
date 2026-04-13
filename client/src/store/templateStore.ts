import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Template {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface TemplateStore {
  templates: Template[];
  addTemplate: (title: string, content: string) => void;
  updateTemplate: (id: number, title: string, content: string) => void;
  deleteTemplate: (id: number) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      templates: [],

      addTemplate: (title: string, content: string) =>
        set((state) => {
          const newTemplate: Template = {
            id: Math.max(...state.templates.map((t) => t.id), 0) + 1,
            title,
            content,
            createdAt: new Date().toISOString().split('T')[0],
          };
          return { templates: [...state.templates, newTemplate] };
        }),

      updateTemplate: (id: number, title: string, content: string) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, title, content } : t
          ),
        })),

      deleteTemplate: (id: number) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'template-store',
    }
  )
);
