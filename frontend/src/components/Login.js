import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { login } from '../services/api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await login(username, password);
      onLogin(data);
      setLoginError('');
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white/20 backdrop-blur-lg rounded-full mb-6 shadow-xl animate-float">
            <BookOpen className="w-20 h-20 text-white drop-shadow-2xl" />
          </div>
          <h1 className="text-6xl font-extrabold text-white mb-3 drop-shadow-2xl">
            Orthographe CM1
          </h1>
          <p className="text-white/90 text-xl font-medium">Apprends en t'amusant ! 🎉</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-white/90 mb-2 drop-shadow">Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="Entre ton nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-xl backdrop-blur-md bg-white/20 border-2 border-white/30 focus:border-white/60 focus:bg-white/30 text-white placeholder-white/60 outline-none text-lg transition-all shadow-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-white/90 mb-2 drop-shadow">Mot de passe</label>
            <input
              type="password"
              placeholder="Entre ton mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl backdrop-blur-md bg-white/20 border-2 border-white/30 focus:border-white/60 focus:bg-white/30 text-white placeholder-white/60 outline-none text-lg transition-all shadow-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={isLoading}
            />
          </div>
          
          {loginError && (
            <div className="backdrop-blur-md bg-red-500/20 border-2 border-red-300/50 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-lg">
              {loginError}
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-white/30 hover:bg-white/40 backdrop-blur-md border-2 border-white/40 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Connexion...' : 'Se connecter 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
}