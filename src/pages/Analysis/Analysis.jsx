import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { MapIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 1. DATA: 24-Hour Breakdown (00:00 to 23:00)
const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const lineChartData = {
  labels: hours, 
  datasets: [
    {
      label: 'Today (Live)',
      data: [15, 12, 10, 8, 15, 30, 65, 85, 90, 80, 75, 70, 72, 70, 65, 75, 95, 98, 90, 80, 60, 40, 30, 20],
      borderColor: '#3b82f6', // Bright Blue
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
      fill: true,
      pointRadius: 2,
    },
    {
      label: 'Yesterday (Historical)',
      data: [18, 15, 12, 10, 12, 25, 55, 75, 80, 75, 70, 65, 68, 65, 60, 70, 85, 90, 85, 75, 55, 35, 25, 18],
      borderColor: '#94a3b8', // Grey
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0.4,
      pointRadius: 0, 
    },
  ],
};

const barChartData = {
  labels: ['Kalma Chowk', 'Liberty', 'Thokar', 'Mall Rd', 'DHA Ph5', 'Garhi Shahu'],
  datasets: [
    {
      label: 'Avg Wait Time (mins)',
      data: [15, 8, 25, 12, 5, 10],
      backgroundColor: ['#ef4444', '#eab308', '#ef4444', '#eab308', '#22c55e', '#22c55e'],
      borderRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#cbd5e1' } },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8', maxTicksLimit: 12 } }
  }
};

const Analysis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      
      {/* HEADER with Clickable Home Logo */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
            <MapIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight group-hover:text-blue-400 transition">
              Smart Traffic System
            </h1>
            <span className="text-xs text-slate-400 font-mono">ANALYTICS DASHBOARD</span>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/live-maps')}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition"
        >
          Back to Live Map
        </button>
      </header>

      {/* GRAPHS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: 24-Hour Trends */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              24-Hour Traffic Comparison (Yesterday vs Today)
            </h3>
            <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">Unit: Hourly Volume</span>
          </div>
          <div className="h-80 w-full">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Card 2: Congestion Hotspots */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
            Congestion Hotspots (Current)
          </h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Card 3: AI Insights */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-semibold mb-4">Hourly Analysis Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-slate-400 text-sm">Peak Traffic Hour</span>
              <span className="font-bold text-white">17:00 (5:00 PM)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-slate-400 text-sm">Yesterday's Total Volume</span>
              <span className="font-bold text-blue-400">145,200 Vehicles</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-slate-400 text-sm">Efficiency Rating</span>
              <span className="font-bold text-emerald-400">92% (Optimal)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analysis;