//project\src\App.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Settings, FolderPlus } from 'lucide-react';
import { HabitCard } from './components/HabitCard';
import { NewHabitModal } from './components/NewHabitModal';
import { StatsPanel } from './components/StatsPanel';
import api  from './lib/api'; // assuming api.ts handles requests using fetch
import './i18n'; 

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Habit {
  id: string;
  project_id: string;
  name: string;
  description: string;
  streak: number;
  completed_today: boolean;
}

interface Stats {
  total: number;
  completed: number;
  streaks: number;
}

function App() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, streaks: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchHabits();
      fetchStats();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const data = await api.projects.getAll();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0].id); // auto-select the first project
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchHabits = async () => {
    if (!selectedProject) return;
    try {
      const data = await api.habits.getAll(selectedProject);
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const fetchStats = async () => {
    if (!selectedProject) return;
    try {
      const data = await api.habits.getStats(selectedProject);
      setStats(data || { total: 0, completed: 0, streaks: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleNewHabit = async (habitData: { name: string; description: string }) => {
    if (!selectedProject) return;
    try {
      await api.habits.create({
        ...habitData,
        project_id: selectedProject,
        streak: 0,
        completed_today: false,
      });
      setIsModalOpen(false);
      fetchHabits();
      fetchStats();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleToggleHabit = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    try {
      await api.habits.toggle(id);
      fetchHabits();
      fetchStats();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      await api.habits.delete(id);
      fetchHabits();
      fetchStats();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleNewProject = async () => {
    const name = prompt(t('projectName') || 'Project Name');
    if (!name) return;

    try {
      const project = await api.projects.create({ name, description: '' });
      setProjects((prev) => [...prev, project]);
      setSelectedProject(project.id);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('appName')}</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewProject}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <FolderPlus size={18} className="mr-2" />
                {t('newProject')}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                disabled={!selectedProject}
              >
                <Plus size={20} className="mr-2" />
                {t('newHabit')}
              </button>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isSettingsOpen && (
        <div className="absolute right-4 top-16 mt-2 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="text-lg font-medium mb-2">{t('language')}</h3>
          <div className="space-y-2">
            <button
              onClick={() => changeLanguage('en')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
            >
              {t('english')}
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
            >
              {t('french')}
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('selectProject')}</label>
            <select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full md:w-1/2 p-2 border rounded-md"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedProject && (
          <>
            <StatsPanel stats={stats} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggleHabit}
                  onEdit={() => {}}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <NewHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleNewHabit}
      />
    </div>
  );
}

export default App;
