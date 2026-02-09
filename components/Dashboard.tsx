
import React from 'react';
// Added Note to the import list to fix "Cannot find name 'Note'" error on line 8
import { Task, TaskStatus, TaskPriority, Note } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  notes: Note[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, notes }) => {
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.DONE);
  const highPriorityTasks = tasks.filter(t => t.priority === TaskPriority.HIGH && t.status !== TaskStatus.DONE).length;

  const chartData = [
    { name: 'Todo', value: tasks.filter(t => t.status === TaskStatus.TODO).length, color: '#6366f1' },
    { name: 'Active', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#f59e0b' },
    { name: 'Done', value: completedTasks, color: '#10b981' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fadeIn">
      <header className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">Welcome back, User</h1>
        <p className="text-gray-400 text-sm md:text-base">Your workspace productivity at a glance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard title="Active Tasks" value={pendingTasks.length} subtitle={`${highPriorityTasks} high priority`} color="text-blue-500" />
        <StatCard title="Completed" value={completedTasks} subtitle="Successfully finished" color="text-green-500" />
        <StatCard title="Total Notes" value={notes.length} subtitle="Thought repository" color="text-purple-500" />
      </div>

      {/* Visualizations & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
        <div className="bg-[#171717] p-5 md:p-6 rounded-2xl border border-[#262626]">
          <h3 className="text-lg font-semibold mb-6 text-gray-200">Task Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#171717] p-5 md:p-6 rounded-2xl border border-[#262626] flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-6 text-gray-200">Tasks to be Done</h3>
          <div className="flex-1 overflow-y-auto max-h-64 custom-scrollbar pr-2 space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.sort((a, b) => {
                const pMap = { [TaskPriority.HIGH]: 0, [TaskPriority.MEDIUM]: 1, [TaskPriority.LOW]: 2 };
                return pMap[a.priority] - pMap[b.priority];
              }).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-[#262626]/30 border border-[#262626] hover:bg-[#262626]/50 transition-colors">
                  <span className="text-sm text-gray-100 font-medium line-clamp-1">{task.title}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ml-3 flex-shrink-0 ${
                    task.priority === TaskPriority.HIGH ? 'bg-red-500/10 text-red-500' :
                    task.priority === TaskPriority.MEDIUM ? 'bg-amber-500/10 text-amber-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
                <p className="italic text-sm">All caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Notes Snippet */}
      <div className="bg-[#171717] p-5 md:p-6 rounded-2xl border border-[#262626]">
        <h3 className="text-lg font-semibold mb-6 text-gray-200">Recent Thoughts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {notes.slice(0, 4).map(note => (
            <div key={note.id} className="p-4 rounded-xl bg-[#262626]/30 border border-[#262626] hover:border-blue-500/30 transition-all cursor-default">
              <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: note.color }} />
              <h4 className="font-medium text-white mb-1 line-clamp-1">{note.title || 'Untitled'}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{new Date(note.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {notes.length === 0 && <p className="text-gray-500 col-span-full py-8 text-center italic">No thoughts captured yet.</p>}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; subtitle: string; color: string }> = ({ title, value, subtitle, color }) => (
  <div className="bg-[#171717] p-6 rounded-2xl border border-[#262626] transition-all hover:bg-[#1a1a1a] group">
    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">{title}</p>
    <div className={`text-4xl font-bold mb-1 transition-transform group-hover:scale-105 origin-left ${color}`}>{value}</div>
    <p className="text-[11px] text-gray-500 font-medium">{subtitle}</p>
  </div>
);

export default Dashboard;
