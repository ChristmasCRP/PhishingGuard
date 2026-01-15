import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ onOpenAuth, isLoggedIn, onLogout, userRole }) => { 
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/')}>🛡️ PhishingGuard</div>
        <div className="nav-links">
          <Link to="/">Start</Link>
          <Link to="/quizzes">Quizy</Link>
          
          {/* Teraz userRole będzie już zdefiniowany i błąd zniknie */}
          {userRole === 'admin' && (
            <Link to="/admin" style={{ color: '#ffcc00', fontWeight: 'bold' }}>⚙️ Panel Admina</Link>
          )}

          {isLoggedIn ? (
            <button onClick={onLogout} className="logout-btn">Wyloguj się</button>
          ) : (
            <button onClick={onOpenAuth} className="login-btn">Zaloguj się</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;