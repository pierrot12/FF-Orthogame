const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api' 
  : 'http://${window.location.hostname}/api';

export const loginUser = async (username, password) => {
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

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la création');
  }
  return response.json();
};

export const deleteUser = async (userId) => {
  await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE'
  });
};

export const fetchExercises = async () => {
  const response = await fetch(`${API_URL}/exercises`);
  return response.json();
};

export const createExercise = async (exerciseData) => {
  const response = await fetch(`${API_URL}/exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exerciseData)
  });
  return response.json();
};

export const updateExercise = async (exerciseId, exerciseData) => {
  const response = await fetch(`${API_URL}/exercises/${exerciseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exerciseData)
  });
  return response.json();
};

export const deleteExercise = async (exerciseId) => {
  await fetch(`${API_URL}/exercises/${exerciseId}`, {
    method: 'DELETE'
  });
};

export const fetchScores = async () => {
  const response = await fetch(`${API_URL}/scores`);
  return response.json();
};

export const saveScore = async (scoreData) => {
  const response = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData)
  });
  return response.json();
};