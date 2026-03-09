import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Project, ProjectStatus } from "../types";
import ProjectCard from "./ProjectCard";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface KanbanColumnProps {
  key?: React.Key;
  status: ProjectStatus;
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, direction: 'prev' | 'next') => void;
}

export default function KanbanColumn({ status, projects, onView, onEdit, onDelete, onMove }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-80 bg-slate-50/50 rounded-3xl border-2 border-transparent transition-all min-h-[calc(100vh-12rem)]",
        isOver && "bg-indigo-50/50 border-indigo-200"
      )}
    >
      <div className="p-5 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm z-[5] rounded-t-3xl border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">{status}</h2>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
            {projects.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
        {projects.length === 0 && (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium italic">
            No projects in this stage
          </div>
        )}
      </div>
    </div>
  );
}
