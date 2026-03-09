import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Briefcase, 
  Clock, 
  AlertTriangle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Project, STAGES } from '../types';
import { format, isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';

interface DashboardProps {
  projects: Project[];
}

const REVENUE_DATA = [
  { date: '02-07', amount: 0 },
  { date: '02-08', amount: 0 },
  { date: '02-09', amount: 0 },
  { date: '02-10', amount: 2000 },
  { date: '02-11', amount: 1500 },
  { date: '02-12', amount: 0 },
  { date: '02-13', amount: 2500 },
  { date: '02-14', amount: 0 },
  { date: '02-15', amount: 0 },
  { date: '02-16', amount: 8000 },
  { date: '02-17', amount: 1000 },
  { date: '02-18', amount: 0 },
  { date: '02-19', amount: 1200 },
  { date: '02-20', amount: 2000 },
  { date: '02-21', amount: 0 },
  { date: '02-22', amount: 5000 },
  { date: '02-23', amount: 0 },
  { date: '02-24', amount: 0 },
  { date: '02-25', amount: 0 },
  { date: '02-26', amount: 70000 },
  { date: '02-27', amount: 62000 },
  { date: '02-28', amount: 0 },
  { date: '03-01', amount: 0 },
  { date: '03-02', amount: 1500 },
  { date: '03-03', amount: 1000 },
  { date: '03-04', amount: 12000 },
  { date: '03-05', amount: 0 },
  { date: '03-06', amount: 4000 },
  { date: '03-07', amount: 0 },
  { date: '03-08', amount: 0 },
];

const CATEGORY_DATA = [
  { name: 'TARP', value: 100 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard({ projects }: DashboardProps) {
  const activeJobs = useMemo(() => projects.filter(p => p.status !== 'Completed').length, [projects]);
  
  const today = useMemo(() => new Date(), []);
  const threeDaysFromNow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  }, []);
  
  const dueSoon = useMemo(() => projects.filter(p => {
    if (!p.due_date) return false;
    const dueDate = new Date(p.due_date);
    return dueDate >= startOfDay(today) && dueDate <= endOfDay(threeDaysFromNow) && p.status !== 'Completed';
  }).length, [projects, today, threeDaysFromNow]);

  const workflowCounts = useMemo(() => STAGES.reduce((acc, stage) => {
    acc[stage] = projects.filter(p => p.status === stage).length;
    return acc;
  }, {} as Record<string, number>), [projects]);

  const upcomingDeadlines = useMemo(() => projects
    .filter(p => p.status !== 'Completed' && p.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 4), [projects]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back! Here's what's happening in your shop today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            This Week <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Sparkles size={16} />
            Generate AI Insights
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue (week)" 
          value="₱0.00" 
          subtitle="No previous data"
          icon={<TrendingUp className="text-indigo-600" size={20} />}
        />
        <StatCard 
          title="Active Jobs" 
          value={activeJobs.toString()} 
          icon={<Briefcase className="text-indigo-600" size={20} />}
          iconBg="bg-indigo-50"
        />
        <StatCard 
          title="Due Soon (3 Days)" 
          value={dueSoon.toString()} 
          subtitle="Requires immediate attention"
          icon={<Clock className="text-indigo-600" size={20} />}
        />
        <StatCard 
          title="Low Stock Alerts" 
          value="4" 
          subtitle="Items below threshold"
          icon={<AlertTriangle className="text-red-600" size={20} />}
          valueColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Revenue Overview (Last 30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  interval={2}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(value) => `₱${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Sales by Category</h3>
          <div className="h-[240px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">TARP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflow Status */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Workflow Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {STAGES.map((stage) => (
              <div key={stage} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-slate-900 mb-1">{workflowCounts[stage] || 0}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stage.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {upcomingDeadlines.map((project) => (
              <div key={project.id} className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <h4 className="font-bold text-slate-900 text-sm">{project.project_name}</h4>
                </div>
                <p className="text-[10px] text-slate-500 ml-3.5 mb-2">
                  {project.customer_name} | {project.order_type}
                </p>
                <p className="text-[10px] font-bold text-red-600 ml-3.5">
                  Due: {project.due_date}
                </p>
              </div>
            ))}
            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                No upcoming deadlines
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, iconBg = "bg-white", valueColor = "text-slate-900" }: { 
  title: string; 
  value: string; 
  subtitle?: string; 
  icon: React.ReactNode;
  iconBg?: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500 mb-2">{title}</p>
        <h4 className={`text-2xl font-bold ${valueColor} mb-1`}>{value}</h4>
        {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
      </div>
      <div className={`w-10 h-10 ${iconBg} border border-slate-100 rounded-xl flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
    </div>
  );
}
