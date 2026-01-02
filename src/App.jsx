import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import LiveMaps from './pages/Dashboard/LiveMaps'; 
import Analysis from './pages/Analysis/Analysis';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Update this route to point to the real component */}
        <Route path="/live-maps" element={<LiveMaps />} />
        
        <Route path="/admin" element={<div className="text-white p-10 bg-slate-900 h-screen">Admin Portal</div>} />
      </Routes>
    </Router>
  );
}

export default App;