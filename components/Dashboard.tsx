
import React from 'react';
import { Task, Note, TaskStatus, TaskPriority } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  notes: Note[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, notes }) => {
  const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.DONE).length;
  const highPriorityTasks = tasks.filter(t => t.priority === TaskPriority.HIGH && t.status !== TaskStatus.DONE).length;

  const chartData = [
    { name: 'Todo', value: tasks.filter(t => t.status === TaskStatus.TODO).length, color: '#6366f1' },
    { name: 'In Progress', value: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length, color: '#f59e0b' },
    { name: 'Done', value: completedTasks, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === TaskPriority.HIGH).length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === TaskPriority.MEDIUM).length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === TaskPriority.LOW).length, color: '#3b82f6' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fadeIn">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome back, User</h1>
        <p className="text-gray-400">Here's a summary of your workspace today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Active Tasks" value={pendingTasks} subtitle={`${highPriorityTasks} high priority`} color="text-blue-500" />
        <StatCard title="Completed" value={completedTasks} subtitle="Total historical finish" color="text-green-500" />
        <StatCard title="Total Notes" value={notes.length} subtitle="Thought repository" color="text-purple-500" />
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-[#171717] p-6 rounded-2xl border border-[#262626]">
          <h3 className="text-lg font-semibold mb-6">Task Status Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#171717] p-6 rounded-2xl border border-[#262626]">
          <h3 className="text-lg font-semibold mb-6">Priority Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Notes Snippet */}
      <div className="bg-[#171717] p-6 rounded-2xl border border-[#262626]">
        <h3 className="text-lg font-semibold mb-6">Recent Thoughts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notes.slice(0, 4).map(note => (
            <div key={note.id} className="p-4 rounded-xl bg-[#262626]/30 border border-[#262626] hover:border-blue-500/30 transition-all">
              <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: note.color }} />
              <h4 className="font-medium text-white mb-1 line-clamp-1">{note.title}</h4>
              <p className="text-xs text-gray-500">{new Date(note.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {notes.length === 0 && <p className="text-gray-500 col-span-full py-4 text-center">No notes found. Capture your first thought!</p>}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number | string; subtitle: string; color: string }> = ({ title, value, subtitle, color }) => (
  <div className="bg-[#171717] p-6 rounded-2xl border border-[#262626] transition-transform hover:scale-[1.02]">
    <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
    <div className={`text-4xl font-bold mb-1 ${color}`}>{value}</div>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

export default Dashboard;
