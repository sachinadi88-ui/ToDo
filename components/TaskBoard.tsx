
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
      <div className="flex-1 min-w-[300px] flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              status === TaskStatus.TODO ? 'bg-indigo-500' : 
              status === TaskStatus.IN_PROGRESS ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-xs">{label}</h3>
          </div>
          <span className="bg-[#262626] text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {columnTasks.length}
          </span>
        </div>
        
        <div className="flex flex-col gap-3 min-h-[200px]">
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
    <div className="p-8 h-full flex flex-col animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your workflow and track progress.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
        >
          <Icons.Plus /> New Task
        </button>
      </div>

      <div className="flex gap-8 flex-1 overflow-x-auto pb-8">
        {renderColumn(TaskStatus.TODO, 'To Do')}
        {renderColumn(TaskStatus.IN_PROGRESS, 'In Progress')}
        {renderColumn(TaskStatus.DONE, 'Completed')}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-[#171717] border border-[#262626] p-6 rounded-2xl w-full max-w-md shadow-2xl animate-scaleIn">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Title</label>
                <input 
                  autoFocus
                  className="w-full bg-[#262626] border border-transparent focus:border-blue-500 rounded-lg px-3 py-2 outline-none transition-all text-sm"
                  placeholder="Task title..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Description</label>
                <textarea 
                  className="w-full bg-[#262626] border border-transparent focus:border-blue-500 rounded-lg px-3 py-2 outline-none transition-all text-sm h-24 resize-none"
                  placeholder="Additional details..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Priority</label>
                <div className="flex gap-2">
                  {[TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold capitalize border transition-all ${
                        newPriority === p 
                        ? (p === TaskPriority.HIGH ? 'bg-red-500/20 border-red-500 text-red-500' : p === TaskPriority.MEDIUM ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-blue-500/20 border-blue-500 text-blue-500')
                        : 'bg-[#262626] border-transparent text-gray-400 hover:bg-[#333]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 text-gray-400 hover:text-white font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-[2] py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                Add Task
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
    <div className="bg-[#171717] border border-[#262626] p-4 rounded-xl group hover:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
          task.priority === TaskPriority.HIGH ? 'bg-red-500/10 text-red-500' :
          task.priority === TaskPriority.MEDIUM ? 'bg-amber-500/10 text-amber-500' :
          'bg-blue-500/10 text-blue-500'
        }`}>
          {task.priority}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onDelete} className="text-gray-500 hover:text-red-500 transition-colors"><Icons.Trash /></button>
        </div>
      </div>
      <h4 className="font-semibold text-gray-100 mb-1 leading-tight">{task.title}</h4>
      {task.description && <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>}
      
      <div className="flex items-center gap-1 pt-3 border-t border-[#262626]">
        {task.status !== TaskStatus.TODO && (
          <button onClick={() => onMove(TaskStatus.TODO)} className="text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors">Todo</button>
        )}
        {task.status !== TaskStatus.IN_PROGRESS && (
          <button onClick={() => onMove(TaskStatus.IN_PROGRESS)} className="text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors">In Progress</button>
        )}
        {task.status !== TaskStatus.DONE && (
          <button onClick={() => onMove(TaskStatus.DONE)} className="text-[10px] text-gray-500 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors">Done</button>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
