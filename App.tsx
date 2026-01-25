
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Save data whenever it changes
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
    setTasks([]);
    setNotes([]);
    localStorage.removeItem('nexus_tasks');
    localStorage.removeItem('nexus_notes');
    setIsConfirmingReset(false);
    setCurrentView('dashboard');
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
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
          <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">Workspace Settings</h1>
            
            <div className="space-y-6">
              <section className="bg-[#171717] p-5 md:p-6 rounded-2xl border border-[#262626]">
                <h2 className="text-lg font-semibold mb-2 text-white flex items-center gap-2">
                  <span className="text-blue-500"><Icons.Dashboard /></span>
                  Data Privacy & Storage
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Task Manager operates entirely within your browser. All data is stored in your 
                  Local Storage and never leaves your device.
                </p>
                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#262626]">
                  <div>
                    <p className="text-sm font-medium text-gray-200">Local Storage Used</p>
                    <p className="text-xs text-gray-500">Approx. {Math.round((JSON.stringify(tasks).length + JSON.stringify(notes).length) / 1024)} KB</p>
                  </div>
                  <div className="text-blue-500 text-xs font-bold uppercase tracking-wider">Active</div>
                </div>
              </section>

              <section className="bg-[#171717] p-5 md:p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-lg font-semibold mb-2 text-red-500 flex items-center gap-2">
                  <Icons.Trash />
                  Danger Zone
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Resetting the workspace will permanently delete all tasks, notes, and preferences.
                </p>
                
                {!isConfirmingReset ? (
                  <button 
                    onClick={() => setIsConfirmingReset(true)}
                    className="w-full md:w-auto px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-all font-semibold"
                  >
                    Reset All Workspace Data
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 animate-scaleIn">
                    <p className="text-red-400 text-sm font-bold">Are you absolutely sure?</p>
                    <div className="flex flex-col md:flex-row gap-3">
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
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fadeIn" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 md:w-64 border-r border-[#262626] flex flex-col bg-[#0a0a0a] z-50 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">T</div>
            Task Manager
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <nav className="px-4 space-y-1 mt-4">
          <NavItem active={currentView === 'dashboard'} onClick={() => { setCurrentView('dashboard'); setIsConfirmingReset(false); closeSidebarOnMobile(); }} icon={<Icons.Dashboard />} label="Dashboard" />
          <NavItem active={currentView === 'tasks'} onClick={() => { setCurrentView('tasks'); setIsConfirmingReset(false); closeSidebarOnMobile(); }} icon={<Icons.Tasks />} label="Tasks" />
          <NavItem active={currentView === 'notes'} onClick={() => { setCurrentView('notes'); setIsConfirmingReset(false); closeSidebarOnMobile(); }} icon={<Icons.Notes />} label="Notes" />
          <NavItem active={currentView === 'settings'} onClick={() => { setCurrentView('settings'); setIsConfirmingReset(false); closeSidebarOnMobile(); }} icon={<Icons.Settings />} label="Settings" />
          
          <div className="pt-8 pb-4 px-3 pointer-events-none select-none">
            <div className="h-px w-8 bg-gradient-to-r from-gray-800 to-transparent mb-4" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-700 font-bold mb-1.5">
              Crafted with care
            </p>
            <p className="text-[11px] font-medium italic text-gray-500">
              designed by: <span className="not-italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Sachin Adi</span>
            </p>
          </div>
        </nav>

        <div className="flex-1" />
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0a0a0a] z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          </button>
          <div className="text-white font-bold text-sm tracking-widest uppercase">
            {currentView}
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold text-xs">
            U
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all duration-200 ${
      active 
      ? 'bg-blue-600/10 text-blue-500 shadow-[inset_0_0_12px_rgba(37,99,235,0.05)]' 
      : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className={active ? 'text-blue-500' : 'text-gray-500'}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default App;
