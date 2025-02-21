import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ExerciseDetector from './components/ai/ExerciseDetector';
import Profile from './components/Game/Profile';
import Levels from './components/Game/Levels';
import Admin from './components/Admin/Admin';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Social from './components/Social/Social';
import Period from './components/Period/Period';
import { AuthProvider } from './Context/AuthContext'
import { SocketProvider } from './components/Socket/SocketContext';
import { ProtectedRoute, AdminRoute } from './Protected_Routes/ProtectedRoutes';
import"./App.css"


function App() {
  return (
    <Router>
      <AuthProvider>
      <SocketProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />

          <Route path="signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
                <Route path="exercise/:levelId" element={<ExerciseDetector />} />
                <Route path="profile" element={<Profile />} />
                <Route path="levels" element={<Levels />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="social" element={<Social />} />
                <Route path="period" element={<Period />} />
              </Route>
        </Route>
        <Route element={<AdminRoute />}>
                <Route path="admin" element={<Admin />} />
              </Route>
      </Routes>
      </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
