const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5001/api' 
  : `${window.location.protocol}//${window.location.hostname}/api`;

// Fonction helper pour ajouter le token aux headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Gestion de l'authentification
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
  const data = await response.json();
  
  // Sauvegarder le token et l'utilisateur dans localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user || data));
  }
  
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Users
export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
    method: 'DELETE',
    headers: getAuthHeaders()
  });
};

// Exercises
export const fetchExercises = async () => {
  const response = await fetch(`${API_URL}/exercises`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const createExercise = async (exerciseData) => {
  const response = await fetch(`${API_URL}/exercises`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(exerciseData)
  });
  return response.json();
};

export const updateExercise = async (exerciseId, exerciseData) => {
  const response = await fetch(`${API_URL}/exercises/${exerciseId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(exerciseData)
  });
  return response.json();
};

export const deleteExercise = async (exerciseId) => {
  await fetch(`${API_URL}/exercises/${exerciseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
};

// Scores
export const fetchScores = async () => {
  const response = await fetch(`${API_URL}/scores`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

export const saveScore = async (scoreData) => {
  const response = await fetch(`${API_URL}/scores`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(scoreData)
  });
  return response.json();
};