const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Users
export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur de connexion');
  }
  return response.json();
};

export const createUser = async (username, password, isAdmin, createdBy) => {
  const response = await fetch(`${API_URL}/users/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, isAdmin, createdBy })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur de création');
  }
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Exercises
export const createExercise = async (exercise) => {
  const response = await fetch(`${API_URL}/exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise)
  });
  return response.json();
};

export const fetchExercises = async () => {
  const response = await fetch(`${API_URL}/exercises`);
  return response.json();
};

export const getExercise = async (id) => {
  const response = await fetch(`${API_URL}/exercises/${id}`);
  return response.json();
};

export const updateExercise = async (id, exercise) => {
  const response = await fetch(`${API_URL}/exercises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercise)
  });
  return response.json();
};

export const deleteExercise = async (id) => {
  const response = await fetch(`${API_URL}/exercises/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Scores
export const saveScore = async (username, exerciseName, score, totalWords, correctWords, results) => {
  const response = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, exerciseName, score, totalWords, correctWords, results })
  });
  return response.json();
};

export const fetchScores = async () => {
  const response = await fetch(`${API_URL}/scores`);
  return response.json();
};

export const getUserScores = async (username) => {
  const response = await fetch(`${API_URL}/scores/user/${username}`);
  return response.json();
};

// Badges
export const getBadgesMetadata = async () => {
  const response = await fetch(`${API_URL}/badges/metadata`);
  return response.json();
};