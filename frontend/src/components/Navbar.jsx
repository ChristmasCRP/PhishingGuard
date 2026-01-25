import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onOpenAuth, isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full h-[70px] bg-cardBg border-b border-borderGray flex justify-center items-center z-[1000]">
      <div className="w-full max-w-[1200px] flex justify-between items-center px-5">
        
        <div 
          className="text-2xl font-bold text-primary cursor-pointer select-none transition-transform hover:scale-105" 
          onClick={() => navigate('/')}
        >
          🛡️ PhishingGuard
        </div>

        <div className="flex gap-6 items-center">
          <Link to="/" className="text-white text-sm font-medium hover:text-primary transition-colors">
            Start
          </Link>
          <Link to="/quizzes" className="text-white text-sm font-medium hover:text-primary transition-colors">
            Quizy
          </Link>

          {isLoggedIn ? (
            <button 
              onClick={onLogout} 
              className="border-2 border-error text-error bg-error/10 hover:bg-error hover:text-white px-5 py-2 rounded-lg font-bold text-sm cursor-pointer transition-all duration-300 active:scale-95"
            >
              Wyloguj się
            </button>
          ) : (
            <button 
              onClick={onOpenAuth} 
              className="border-2 border-primary text-primary bg-primary/10 hover:bg-primary hover:text-white px-5 py-2 rounded-lg font-bold text-sm cursor-pointer transition-all duration-300 active:scale-95"
            >
              Zaloguj się
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;