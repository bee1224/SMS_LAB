import { createContext, useContext, useState, ReactNode } from 'react';

export interface Template {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface TemplateContextType {
  templates: Template[];
  addTemplate: (title: string, content: string) => void;
  updateTemplate: (id: number, title: string, content: string) => void;
  deleteTemplate: (id: number) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([]);

  const addTemplate = (title: string, content: string) => {
    const newTemplate: Template = {
      id: Math.max(...templates.map((t) => t.id), 0) + 1,
      title,
      content,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
  };

  const updateTemplate = (id: number, title: string, content: string) => {
    const updated = templates.map((t) =>
      t.id === id ? { ...t, title, content } : t
    );
    setTemplates(updated);
  };

  const deleteTemplate = (id: number) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
  };

  return (
    <TemplateContext.Provider value={{ templates, addTemplate, updateTemplate, deleteTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
}
