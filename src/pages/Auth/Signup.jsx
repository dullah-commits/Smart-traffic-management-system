import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp({
        username: formData.username,
        password: formData.password,
        options: {
          userAttributes: { email: formData.email }
        }
      });
      setNeedsConfirmation(true); // Cognito requires email verification
    } catch (err) {
      setError(err.message);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-slate-400 mb-6">We sent a verification link to {formData.email}. Please click it to confirm your account.</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1 text-sm">Username</label>
            <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 text-sm">Email</label>
            <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 text-sm">Password</label>
            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account? <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;