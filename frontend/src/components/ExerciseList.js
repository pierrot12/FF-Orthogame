import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

export default function ExerciseList({ exercises, isAdmin, onCreateExercise, onEditExercise, onDeleteExercise, onStartGame }) {
  return (
    <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/95 border border-white/30 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span>Exercices</span>
        </h2>
        {isAdmin && (
          <button
            onClick={onCreateExercise}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition transform hover:scale-110 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Créer</span>
          </button>
        )}
      </div>
      
      <div className="space-y-3" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '8px'}}>
        {exercises.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Aucun exercice disponible</p>
          </div>
        ) : (
          exercises.map((exercise) => (
            <div key={exercise._id} className="backdrop-blur-md bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{exercise.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">📝 {exercise.words.length} mots</p>
                </div>
                <div className="flex gap-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => onEditExercise(exercise)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg hover:shadow-lg transition transform hover:scale-110"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteExercise(exercise._id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-lg hover:shadow-lg transition transform hover:scale-110"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onStartGame(exercise)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl font-bold hover:shadow-xl transition transform hover:scale-110 whitespace-nowrap"
                    >
                      Jouer ▶️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}