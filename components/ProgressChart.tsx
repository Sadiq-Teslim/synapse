'use client';

import { ExerciseSession } from '@/types';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProgressChartProps {
  sessions: ExerciseSession[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-[#0078D4]">
          <span className="font-medium">{payload[0].value}</span> reps
        </p>
      </div>
    );
  }
  return null;
};

export default function ProgressChart({ sessions }: ProgressChartProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center mb-4">
          <ChartBarIcon className="w-10 h-10 text-[#0078D4]" />
        </div>
        <p className="text-gray-600 font-medium">No data yet</p>
        <p className="text-sm text-gray-400 mt-1">Complete your first session to see progress</p>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = sessions
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((session, index) => ({
      name: `Session ${index + 1}`,
      reps: session.repsCompleted,
      angle: session.maxAngle,
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorReps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0078D4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0078D4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#605E5C', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#605E5C', fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="reps"
          stroke="#0078D4"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorReps)"
          dot={{ fill: '#0078D4', strokeWidth: 2, r: 4, stroke: '#fff' }}
          activeDot={{ r: 6, fill: '#0078D4', stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
