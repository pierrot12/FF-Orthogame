import React, { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';

export default function BadgeNotification({ badges, badgeMetadata, onClose }) {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-fermer après 5 secondes
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentBadgeIndex]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (currentBadgeIndex < badges.length - 1) {
        setCurrentBadgeIndex(currentBadgeIndex + 1);
        setIsVisible(true);
      } else {
        onClose();
      }
    }, 300);
  };

  if (!badges || badges.length === 0) return null;

  const currentBadge = badges[currentBadgeIndex];
  const badgeInfo = badgeMetadata[currentBadge] || { name: currentBadge, description: '' };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-300 rounded-2xl shadow-2xl p-6 max-w-sm animate-bounce">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-lg">Nouveau Badge !</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-6xl mb-3 animate-pulse">
            {badgeInfo.name.split(' ')[0]}
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {badgeInfo.name.substring(badgeInfo.name.indexOf(' ') + 1)}
          </div>
          <div className="text-white text-sm bg-white/20 rounded-lg px-3 py-2">
            {badgeInfo.description}
          </div>
        </div>

        {badges.length > 1 && (
          <div className="mt-4 text-center text-white text-xs">
            Badge {currentBadgeIndex + 1} sur {badges.length}
          </div>
        )}
      </div>
    </div>
  );
}