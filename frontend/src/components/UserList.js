import React from 'react';
import { Plus, Star, Trash2 } from 'lucide-react';

export default function UserList({ users, currentUserId, onCreateUser, onDeleteUser }) {
  return (
    <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/95 border border-white/30 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">👥 Utilisateurs</h2>
        <button
          onClick={onCreateUser}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition transform hover:scale-110 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Créer</span>
        </button>
      </div>
      
      <div className="space-y-3" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '8px'}}>
        {users.map((u) => (
          <div key={u._id} className="backdrop-blur-md bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800 flex items-center space-x-2 text-lg">
                  <span>{u.username}</span>
                  {u.isAdmin && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                </p>
                <p className="text-sm text-indigo-600 font-medium">{u.isAdmin ? 'Administrateur' : 'Joueur'}</p>
              </div>
              {u.username !== 'admin' && u._id !== currentUserId && (
                <button
                  onClick={() => onDeleteUser(u._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}