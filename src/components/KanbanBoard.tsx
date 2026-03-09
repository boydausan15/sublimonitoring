import React, { useState, useMemo } from "react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Project, ProjectStatus, STAGES } from "../types";
import KanbanColumn from "./KanbanColumn";
import ProjectCard from "./ProjectCard";

interface KanbanBoardProps {
  projects: Project[];
  onUpdateStatus: (id: number, status: ProjectStatus) => void;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, direction: 'prev' | 'next') => void;
}

export default function KanbanBoard({ projects, onUpdateStatus, onView, onEdit, onDelete, onMove }: KanbanBoardProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const projectsByStatus = useMemo(() => {
    const grouped: Record<ProjectStatus, Project[]> = STAGES.reduce((acc, stage) => {
      acc[stage] = [];
      return acc;
    }, {} as Record<ProjectStatus, Project[]>);

    projects.forEach(project => {
      if (grouped[project.status]) {
        grouped[project.status].push(project);
      }
    });

    return grouped;
  }, [projects]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const project = active.data.current as Project;
    setActiveProject(project);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: handle visual feedback during drag over
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeProject = active.data.current as Project;
      const overStatus = over.data.current?.status as ProjectStatus;
      
      if (overStatus && activeProject.status !== overStatus) {
        onUpdateStatus(activeProject.id, overStatus);
      }
    }
    
    setActiveProject(null);
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-slate-100/50 p-8">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-8 min-w-max h-full">
          {STAGES.map((status) => (
            <KanbanColumn 
              key={status} 
              status={status} 
              projects={projectsByStatus[status]} 
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.5',
              },
            },
          }),
        }}>
          {activeProject ? (
            <div className="w-80 rotate-3 scale-105 shadow-2xl">
              <ProjectCard 
                project={activeProject} 
                onView={() => {}} 
                onEdit={() => {}} 
                onDelete={() => {}} 
                onMove={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
