import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

const LAHORE_CENTER = [31.5204, 74.3587];

// INITIAL DATA
const INITIAL_JUNCTIONS = [
  { id: 1, name: "Kalma Chowk", coords: [31.5036, 74.3318], status: "clear", flow: 85, isManual: false },
  { id: 2, name: "Liberty Roundabout", coords: [31.5112, 74.3436], status: "moderate", flow: 50, isManual: false },
  { id: 3, name: "Thokar Niaz Baig", coords: [31.4655, 74.2464], status: "congested", flow: 15, isManual: false },
  { id: 4, name: "Mall Road (Hall Rd)", coords: [31.5612, 74.3195], status: "heavy", flow: 25, isManual: false },
  { id: 5, name: "Garhi Shahu", coords: [31.5644, 74.3533], status: "clear", flow: 70, isManual: false },
  { id: 6, name: "DHA Phase 5", coords: [31.4589, 74.4022], status: "clear", flow: 90, isManual: false },
  { id: 7, name: "Hussain Chowk (MM Alam)", coords: [31.5085, 74.3470], status: "moderate", flow: 55, isManual: false },
  { id: 8, name: "Main Market Gulberg", coords: [31.5207, 74.3462], status: "clear", flow: 75, isManual: false },
  { id: 9, name: "Shadman Chowk", coords: [31.5363, 74.3338], status: "congested", flow: 20, isManual: false },
  { id: 10, name: "Qurtaba Chowk (Jail Rd)", coords: [31.5375, 74.3218], status: "heavy", flow: 30, isManual: false },
  { id: 11, name: "Ichra Market", coords: [31.5284, 74.3214], status: "heavy", flow: 25, isManual: false },
  { id: 12, name: "Muslim Town Mor", coords: [31.5165, 74.3259], status: "clear", flow: 80, isManual: false },
  { id: 13, name: "Model Town Link Road", coords: [31.4824, 74.3204], status: "moderate", flow: 60, isManual: false },
  { id: 14, name: "General Hospital", coords: [31.4721, 74.3468], status: "congested", flow: 18, isManual: false },
  { id: 15, name: "Campus Bridge", coords: [31.4984, 74.3061], status: "clear", flow: 88, isManual: false },
  { id: 16, name: "Jinnah Hospital", coords: [31.4867, 74.2952], status: "moderate", flow: 45, isManual: false },
  { id: 17, name: "Doctors Hospital", coords: [31.4764, 74.2810], status: "clear", flow: 72, isManual: false },
  { id: 18, name: "Expo Center", coords: [31.4628, 74.2690], status: "clear", flow: 95, isManual: false },
  { id: 19, name: "Wapda Town Roundabout", coords: [31.4398, 74.2709], status: "moderate", flow: 58, isManual: false },
  { id: 20, name: "Valencia Main Chowk", coords: [31.4235, 74.2612], status: "clear", flow: 82, isManual: false },
  { id: 21, name: "Fortress Stadium", coords: [31.5247, 74.3705], status: "heavy", flow: 35, isManual: false },
  { id: 22, name: "Bhatta Chowk", coords: [31.4925, 74.4258], status: "congested", flow: 12, isManual: false },
  { id: 23, name: "Airport Ring Road Exit", coords: [31.5178, 74.4029], status: "clear", flow: 92, isManual: false },
  { id: 24, name: "Azadi Chowk (Minar-e-Pakistan)", coords: [31.5925, 74.3095], status: "congested", flow: 10, isManual: false },
  { id: 25, name: "Data Darbar", coords: [31.5786, 74.3069], status: "heavy", flow: 22, isManual: false },
  { id: 26, name: "Chauburji", coords: [31.5564, 74.3039], status: "moderate", flow: 40, isManual: false },
];

function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

const LiveMaps = () => {
  const navigate = useNavigate();
  const [junctions, setJunctions] = useState(() => {
    // Load from storage on boot, or use default
    const saved = localStorage.getItem('trafficState');
    return saved ? JSON.parse(saved) : INITIAL_JUNCTIONS;
  });
  
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedJunction, setSelectedJunction] = useState(null);

  // SHARED SIMULATION ENGINE (Syncs with LocalStorage)
  useEffect(() => {
    const interval = setInterval(() => {
      setJunctions(currentJunctions => {
        // 1. Check if there is newer data from Admin (Local Storage)
        const savedData = localStorage.getItem('trafficState');
        const parsedData = savedData ? JSON.parse(savedData) : currentJunctions;

        // 2. Merge & Simulate
        const updatedJunctions = parsedData.map((junction) => {
          // CRITICAL: If Admin marked it MANUAL, do NOT simulate. Just read the value.
          if (junction.isManual) {
            return junction; 
          }

          // Otherwise, run AI Simulation
          const change = Math.floor(Math.random() * 10) - 5; // Smaller variance for smoothness
          let newFlow = Math.max(0, Math.min(100, junction.flow + change));
          
          let newStatus = 'clear';
          if (newFlow < 30) newStatus = 'congested';
          else if (newFlow < 60) newStatus = 'moderate';

          return { ...junction, flow: newFlow, status: newStatus };
        });

        // 3. Save back to storage so Admin sees the simulation too
        localStorage.setItem('trafficState', JSON.stringify(updatedJunctions));
        return updatedJunctions;
      });

      setLastUpdated(new Date());
    }, 1000); // Faster updates (1s) for smoother sync

    return () => clearInterval(interval);
  }, []);

  const getColor = (status) => {
    switch(status) {
      case 'congested': return '#ef4444';
      case 'moderate': return '#eab308';
      case 'clear': return '#22c55e';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      
      <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 z-30 shrink-0">
        {/* Clickable Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition shadow-lg shadow-blue-600/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition">Smart Traffic System</h1>
            <span className="text-[10px] text-slate-400 font-mono">LIVE CONTROL DASHBOARD</span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded hidden md:block">
            SYNC: {lastUpdated.toLocaleTimeString()}
          </span>
          <button onClick={() => navigate('/analysis')} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition shadow-lg shadow-blue-500/20 font-medium">
            View Analytics
          </button>
          <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-1 rounded transition">
            Exit Dashboard
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-96 bg-slate-800 border-r border-slate-700 flex flex-col z-20 shadow-xl">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Junctions List ({junctions.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {junctions.map((junction) => (
              <div 
                key={junction.id}
                onClick={() => setSelectedJunction(junction)}
                className={`group p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  selectedJunction?.id === junction.id 
                    ? 'bg-slate-700 border-blue-500 ring-1 ring-blue-500' 
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-500" style={{ backgroundColor: getColor(junction.status) }}></div>
                <div className="flex justify-between items-start pl-3">
                  <div>
                    <h4 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{junction.name}</h4>
                    {junction.isManual && <span className="text-[10px] bg-red-500 text-white px-1.5 rounded font-bold">MANUAL OVERRIDE</span>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tabular-nums tracking-tight">{junction.flow}%</div>
                    <div className="text-[10px] text-slate-500">Flow Rate</div>
                  </div>
                </div>
                <div className="mt-3 ml-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${junction.flow}%`, backgroundColor: getColor(junction.status) }}></div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAP */}
        <div className="flex-1 relative bg-slate-900">
          <MapContainer center={LAHORE_CENTER} zoom={12} className="h-full w-full" zoomControl={false}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {selectedJunction && <MapFlyTo center={selectedJunction.coords} />}
            {junctions.map((junction) => (
              <CircleMarker 
                key={junction.id}
                center={junction.coords}
                pathOptions={{ 
                  color: junction.isManual ? '#ffffff' : getColor(junction.status),
                  fillColor: getColor(junction.status), 
                  fillOpacity: 0.6,
                  weight: junction.isManual ? 3 : 2,
                  dashArray: junction.isManual ? '5, 5' : null 
                }}
                radius={selectedJunction?.id === junction.id ? 25 : 15}
              >
                <Popup className="custom-popup">
                  <div className="font-bold text-center">{junction.name}</div>
                  <div className="text-center text-xs">Flow: {junction.flow}%</div>
                  {junction.isManual && <div className="text-red-500 text-[10px] font-bold text-center mt-1">ADMIN CONTROL</div>}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default LiveMaps;