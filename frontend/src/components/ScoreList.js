import React, { useState } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

export default function ScoreList({ scores = [], username = 'User', isAdmin = false }) {
  const [viewMode, setViewMode] = useState('list');
  const [selectedUser, setSelectedUser] = useState('all');
  
  // Liste des utilisateurs uniques
  const uniqueUsers = [...new Set(scores.map(s => s.username))];
  
  const filteredScores = isAdmin 
    ? (selectedUser === 'all' ? scores : scores.filter(s => s.username === selectedUser))
    : scores.filter(s => s.username === username);
  
  const userScores = isAdmin 
    ? filteredScores.sort((a, b) => new Date(a.date) - new Date(b.date))
    : filteredScores.sort((a, b) => new Date(a.date) - new Date(b.date));

  const maxScore = 100;
  const minScore = 0;

  return (
    <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/95 border border-white/30 shadow-2xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span>Scores</span>
          </h2>
          {!isAdmin && filteredScores.length > 0 && (
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'graph' : 'list')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105"
            >
              {viewMode === 'list' ? <TrendingUp className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
              <span>{viewMode === 'list' ? 'Graphique' : 'Liste'}</span>
            </button>
          )}
        </div>
        {isAdmin && uniqueUsers.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Filtrer par joueur :</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-purple-300 rounded-lg text-gray-700 font-medium hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
            >
              <option value="all">Tous les joueurs ({scores.length} scores)</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>
                  {user} ({scores.filter(s => s.username === user).length})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {viewMode === 'graph' && !isAdmin && filteredScores.length > 0 ? (
        <div className="space-y-4">
          <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#764ba2" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {userScores.length > 1 && (
                <path
                  d={`
                    M ${(0 / (userScores.length - 1)) * 90 + 5} ${90 - (userScores[0].score / maxScore * 80)}
                    ${userScores.slice(1).map((score, index) => {
                      const x = ((index + 1) / (userScores.length - 1)) * 90 + 5;
                      const y = 90 - (score.score / maxScore * 80);
                      return `L ${x} ${y}`;
                    }).join(' ')}
                    L ${(userScores.length - 1) / (userScores.length - 1) * 90 + 5} 90
                    L ${(0 / (userScores.length - 1)) * 90 + 5} 90
                    Z
                  `}
                  fill="url(#areaGradient)"
                />
              )}
              
              {userScores.length > 1 && (
                <path
                  d={`
                    M ${(0 / (userScores.length - 1)) * 90 + 5} ${90 - (userScores[0].score / maxScore * 80)}
                    ${userScores.slice(1).map((score, index) => {
                      const x = ((index + 1) / (userScores.length - 1)) * 90 + 5;
                      const y = 90 - (score.score / maxScore * 80);
                      return `L ${x} ${y}`;
                    }).join(' ')}
                  `}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              
              {userScores.map((score, index) => {
                const x = (index / (userScores.length - 1)) * 90 + 5;
                const y = 90 - (score.score / maxScore * 80);
                
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill="#667eea"
                      stroke="white"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                      className="cursor-pointer"
                    />
                  </g>
                );
              })}
            </svg>
            
            <div className="absolute bottom-1 left-6 right-6 flex justify-between text-xs text-gray-600">
              {userScores.length <= 6 ? (
                userScores.map((score, index) => (
                  <span key={index} className="text-center">
                    {new Date(score.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </span>
                ))
              ) : (
                <>
                  <span>{new Date(userScores[0].date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                  <span>{new Date(userScores[Math.floor(userScores.length / 3)].date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                  <span>{new Date(userScores[Math.floor(userScores.length * 2 / 3)].date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                  <span>{new Date(userScores[userScores.length - 1].date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
              <p className="text-xs text-gray-600">Meilleur</p>
              <p className="text-2xl font-bold text-blue-600">{Math.max(...userScores.map(s => s.score))}%</p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-200">
              <p className="text-xs text-gray-600">Moyenne</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(userScores.reduce((acc, s) => acc + s.score, 0) / userScores.length)}%
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
              <p className="text-xs text-gray-600">Parties</p>
              <p className="text-2xl font-bold text-purple-600">{userScores.length}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '8px'}}>
          {filteredScores.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Trophy className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Aucun score enregistré</p>
            </div>
          ) : (
            filteredScores.slice().reverse().map((score, index) => (
              <div key={index} className="backdrop-blur-md bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-2xl border border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{score.username}</p>
                    <p className="text-sm text-gray-600 mt-1">{score.exerciseName}</p>
                    <p className="text-xs text-gray-500 mt-1">📅 {new Date(score.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {score.score}%
                    </p>
                    <p className="text-sm text-gray-600 mt-1 font-semibold">{score.correctWords}/{score.totalWords} mots</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}