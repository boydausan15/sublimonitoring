import React from "react";
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight, User, FolderKanban } from "lucide-react";
import { Project, STAGES } from "../types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string | number) => void;
  onMove: (id: string | number, direction: 'prev' | 'next') => void;
}

export default function ProjectCard({ project, onView, onEdit, onDelete, onMove }: ProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `project-${project.id}`,
    data: project
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const currentStageIndex = STAGES.indexOf(project.status);
  const canMovePrev = currentStageIndex > 0;
  const canMoveNext = currentStageIndex < STAGES.length - 1;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="group bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
            {project.project_name}
          </h3>
          <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
            {project.tracking_number}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onView(project)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={() => onEdit(project)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit Project"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Project"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden mb-4 border border-slate-100">
        {project.design_proof_image ? (
          <img 
            src={project.design_proof_image} 
            alt={project.project_name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <FolderKanban size={32} />
          </div>
        )}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
          <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <User size={10} />
          </div>
          <span className="truncate max-w-[80px]">{project.created_by || 'Unknown'}</span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            disabled={!canMovePrev}
            onClick={() => onMove(project.id, 'prev')}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            disabled={!canMoveNext}
            onClick={() => onMove(project.id, 'next')}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
