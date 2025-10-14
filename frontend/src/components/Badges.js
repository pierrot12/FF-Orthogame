import React, { useState, useEffect } from 'react';
import { Award, Lock, TrendingUp } from 'lucide-react';
import { getBadgesMetadata } from '../services/api';

export default function Badges({ currentUser, onBack }) {
  const [badgeMetadata, setBadgeMetadata] = useState({});

  useEffect(() => {
    loadBadgesMetadata();
  }, []);

  const loadBadgesMetadata = async () => {
    try {
      const metadata = await getBadgesMetadata();
      setBadgeMetadata(metadata);
    } catch (error) {
      console.error('Erreur chargement badges:', error);
    }
  };

  const userBadges = currentUser.badges || [];
  const allBadgeIds = Object.keys(badgeMetadata);
  const unlockedCount = userBadges.length;
  const totalCount = allBadgeIds.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const badgeCategories = {
    progression: ['graine', 'pousse', 'arbre', 'maitre', 'empereur'],
    performance: ['etoile1', 'sansfaute', 'tireur', 'perfection'],
    perseverance: ['flamme1', 'flamme2', 'flamme3', 'arcenciel', 'foudre'],
    specialise: ['roimots', 'jongleur', 'acrobate', 'voyageur'],
    defi: ['cerveau']
  };

  const categoryNames = {
    progression: '📈 Progression',
    performance: '🎯 Performance',
    perseverance: '🔥 Persévérance',
    specialise: '⭐ Spécialisé',
    defi: '💪 Défi'
  };

  return (
    <div className="min-h-screen p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
              <Award className="w-8 h-8 text-blue-600" />
              <span>Mes Badges</span>
            </h2>
            <button 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              Retour
            </button>
          </div>

          {/* Progression globale */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-700">Progression</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{unlockedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {unlockedCount === totalCount ? '🎉 Tous les badges débloqués !' : `Plus que ${totalCount - unlockedCount} badge${totalCount - unlockedCount > 1 ? 's' : ''} à débloquer !`}
            </p>
          </div>

          {/* Affichage des badges par catégorie */}
          {Object.entries(badgeCategories).map(([category, badgeIds]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>{categoryNames[category]}</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {badgeIds.map(badgeId => {
                  const isUnlocked = userBadges.includes(badgeId);
                  const badge = badgeMetadata[badgeId] || { name: badgeId, description: '' };
                  
                  return (
                    <div
                      key={badgeId}
                      className={`relative rounded-xl p-4 text-center transition-all transform hover:scale-105 ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-lg'
                          : 'bg-gray-100 border-2 border-gray-300 opacity-60'
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2">
                          <Lock className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div className={`text-4xl mb-2 ${!isUnlocked && 'grayscale'}`}>
                        {badge.name.split(' ')[0]}
                      </div>
                      <div className="text-sm font-bold text-gray-800 mb-1">
                        {badge.name.substring(badge.name.indexOf(' ') + 1)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {badge.description}
                      </div>
                      {isUnlocked && (
                        <div className="mt-2">
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            ✓ Débloqué
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}