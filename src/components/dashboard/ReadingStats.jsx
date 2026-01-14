'use client';

import { BookOpen, Clock, Flame } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ReadingStats({ stats }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock Data
  const genreData = [
    { name: 'Fiction', value: 12 },
    { name: 'Mystery', value: 8 },
    { name: 'Sci-Fi', value: 5 },
    { name: 'Non-Fiction', value: 4 },
    { name: 'Fantasy', value: 7 },
  ];

  const monthlyData = [
    { name: 'Jan', books: 2, pages: 450 },
    { name: 'Feb', books: 3, pages: 620 },
    { name: 'Mar', books: 1, pages: 300 },
    { name: 'Apr', books: 4, pages: 850 },
    { name: 'May', books: 2, pages: 400 },
    { name: 'Jun', books: 5, pages: 950 },
  ];

  // Colors for Light Mode (Saturated/Earth tones)
  const LIGHT_COLORS = [
    '#7c3aed', // Violet-600 (Bar)
    '#0d9488', // Teal-600 (Line)
    '#ea580c', // Orange-600
    '#db2777', // Pink-600
    '#059669', // Emerald-600
  ];

  // Colors for Dark Mode (Brighter/Pastel for contrast)
  const DARK_COLORS = [
    '#a78bfa', // Violet-400 (Bar)
    '#2dd4bf', // Teal-400 (Line)
    '#fb923c', // Orange-400
    '#f472b6', // Pink-400
    '#34d399', // Emerald-400
  ];

  const currentTheme = resolvedTheme || theme;
  const currentColors =
    mounted && currentTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  // Explicit Axis/Grid colors to ensure visibility in both themes
  const axisColor = mounted && currentTheme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = mounted && currentTheme === 'dark' ? '#374151' : '#e5e7eb';

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold font-serif text-foreground'>
          Reading Stats
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-4 mb-8'>
        {/* Stat Cards */}
        <div className='bg-card border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm hover:border-primary/20 transition-colors'>
          <div className='bg-primary/10 p-3 rounded-lg text-primary'>
            <Clock size={24} />
          </div>
          <div>
            <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider'>
              Reading Time
            </p>
            <p className='text-xl font-bold text-foreground'>42h 15m</p>
          </div>
        </div>

        <div className='bg-card border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm hover:border-primary/20 transition-colors'>
          <div className='bg-blue-500/10 p-3 rounded-lg text-blue-600 dark:text-blue-400'>
            <BookOpen size={24} />
          </div>
          <div>
            <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider'>
              Pages Turned
            </p>
            <p className='text-xl font-bold text-foreground'>
              {stats?.totalPagesRead || 0}
            </p>
          </div>
        </div>

        <div className='bg-card border border-border p-5 rounded-xl flex items-center gap-4 shadow-sm hover:border-primary/20 transition-colors'>
          <div className='bg-orange-500/10 p-3 rounded-lg text-orange-600 dark:text-orange-400'>
            <Flame size={24} />
          </div>
          <div>
            <p className='text-xs text-muted-foreground uppercase font-bold tracking-wider'>
              Daily Streak
            </p>
            <p className='text-xl font-bold text-foreground'>
              {stats?.streak || 0} Days
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        {/* Monthly Books Bar Chart */}
        <div className='bg-card/30 border border-border/30 rounded-xl p-4'>
          <p className='text-sm font-bold text-muted-foreground mb-4'>
            Books Read (Monthly)
          </p>
          <div className='w-full'>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke={gridColor}
                />
                <XAxis
                  dataKey='name'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: axisColor }}
                />
                <Tooltip
                  cursor={{
                    fill:
                      currentTheme === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))',
                    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  labelStyle={{
                    color: 'hsl(var(--popover-foreground))',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                />
                <Bar
                  dataKey='books'
                  fill={currentColors[0]}
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pages Trend Line Chart */}
        <div className='bg-card/30 border border-border/30 rounded-xl p-4'>
          <p className='text-sm font-bold text-muted-foreground mb-4'>
            Reading Trend (Pages)
          </p>
          <div className='w-full'>
            <ResponsiveContainer width='100%' height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke={gridColor}
                />
                <XAxis
                  dataKey='name'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: axisColor }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))',
                    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  labelStyle={{
                    color: 'hsl(var(--popover-foreground))',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='pages'
                  stroke={currentColors[1]}
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: 'hsl(var(--background))',
                    strokeWidth: 2,
                    stroke: currentColors[1],
                  }}
                  activeDot={{ r: 6, fill: currentColors[1] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genres Pie Chart */}
        <div className='bg-card/30 border border-border/30 rounded-xl p-4 flex flex-col'>
          <p className='text-sm font-bold text-muted-foreground mb-2'>
            Favorite Genres
          </p>
          <div className='w-full'>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey='value'>
                  {genreData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={currentColors[index % currentColors.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))',
                    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
                  }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                <Legend
                  verticalAlign='bottom'
                  height={36}
                  iconType='circle'
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
