import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, CpuChipIcon, HandRaisedIcon } from '@heroicons/react/24/solid';

const LAHORE_CENTER = [31.5204, 74.3587]; 

// Must match LiveMaps initial data to prevent hydration mismatch on first load
const INITIAL_JUNCTIONS = [
  { id: 1, name: "Kalma Chowk", coords: [31.5036, 74.3318], status: "clear", flow: 85, isManual: false },
  // ... (Full list usually goes here, but for brevity, it loads from localStorage anyway)
];

function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Initialize from Storage
  const [junctions, setJunctions] = useState(() => {
    const saved = localStorage.getItem('trafficState');
    return saved ? JSON.parse(saved) : INITIAL_JUNCTIONS;
  });
  const [selectedJunction, setSelectedJunction] = useState(null);

  // 1. SYNC WITH LIVE MAPS (Read Only)
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('trafficState');
      if (saved) {
        setJunctions(JSON.parse(saved));
      }
    }, 500); // Poll fast to see updates
    return () => clearInterval(interval);
  }, []);

  // helper to write to storage safely
  const saveToStorage = (newData) => {
    setJunctions(newData);
    localStorage.setItem('trafficState', JSON.stringify(newData));
  };

  // 2. ANIMATED FORCE CONTROL (The 5-second Logic)
  const takeControl = (id, action) => {
    let currentData = [...junctions];
    const targetIndex = currentData.findIndex(j => j.id === id);
    if (targetIndex === -1) return;

    if (action === 'AI') {
      // Release control back to AI
      currentData[targetIndex].isManual = false;
      saveToStorage(currentData);
    } 
    else if (action === 'CLEAR') {
      // 1. Lock manual mode immediately
      currentData[targetIndex].isManual = true;
      saveToStorage(currentData);

      // 2. Start Animation Loop (5 seconds duration)
      let progress = 0;
      const duration = 5000; // 5 seconds
      const intervalTime = 100; // Update every 100ms
      const startFlow = currentData[targetIndex].flow;
      const targetFlow = 100; // Target 100%

      const animInterval = setInterval(() => {
        progress += intervalTime;
        const percentage = Math.min(progress / duration, 1);
        
        // Calculate new flow
        const newFlow = Math.floor(startFlow + (targetFlow - startFlow) * percentage);

        // Fetch fresh data from storage (in case other things changed)
        const freshData = JSON.parse(localStorage.getItem('trafficState'));
        const freshIndex = freshData.findIndex(j => j.id === id);
        
        if (freshIndex !== -1) {
            freshData[freshIndex].flow = newFlow;
            freshData[freshIndex].status = 'clear';
            freshData[freshIndex].isManual = true; // Ensure lock stays
            saveToStorage(freshData);
        }

        if (progress >= duration) {
          clearInterval(animInterval);
        }
      }, intervalTime);

    } else if (action === 'BLOCK') {
       // Instant Block
       currentData[targetIndex].isManual = true;
       currentData[targetIndex].flow = 10;
       currentData[targetIndex].status = 'congested';
       saveToStorage(currentData);
    }
  };

  const getColor = (status) => {
    switch(status) {
      case 'congested': return '#ef4444'; 
      case 'moderate': return '#eab308'; 
      case 'clear': return '#22c55e';    
      default: return '#3b82f6';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden border-4 border-red-900/30">
      
      {/* HEADER with Clickable Home Logo */}
      <header className="h-16 bg-red-950/20 border-b border-red-900/50 flex items-center justify-between px-6 z-30 shrink-0">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-4 cursor-pointer group"
        >
          <ShieldCheckIcon className="w-8 h-8 text-red-500 group-hover:text-red-400 transition" />
          <div className="flex flex-col">
            <h2 className="font-bold text-lg tracking-wide text-red-100 group-hover:text-white transition">Smart Traffic System</h2>
            <span className="text-[10px] font-bold text-red-500 tracking-wider">ADMIN CONTROL CENTER</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded animate-pulse">
            RESTRICTED ACCESS
          </span>
          <button onClick={() => navigate('/')} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded transition">
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 uppercase">Traffic Network ({junctions.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {junctions.map((junction) => (
              <div 
                key={junction.id}
                onClick={() => setSelectedJunction(junction)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedJunction?.id === junction.id ? 'bg-slate-800 border-red-500 ring-1 ring-red-500/50' : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-100">{junction.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {junction.isManual ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                          <HandRaisedIcon className="w-3 h-3" /> MANUAL
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                          <CpuChipIcon className="w-3 h-3" /> AI ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold tabular-nums ${junction.status === 'congested' ? 'text-red-500' : 'text-emerald-500'}`}>{junction.flow}%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Flow Rate</div>
                  </div>
                </div>

                {selectedJunction?.id === junction.id && (
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                    <button 
                      onClick={(e) => { e.stopPropagation(); takeControl(junction.id, 'CLEAR'); }}
                      className="bg-emerald-900/50 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-700 text-xs font-bold py-2 rounded transition"
                    >
                      FORCE GREEN
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); takeControl(junction.id, 'BLOCK'); }}
                      className="bg-red-900/50 hover:bg-red-600 text-red-400 hover:text-white border border-red-700 text-xs font-bold py-2 rounded transition"
                    >
                      FORCE RED
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); takeControl(junction.id, 'AI'); }}
                      className="bg-blue-900/50 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-700 text-xs font-bold py-2 rounded transition"
                    >
                      RESUME AI
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 relative bg-slate-900">
          <MapContainer center={LAHORE_CENTER} zoom={13} className="h-full w-full" zoomControl={false}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {selectedJunction && <MapFlyTo center={selectedJunction.coords} />}
            {junctions.map((junction) => (
              <CircleMarker 
                key={junction.id}
                center={junction.coords}
                pathOptions={{ 
                  color: junction.isManual ? '#ffffff' : getColor(junction.status),
                  fillColor: getColor(junction.status), 
                  fillOpacity: junction.isManual ? 1 : 0.6,
                  weight: junction.isManual ? 4 : 2, 
                  dashArray: junction.isManual ? '5, 5' : null
                }}
                radius={selectedJunction?.id === junction.id ? 25 : 15}
              >
                <Popup>
                  <div className="font-bold text-center mb-2">{junction.name}</div>
                  {junction.isManual ? (
                     <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded text-center border border-red-200">OFFICER OVERRIDE</div>
                  ) : (
                    <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded text-center border border-blue-200">AI CONTROLLED</div>
                  )}
                  <div className="text-center text-xs mt-1 text-slate-500">Flow Rate: {junction.flow}%</div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;