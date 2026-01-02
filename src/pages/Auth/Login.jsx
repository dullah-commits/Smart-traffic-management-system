import React, { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { isSignedIn } = await signIn({
        username: formData.username,
        password: formData.password
      });
      
      if (isSignedIn) {
        navigate('/live-maps'); // Redirect to dashboard on success
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1 text-sm">Username</label>
            <input 
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 text-sm">Password</label>
            <input 
              type="password"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-600/20">
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account? <span onClick={() => navigate('/signup')} className="text-blue-400 cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;