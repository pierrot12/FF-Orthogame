import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { createUser } from '../services/api';

export default function CreateUser({ currentUsername, onSuccess, onCancel }) {
  const [newUser, setNewUser] = useState({ username: '', password: '', isAdmin: false });
  const [createUserError, setCreateUserError] = useState('');

  const handleCreateUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim()) {
      setCreateUserError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      await createUser({ ...newUser, createdBy: currentUsername });
      setNewUser({ username: '', password: '', isAdmin: false });
      setCreateUserError('');
      alert('Utilisateur créé avec succès !');
      onSuccess();
    } catch (error) {
      setCreateUserError(error.message);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="max-w-2xl mx-auto">
        <div className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center space-x-2">
              <Plus className="w-8 h-8 text-green-600" />
              <span>Créer un utilisateur</span>
            </h2>
            <button 
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              Retour
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-lg transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                placeholder="Mot de passe"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-5 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-lg transition-all"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newUser.isAdmin}
                  onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                  className="w-6 h-6 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <div>
                  <span className="text-gray-800 font-semibold">Administrateur</span>
                  <p className="text-sm text-gray-600">Cet utilisateur pourra gérer les exercices et les utilisateurs</p>
                </div>
              </label>
            </div>

            {createUserError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {createUserError}
              </div>
            )}

            <button
              onClick={handleCreateUser}
              disabled={!newUser.username.trim() || !newUser.password.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer l'utilisateur ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}