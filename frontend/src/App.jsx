import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import QuizList from './pages/QuizList';
import QuizView from './pages/QuizView';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserRole(response.data.role);
    } catch (err) {
      console.error("Nie udało się pobrać profilu użytkownika", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col bg-darkBg overflow-x-hidden">
        
        <Navbar 
          onOpenAuth={() => setIsAuthModalOpen(true)} 
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <main className="w-full flex-1 flex flex-col items-center">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/quizzes" 
              element={<QuizList userRole={userRole} />}
            />
            <Route path="/admin" element={
              <AdminRoute userRole={userRole}>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/quiz/:quizId" element={<QuizView />} />
            <Route path="/admin/edit/:quizId" element={
              <AdminRoute userRole={userRole}>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </main>

        {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </Router>
  );
}

export default App;