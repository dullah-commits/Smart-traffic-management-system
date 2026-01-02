import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b border-slate-700 backdrop-blur-md fixed w-full top-0 z-50 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center animate-pulse">
            <MapIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Lahore Traffic<span className="text-blue-500">Sense</span></h1>
        </div>
        <div className="space-x-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition">Sign In</button>
          <button onClick={() => navigate('/signup')} className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-full font-medium transition shadow-lg shadow-blue-500/20">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            Live System Active
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-slate-100">
            Smart Traffic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Management
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Real-time congestion tracking, AI-powered prediction, and automated alerts for the city of Lahore. 
            Reducing commute times by analyzing data from <span className="text-white font-semibold">sensors, CCTV, and mobile inputs.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/live-maps')}
              className="px-8 py-4 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-500 transition transform hover:-translate-y-1 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <MapIcon className="w-6 h-6" />
              View Live Map
            </button>
            
            <button 
              onClick={() => navigate('/admin')}
              className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition flex items-center justify-center gap-2"
            >
              <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
              Admin Portal
            </button>
          </div>
        </div>

        {/* Right Visual (Abstract Map Representation) */}
        <div className="flex-1 w-full relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]"></div>
          
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl">
            {/* Fake Map UI for Visual */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-200">Live Congestion - Kalma Chowk</h3>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded font-medium">Heavy Traffic</span>
            </div>
            <div className="space-y-4">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-red-500"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Density</span>
                <span>85% (Critical)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <ChartBarIcon className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold">12km/h</div>
                  <div className="text-xs text-slate-500">Avg Speed</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <ShieldCheckIcon className="w-6 h-6 text-emerald-400 mb-2" />
                  <div className="text-2xl font-bold">Active</div>
                  <div className="text-xs text-slate-500">AI Control</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;