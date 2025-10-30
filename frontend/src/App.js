import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateUser from './components/CreateUser';
import CreateExercise from './components/CreateExercise';
import Game from './components/Game';
import Results from './components/Results';
import Badges from './components/Badges';
import { 
  fetchExercises, 
  fetchScores, 
  fetchUsers, 
  deleteExercise as apiDeleteExercise, 
  deleteUser as apiDeleteUser,
  login as apiLogin  // ✅ Import ajouté pour rafraîchir l'utilisateur
} from './services/api';

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

  // ✅ Nouvelle fonction pour rafraîchir les données utilisateur
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Rafraîchissement des données utilisateur...');
      // On récupère les données fraîches depuis le serveur
      const freshUserData = await apiLogin(user.username, user.password);
      setUser(freshUserData);
      console.log('✅ Données utilisateur mises à jour', freshUserData);
      return freshUserData;
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      // Si erreur, on garde l'utilisateur actuel
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

  const handleGameFinish = (results) => {
    setGameResults(results);
    setGameState('results');
  };

  const handleCreateUser = () => {
    setGameState('createUser');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    await apiDeleteUser(userId);
    loadData();
  };

  const handleViewBadges = () => {
    setGameState('badges');
  };

  // ✅ Fonction améliorée qui rafraîchit vraiment l'utilisateur
  const handleUserUpdate = async (newBadges) => {
    console.log('🎯 Mise à jour suite aux nouveaux badges:', newBadges);
    
    // Option 1: Mise à jour locale immédiate pour l'UX
    if (newBadges && newBadges.length > 0) {
      setUser(prevUser => ({
        ...prevUser,
        badges: [...new Set([...(prevUser.badges || []), ...newBadges])]
      }));
    }
    
    // Option 2: Rafraîchir depuis le serveur pour avoir TOUTES les données à jour
    // (stats, badges, etc.)
    await refreshUserData();
    
    // Recharger aussi les scores pour que la liste soit à jour
    loadData();
  };

  // ✅ Fonction améliorée pour retourner au menu
  const handleBackToMenu = async () => {
    console.log('🏠 Retour au menu...');
    
    // Si on revient des résultats, rafraîchir les données utilisateur
    if (gameState === 'results') {
      await refreshUserData();
      await loadData(); // Recharger les scores et exercices aussi
    }
    
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
        onSuccess={() => {
          loadData();
          handleBackToMenu();
        }}
        onCancel={handleBackToMenu}
      />
    );
  }

  if (gameState === 'createExercise') {
    return (
      <CreateExercise
        currentUsername={user.username}
        editingExercise={editingExercise}
        onSuccess={() => {
          loadData();
          handleBackToMenu();
        }}
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
        onUserUpdate={handleUserUpdate}
      />
    );
  }

  if (gameState === 'badges') {
    return (
      <Badges
        currentUser={user}
        onBack={handleBackToMenu}
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
      onViewBadges={handleViewBadges}
    />
  );
}

export default App;