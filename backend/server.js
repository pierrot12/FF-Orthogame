require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

console.log('🚀 Démarrage du serveur...');

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_atlas_connection_string';

console.log('📡 Connexion à MongoDB...');
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connecté avec succès !');
  createDefaultAdmin();
})
.catch((err) => console.error('❌ Erreur MongoDB:', err.message));

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const wordSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['simple', 'verb'], required: true },
  conjugation: { 
    type: String, 
    enum: ['present', 'futur', 'imparfait', 'passe_compose', null], 
    default: null 
  }
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  words: [wordSchema],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const scoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  exerciseName: { type: String, required: true },
  score: { type: Number, required: true },
  totalWords: { type: Number, required: true },
  correctWords: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);
const Score = mongoose.model('Score', scoreSchema);

// Créer un compte admin par défaut
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        isAdmin: true
      });
      await admin.save();
      console.log('✅ Compte administrateur par défaut créé (admin/admin123)');
    } else {
      console.log('ℹ️ Compte administrateur déjà existant');
    }
  } catch (error) {
    console.error('❌ Erreur création admin par défaut:', error.message);
  }
}

// Routes

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Orthographe Game - Backend opérationnel !' });
});

// Users
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Le nom d\'utilisateur est requis' });
    }
    
    if (!password || password.trim() === '') {
      return res.status(400).json({ error: 'Le mot de passe est requis' });
    }
    
    let user = await User.findOne({ username, password });
    
    if (!user) {
      return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
    
    console.log(`👤 Connexion utilisateur: ${username} (Admin: ${user.isAdmin})`);
    res.json(user);
  } catch (error) {
    console.error('❌ Erreur login:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/create', async (req, res) => {
  try {
    const { username, password, isAdmin, createdBy } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Le nom d\'utilisateur est requis' });
    }
    
    if (!password || password.trim() === '') {
      return res.status(400).json({ error: 'Le mot de passe est requis' });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Ce nom d\'utilisateur existe déjà' });
    }
    
    const user = new User({ 
      username, 
      password,
      isAdmin: isAdmin || false 
    });
    await user.save();
    console.log(`✅ Nouvel utilisateur créé: ${username} (Admin: ${isAdmin}) par ${createdBy}`);
    res.json(user);
  } catch (error) {
    console.error('❌ Erreur création utilisateur:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('❌ Erreur récupération users:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Utilisateur supprimé: ${req.params.id}`);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('❌ Erreur suppression utilisateur:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Exercises
app.post('/api/exercises', async (req, res) => {
  try {
    const { name, words, createdBy } = req.body;
    
    if (!name || !words || words.length === 0) {
      return res.status(400).json({ error: 'Nom et mots requis' });
    }
    
    const exercise = new Exercise({ name, words, createdBy });
    await exercise.save();
    console.log(`✅ Exercice créé: ${name} (${words.length} mots)`);
    res.json(exercise);
  } catch (error) {
    console.error('❌ Erreur création exercice:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ createdAt: -1 });
    res.json(exercises);
  } catch (error) {
    console.error('❌ Erreur récupération exercices:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/exercises/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }
    res.json(exercise);
  } catch (error) {
    console.error('❌ Erreur récupération exercice:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/exercises/:id', async (req, res) => {
  try {
    const { name, words } = req.body;
    
    if (!name || !words || words.length === 0) {
      return res.status(400).json({ error: 'Nom et mots requis' });
    }
    
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { name, words },
      { new: true }
    );
    console.log(`✅ Exercice modifié: ${name} (${words.length} mots)`);
    res.json(exercise);
  } catch (error) {
    console.error('❌ Erreur modification exercice:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/exercises/:id', async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Exercice supprimé: ${req.params.id}`);
    res.json({ message: 'Exercice supprimé' });
  } catch (error) {
    console.error('❌ Erreur suppression exercice:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Scores
app.post('/api/scores', async (req, res) => {
  try {
    const { username, exerciseName, score, totalWords, correctWords } = req.body;
    
    if (!username || !exerciseName || score === undefined) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }
    
    const newScore = new Score({ 
      username, 
      exerciseName, 
      score, 
      totalWords, 
      correctWords 
    });
    await newScore.save();
    console.log(`🏆 Score enregistré: ${username} - ${score}% (${exerciseName})`);
    res.json(newScore);
  } catch (error) {
    console.error('❌ Erreur enregistrement score:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ date: -1 });
    res.json(scores);
  } catch (error) {
    console.error('❌ Erreur récupération scores:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scores/user/:username', async (req, res) => {
  try {
    const scores = await Score.find({ username: req.params.username }).sort({ date: -1 });
    res.json(scores);
  } catch (error) {
    console.error('❌ Erreur récupération scores utilisateur:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route pour conjugaison
app.get('/api/conjugate/:verb', async (req, res) => {
  try {
    const verb = req.params.verb;
    const https = require('https');
    
    // Essayer plusieurs APIs
    const apis = [
      `https://conjugaison.org/api/${verb}`,
      `https://api.verbiste.com/verb/${verb}`,
    ];
    
    // Pour simplifier, on retourne juste une structure vide
    // L'admin devra remplir manuellement
    res.json({
      success: false,
      message: 'Remplis manuellement',
      data: {
        je: '',
        tu: '',
        il: '',
        nous: '',
        vous: '',
        ils: ''
      }
    });
  } catch (error) {
    res.json({
      success: false,
      data: {
        je: '',
        tu: '',
        il: '',
        nous: '',
        vous: '',
        ils: ''
      }
    });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 API disponible sur http://localhost:${PORT}/api`);
  console.log(`📝 Test: http://localhost:${PORT}/`);
});