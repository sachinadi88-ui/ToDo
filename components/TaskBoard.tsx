
import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { Icons } from '../constants';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (title: string, description: string, priority: TaskPriority) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDeleteTask: (id: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onAddTask, onUpdateStatus, onDeleteTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle, newDesc, newPriority);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  const renderColumn = (status: TaskStatus, label: string) => {
    const columnTasks = tasks.filter(t => t.status === status);
    return (
      <div className="flex-1 min-w-[280px] md:min-w-[320px] flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              status === TaskStatus.TODO ? 'bg-indigo-500' : 
              status === TaskStatus.IN_PROGRESS ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{label}</h3>
          </div>
          <span className="bg-[#262626] text-gray-400 text-[10px] px-2 py-0.5 rounded-md font-black">
            {columnTasks.length}
          </span>
        </div>
        
        <div className="flex flex-col gap-3 min-h-[150px]">
          {columnTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onMove={(s) => onUpdateStatus(task.id, s)} 
              onDelete={() => onDeleteTask(task.id)} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Tasks</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Organize your projects and progress.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 md:py-2 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Icons.Plus /> <span className="font-bold text-sm">New Task</span>
        </button>
      </div>

      <div className="flex gap-4 md:gap-8 flex-1 overflow-x-auto pb-8 snap-x snap-mandatory">
        <div className="snap-center">{renderColumn(TaskStatus.TODO, 'To Do')}</div>
        <div className="snap-center">{renderColumn(TaskStatus.IN_PROGRESS, 'In Progress')}</div>
        <div className="snap-center">{renderColumn(TaskStatus.DONE, 'Completed')}</div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-[60] p-0 md:p-4">
          <form 
            onSubmit={handleSubmit} 
            className="bg-[#171717] border-t md:border border-[#262626] p-6 rounded-t-3xl md:rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn md:animate-scaleIn"
          >
            <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-6 md:hidden" />
            <h2 className="text-xl font-bold mb-6 text-white text-center md:text-left">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Task Title</label>
                <input 
                  autoFocus
                  className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 outline-none transition-all text-sm text-white"
                  placeholder="What needs to be done?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                <textarea 
                  className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 outline-none transition-all text-sm h-28 resize-none text-white"
                  placeholder="Add some context..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Set Priority</label>
                <div className="flex gap-2">
                  {[TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                        newPriority === p 
                        ? (p === TaskPriority.HIGH ? 'bg-red-500/10 border-red-500 text-red-500 shadow-lg shadow-red-500/10' : p === TaskPriority.MEDIUM ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/10' : 'bg-blue-500/10 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/10')
                        : 'bg-[#0a0a0a] border-[#262626] text-gray-500 hover:bg-[#111]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 text-gray-400 hover:text-white font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-900/30 transition-all active:scale-[0.97]"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const TaskCard: React.FC<{ task: Task; onMove: (s: TaskStatus) => void; onDelete: () => void }> = ({ task, onMove, onDelete }) => {
  return (
    <div className="bg-[#171717] border border-[#262626] p-4 rounded-2xl group hover:border-[#333] transition-all hover:shadow-xl relative overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
          task.priority === TaskPriority.HIGH ? 'bg-red-500/10 text-red-500' :
          task.priority === TaskPriority.MEDIUM ? 'bg-amber-500/10 text-amber-500' :
          'bg-blue-500/10 text-blue-500'
        }`}>
          {task.priority}
        </span>
        <button 
          onClick={onDelete} 
          className="text-gray-600 hover:text-red-500 transition-colors md:opacity-0 group-hover:opacity-100 p-1"
        >
          <Icons.Trash />
        </button>
      </div>
      <h4 className="font-bold text-white mb-2 leading-snug">{task.title}</h4>
      {task.description && <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>}
      
      <div className="flex items-center gap-1.5 pt-4 mt-1 border-t border-[#232323]">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mr-auto">Move to:</p>
        {task.status !== TaskStatus.TODO && (
          <button onClick={() => onMove(TaskStatus.TODO)} className="text-[9px] font-black uppercase tracking-tighter text-gray-400 hover:text-white bg-[#222] px-2 py-1.5 rounded-lg transition-colors">Todo</button>
        )}
        {task.status !== TaskStatus.IN_PROGRESS && (
          <button onClick={() => onMove(TaskStatus.IN_PROGRESS)} className="text-[9px] font-black uppercase tracking-tighter text-gray-400 hover:text-white bg-[#222] px-2 py-1.5 rounded-lg transition-colors">Active</button>
        )}
        {task.status !== TaskStatus.DONE && (
          <button onClick={() => onMove(TaskStatus.DONE)} className="text-[9px] font-black uppercase tracking-tighter text-gray-400 hover:text-white bg-[#222] px-2 py-1.5 rounded-lg transition-colors">Done</button>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
