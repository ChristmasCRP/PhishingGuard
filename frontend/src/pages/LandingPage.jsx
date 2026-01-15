// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="hero-content">
        <div className="hero-icon">🛡️</div>
        <h1 className="hero-title">Zadbaj o swoje bezpieczeństwo w sieci</h1>
        <p className="hero-subtitle">
          Cyberprzestępcy nie śpią, a phishing to ich ulubiona broń. 
          Przetestuj swoją wiedzę w naszych interaktywnych quizach i naucz się, 
          jak nie dać się złapać na haczyk.
        </p>
        <Link to="/quizzes" className="cta-button">
          Przejdź do quizów
        </Link>
      </div>
      
      <div className="hero-stats">
        <div className="stat-item">
          <strong>100%</strong>
          <span>Darmowa wiedza</span>
        </div>
        <div className="stat-item">
          <strong>Praktyka</strong>
          <span>Realne przykłady</span>
        </div>
        <div className="stat-item">
          <strong>Rozwój</strong>
          <span>Ciągłe aktualizacje</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;