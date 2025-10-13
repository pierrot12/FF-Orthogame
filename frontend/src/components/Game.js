import React, { useState, useEffect } from 'react';

export default function Game({ exercise, onFinish }) {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [conjugationAnswers, setConjugationAnswers] = useState({
    je: '', tu: '', il: '', nous: '', vous: '', ils: ''
  });
  const [results, setResults] = useState([]);

  // Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Mélanger les mots au premier chargement
  useEffect(() => {
    if (exercise.words && exercise.words.length > 0) {
      setShuffledWords(shuffleArray(exercise.words));
    }
  }, [exercise.words]);

  const currentWord = shuffledWords[currentWordIndex];
  const progress = shuffledWords.length > 0 ? ((currentWordIndex + 1) / shuffledWords.length) * 100 : 0;
  const isVerbPresent = currentWord?.type === 'verb' && currentWord?.conjugation === 'present' && currentWord?.conjugatedForms;

  useEffect(() => {
    if (currentWord) {
      speakWord(currentWord);
    }
  }, [currentWordIndex, currentWord]);

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getConjugationText = (conjugation) => {
    const texts = {
      present: 'au présent',
      futur: 'au futur',
      imparfait: "à l'imparfait",
      passe_compose: 'au passé composé'
    };
    return texts[conjugation] || '';
  };

  const submitAnswer = () => {
    let isCorrect = false;
    let userAnswerText = '';

    if (isVerbPresent) {
      isCorrect = Object.keys(conjugationAnswers).every(
        pronoun => conjugationAnswers[pronoun].toLowerCase().trim() === (currentWord.conjugatedForms[pronoun] || '').toLowerCase().trim()
      );
      userAnswerText = `je: ${conjugationAnswers.je}, tu: ${conjugationAnswers.tu}, il/elle: ${conjugationAnswers.il}, nous: ${conjugationAnswers.nous}, vous: ${conjugationAnswers.vous}, ils/elles: ${conjugationAnswers.ils}`;
    } else {
      isCorrect = userAnswer.toLowerCase().trim() === currentWord.text.toLowerCase().trim();
      userAnswerText = userAnswer;
    }
    
    const newResults = [...results, { word: currentWord, userAnswer: userAnswerText, isCorrect }];
    setResults(newResults);
    setUserAnswer('');
    setConjugationAnswers({ je: '', tu: '', il: '', nous: '', vous: '', ils: '' });

    if (currentWordIndex + 1 < shuffledWords.length) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      onFinish(newResults);
    }
  };

  // Afficher un message de chargement si les mots ne sont pas encore mélangés
  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-3xl shadow-2xl p-8">
          <p className="text-2xl font-bold text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-3xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-bold text-lg">Mot {currentWordIndex + 1} sur {shuffledWords.length}</span>
            <span className="text-blue-600 font-bold text-xl">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="backdrop-blur-md bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 mb-6 border-2 border-blue-200 shadow-xl">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => speakWord(currentWord)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full hover:shadow-xl transition transform hover:scale-110"
                title="Réécouter le mot"
              >
                🔊
              </button>
              <p className="text-gray-700 text-2xl font-bold">Écoute et écris le mot :</p>
            </div>
            <p className="text-5xl font-bold text-blue-700 mb-3">🎧 ???</p>
            {currentWord.type === 'verb' && (
              <p className="text-xl text-purple-600 font-semibold mt-2">
                {isVerbPresent ? 'Conjugue au présent (toutes les personnes)' : getConjugationText(currentWord.conjugation)}
              </p>
            )}
          </div>

          {isVerbPresent ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { pronoun: 'je', label: 'Je' },
                  { pronoun: 'tu', label: 'Tu' },
                  { pronoun: 'il', label: 'Il/Elle' },
                  { pronoun: 'nous', label: 'Nous' },
                  { pronoun: 'vous', label: 'Vous' },
                  { pronoun: 'ils', label: 'Ils/Elles' }
                ].map(({ pronoun, label }) => (
                  <div key={pronoun} className="flex items-center space-x-2">
                    <label className="font-bold text-gray-700 w-20 text-right">{label}</label>
                    <input
                      type="text"
                      value={conjugationAnswers[pronoun]}
                      onChange={(e) => setConjugationAnswers({ ...conjugationAnswers, [pronoun]: e.target.value })}
                      placeholder="..."
                      className="flex-1 px-4 py-3 text-lg text-center rounded-xl border-3 border-blue-300 focus:border-blue-500 outline-none backdrop-blur-sm bg-white/80 shadow-lg transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && submitAnswer()}
              placeholder="Ta réponse..."
              className="w-full px-6 py-4 text-2xl text-center rounded-xl border-4 border-blue-300 focus:border-blue-500 outline-none backdrop-blur-sm bg-white/90 shadow-xl transition-all"
              autoFocus
            />
          )}

          <button
            onClick={submitAnswer}
            disabled={isVerbPresent ? Object.values(conjugationAnswers).some(v => !v.trim()) : !userAnswer.trim()}
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-xl hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider ✓
          </button>
        </div>
      </div>
    </div>
  );
}