import React from 'react';
import { Star, Trophy, LogOut } from 'lucide-react';
import ExerciseList from './ExerciseList';
import ScoreList from './ScoreList';
import UserList from './UserList';

export default function Dashboard({ 
  user, 
  exercises, 
  scores, 
  users, 
  onLogout, 
  onCreateExercise, 
  onEditExercise, 
  onDeleteExercise, 
  onStartGame,
  onCreateUser,
  onDeleteUser
}) {
  return (
    <div className="min-h-screen p-6" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl p-8 mb-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animate-float">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                Bonjour {user.username} ! 👋
              </h1>
              <div className="flex items-center space-x-2 text-white/90">
                {user.isAdmin ? (
                  <>
                    <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                    <span className="font-semibold text-lg">Administrateur</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-6 h-6 text-blue-300 drop-shadow-lg" />
                    <span className="text-lg">Joueur</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl transition-all transform hover:scale-105 font-semibold text-white border border-white/30 shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${user.isAdmin ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
          <div className={user.isAdmin ? '' : 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-1'}>
            <ExerciseList
              exercises={exercises}
              isAdmin={user.isAdmin}
              onCreateExercise={onCreateExercise}
              onEditExercise={onEditExercise}
              onDeleteExercise={onDeleteExercise}
              onStartGame={onStartGame}
            />
          </div>

          <div className={user.isAdmin ? '' : 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-1'}>
            <ScoreList
              scores={scores}
              username={user.username}
              isAdmin={user.isAdmin}
            />
          </div>

          {user.isAdmin && (
            <UserList
              users={users}
              currentUserId={user._id}
              onCreateUser={onCreateUser}
              onDeleteUser={onDeleteUser}
            />
          )}
        </div>
      </div>
    </div>
  );
}