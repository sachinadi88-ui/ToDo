
import React, { useState, useEffect, useRef } from 'react';
import { Task, Note, ViewType, TaskStatus, TaskPriority } from './types';
import { Icons, COLORS } from './constants';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import Notes from './components/Notes';

// Robust UUID generator fallback for non-secure contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const isLoaded = useRef(false);

  // Load initial data once on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('nexus_tasks');
      const savedNotes = localStorage.getItem('nexus_notes');
      
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) setTasks(parsedTasks);
      }
      
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) setNotes(parsedNotes);
      }
    } catch (e) {
      console.error("Failed to load data from storage", e);
    } finally {
      isLoaded.current = true;
    }
  }, []);

  // Save data whenever it changes, but only after initial load is complete
  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!isLoaded.current) return;
    localStorage.setItem('nexus_notes', JSON.stringify(notes));
  }, [notes]);

  const addTask = (title: string, description: string, priority: TaskPriority) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      status: TaskStatus.TODO,
      priority,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNote = () => {
    const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];
    const newNote: Note = {
      id: generateId(),
      title: 'New Note',
      content: '',
      updatedAt: Date.now(),
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleResetWorkspace = () => {
    // 1. Clear state immediately to refresh UI
    setTasks([]);
    setNotes([]);
    
    // 2. Clear specific Local Storage keys
    localStorage.removeItem('nexus_tasks');
    localStorage.removeItem('nexus_notes');
    
    // 3. Reset confirmation UI and go home
    setIsConfirmingReset(false);
    setCurrentView('dashboard');
    
    console.log("Workspace cleared successfully.");
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} notes={notes} />;
      case 'tasks':
        return <TaskBoard tasks={tasks} onAddTask={addTask} onUpdateStatus={updateTaskStatus} onDeleteTask={deleteTask} />;
      case 'notes':
        return <Notes notes={notes} onAddNote={addNote} onUpdateNote={updateNote} onDeleteNote={deleteNote} />;
      case 'settings':
        return (
          <div className="p-8 max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-3xl font-bold mb-8 text-white">Workspace Settings</h1>
            
            <div className="space-y-6">
              <section className="bg-[#171717] p-6 rounded-2xl border border-[#262626]">
                <h2 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                  <span className="text-blue-500"><Icons.Dashboard /></span>
                  Data Privacy & Storage
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Task Manager operates entirely within your browser. All data is stored in your 
                  Local Storage and never leaves your device. This ensures maximum privacy and offline availability.
                </p>
                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#262626]">
                  <div>
                    <p className="text-sm font-medium text-gray-200">Local Storage Used</p>
                    <p className="text-xs text-gray-500">Approx. {Math.round((JSON.stringify(tasks).length + JSON.stringify(notes).length) / 1024)} KB</p>
                  </div>
                  <div className="text-blue-500 text-xs font-bold uppercase tracking-wider">Active</div>
                </div>
              </section>

              <section className="bg-[#171717] p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-lg font-semibold mb-2 text-red-500 flex items-center gap-2">
                  <Icons.Trash />
                  Danger Zone
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Resetting the workspace will permanently delete all tasks, notes, and preferences. 
                  This action cannot be undone.
                </p>
                
                {!isConfirmingReset ? (
                  <button 
                    onClick={() => setIsConfirmingReset(true)}
                    className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all font-semibold"
                  >
                    Reset All Workspace Data
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 animate-scaleIn">
                    <p className="text-red-400 text-sm font-bold">Are you absolutely sure?</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleResetWorkspace}
                        className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-900/40"
                      >
                        Yes, Delete Everything
                      </button>
                      <button 
                        onClick={() => setIsConfirmingReset(false)}
                        className="flex-1 px-6 py-2.5 bg-[#262626] text-gray-300 rounded-lg hover:bg-[#333] transition-all font-semibold border border-[#444]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        );
      default:
        return <Dashboard tasks={tasks} notes={notes} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#262626] flex flex-col bg-[#0a0a0a]">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">T</div>
            Task Manager
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setIsConfirmingReset(false); }} icon={<Icons.Dashboard />} label="Dashboard" />
          <NavItem active={currentView === 'tasks'} onClick={() => { setCurrentView('tasks'); setIsConfirmingReset(false); }} icon={<Icons.Tasks />} label="Tasks" />
          <NavItem active={currentView === 'notes'} onClick={() => { setCurrentView('notes'); setIsConfirmingReset(false); }} icon={<Icons.Notes />} label="Notes" />
        </nav>

        <div className="p-4 border-t border-[#262626]">
          <NavItem active={currentView === 'settings'} onClick={() => setCurrentView('settings')} icon={<Icons.Settings />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#0a0a0a]">
        {renderView()}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      active 
      ? 'bg-blue-600/10 text-blue-500' 
      : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className={active ? 'text-blue-500' : 'text-gray-500'}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default App;
