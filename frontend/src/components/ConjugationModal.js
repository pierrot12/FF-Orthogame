import React from 'react';

export default function ConjugationModal({ verb, conjugationData, setConjugationData, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          ✨ Conjugaison : {verb}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Je</label>
              <input
                type="text"
                value={conjugationData.je}
                onChange={(e) => setConjugationData({ ...conjugationData, je: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tu</label>
              <input
                type="text"
                value={conjugationData.tu}
                onChange={(e) => setConjugationData({ ...conjugationData, tu: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Il/Elle</label>
              <input
                type="text"
                value={conjugationData.il}
                onChange={(e) => setConjugationData({ ...conjugationData, il: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nous</label>
              <input
                type="text"
                value={conjugationData.nous}
                onChange={(e) => setConjugationData({ ...conjugationData, nous: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vous</label>
              <input
                type="text"
                value={conjugationData.vous}
                onChange={(e) => setConjugationData({ ...conjugationData, vous: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ils/Elles</label>
              <input
                type="text"
                value={conjugationData.ils}
                onChange={(e) => setConjugationData({ ...conjugationData, ils: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl font-semibold transition"
          >
            ❌ Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition"
          >
            ✅ Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}