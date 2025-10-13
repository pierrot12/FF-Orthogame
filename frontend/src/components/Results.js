import React from 'react';
import { Trophy, CheckCircle, XCircle } from 'lucide-react';

export default function Results({ username, exercise, results, onBackToMenu }) {
  const totalWords = exercise.words.length;
  const correctWords = results.filter(r => r.isCorrect).length;
  const score = Math.round((correctWords / totalWords) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-4 drop-shadow-2xl" />
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Bravo {username} !</h2>
          <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {score}%
          </p>
          <p className="text-xl text-gray-600">{correctWords} / {totalWords} mots corrects</p>
        </div>

        <div className="space-y-3 mb-8" style={{maxHeight: '400px', overflowY: 'auto', paddingRight: '8px'}}>
          {results.map((result, index) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${result.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="flex items-center space-x-3">
                {result.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className="font-semibold">{result.word.text}</p>
                  {!result.isCorrect && (
                    <p className="text-sm text-gray-600">Ta réponse : {result.userAnswer}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onBackToMenu}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105"
        >
          Retour au menu
        </button>
      </div>
    </div>
  );
}