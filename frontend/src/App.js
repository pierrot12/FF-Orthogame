import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateUser from './components/CreateUser';
import CreateExercise from './components/CreateExercise';
import Game from './components/Game';
import Results from './components/Results';
import { fetchExercises, fetchScores, fetchUsers, deleteExercise as apiDeleteExercise, deleteUser as apiDeleteUser, saveScore } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [exercises, setExercises] = useState([]);
  const [scores, setScores] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [gameResults, setGameResults] = useState([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    const [exercisesData, scoresData] = await Promise.all([
      fetchExercises(),
      fetchScores()
    ]);
    setExercises(exercisesData);
    setScores(scoresData);

    if (user.isAdmin) {
      const usersData = await fetchUsers();
      setUsers(usersData);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setGameState('menu');
  };

  const handleLogout = () => {
    setUser(null);
    setGameState('menu');
  };

  const handleCreateExercise = () => {
    setEditingExercise(null);
    setGameState('createExercise');
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setGameState('createExercise');
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) return;
    await apiDeleteExercise(exerciseId);
    loadData();
  };

  const handleStartGame = (exercise) => {
    setCurrentExercise(exercise);
    setGameState('playing');
  };

  const handleGameFinish = async (results) => {
    const correctWords = results.filter(r => r.isCorrect).length;
    const totalWords = currentExercise.words.length;
    const score = Math.round((correctWords / totalWords) * 100);

    await saveScore({
      username: user.username,
      exerciseName: currentExercise.name,
      score,
      totalWords,
      correctWords
    });

    setGameResults(results);
    setGameState('results');
    loadData();
  };

  const handleCreateUser = () => {
    setGameState('createUser');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    await apiDeleteUser(userId);
    loadData();
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setEditingExercise(null);
    setCurrentExercise(null);
    setGameResults([]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (gameState === 'createUser') {
    return (
      <CreateUser
        currentUsername={user.username}
        onSuccess={handleBackToMenu}
        onCancel={handleBackToMenu}
      />
    );
  }

  if (gameState === 'createExercise') {
    return (
      <CreateExercise
        currentUsername={user.username}
        editingExercise={editingExercise}
        onSuccess={handleBackToMenu}
        onCancel={handleBackToMenu}
      />
    );
  }

  if (gameState === 'playing') {
    return (
      <Game
        exercise={currentExercise}
        onFinish={handleGameFinish}
      />
    );
  }

  if (gameState === 'results') {
    return (
      <Results
        username={user.username}
        exercise={currentExercise}
        results={gameResults}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      exercises={exercises}
      scores={scores}
      users={users}
      onLogout={handleLogout}
      onCreateExercise={handleCreateExercise}
      onEditExercise={handleEditExercise}
      onDeleteExercise={handleDeleteExercise}
      onStartGame={handleStartGame}
      onCreateUser={handleCreateUser}
      onDeleteUser={handleDeleteUser}
    />
  );
}

export default App;