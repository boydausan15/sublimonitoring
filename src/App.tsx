import { useState, useEffect, useMemo } from 'react';
import Sidebar, { MenuItem } from './components/Sidebar';
import TopBar from './components/TopBar';
import KanbanBoard from './components/KanbanBoard';
import Dashboard from './components/Dashboard';
import ProjectModal from './components/ProjectModal';
import { Project, ProjectStatus, STAGES } from './types';
import { FolderKanban, Plus } from 'lucide-react';

export default function App() {
  const [activeItem, setActiveItem] = useState<MenuItem>('Dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async (retries = 10) => {
    setIsLoading(true);
    try {
      const url = '/api/projects';
      console.log(`Fetching projects from ${url}... (Attempt ${11 - retries})`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setProjects(data);
      console.log("Projects fetched successfully:", data.length, "items");
    } catch (error) {
      console.error('Fetch error details:', error);
      
      if (retries > 0) {
        // Faster retries initially (500ms), then progressive
        const delay = retries > 7 ? 500 : Math.min((11 - retries) * 1000, 5000);
        console.log(`Retrying in ${delay}ms...`);
        setTimeout(() => fetchProjects(retries - 1), delay);
      } else {
        console.error("All fetch attempts failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectData: Partial<Project>) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (response.ok) {
        fetchProjects();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (projectData: Partial<Project>) => {
    if (!selectedProject) return;
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (response.ok) {
        fetchProjects();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: ProjectStatus) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleMoveProject = (id: number, direction: 'prev' | 'next') => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    const currentIndex = STAGES.indexOf(project.status);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < STAGES.length) {
      handleUpdateStatus(id, STAGES[nextIndex]);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tracking_number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const openViewModal = (project: Project) => {
    setModalMode('view');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (isLoading && projects.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-500">Connecting to Production Database...</p>
            <p className="text-xs text-slate-400">This may take a moment while the server starts up.</p>
          </div>
        </div>
      );
    }

    if (projects.length === 0 && !isLoading && searchQuery === '') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-3xl flex items-center justify-center mb-6">
            <FolderKanban size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Projects Found</h3>
          <p className="text-slate-500 max-w-md mb-8">
            It looks like there are no projects in the database yet. Click the button below to create your first production project.
          </p>
          <button 
            onClick={openCreateModal}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
          >
            <Plus size={20} />
            Create First Project
          </button>
          <button 
            onClick={() => fetchProjects()}
            className="mt-4 text-indigo-600 text-sm font-bold hover:underline"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    switch (activeItem) {
      case 'Dashboard':
        return <Dashboard projects={projects} />;
      case 'Projects':
        return (
          <KanbanBoard 
            projects={filteredProjects} 
            onUpdateStatus={handleUpdateStatus}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={handleDeleteProject}
            onMove={handleMoveProject}
          />
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 font-medium italic">
            {activeItem} View is coming soon...
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar 
          onNewProject={openCreateModal} 
          onSearch={setSearchQuery} 
        />

        {renderContent()}
      </main>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        project={selectedProject}
        onDelete={handleDeleteProject}
        onSubmit={modalMode === 'create' ? handleCreateProject : handleUpdateProject}
      />
    </div>
  );
}
