import { useState } from 'react';
import { loginUser, registerUser } from '../api/auth';
import './AuthModal.css';

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nickname: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    if (isLogin) {
      const response = await loginUser({ email: formData.email, password: formData.password });
      
      if (response.data && response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('token_type', response.data.token_type);
        
        onLoginSuccess();
      }
    } else {
      await registerUser(formData);
      alert('Rejestracja udana!');
      setIsLogin(true);
    }
  } catch (err) {
    console.error("Błąd API:", err);
    const errorMsg = err.response?.data?.detail || 'Błąd połączenia z serwerem';
    setError(typeof errorMsg === 'string' ? errorMsg : 'Nieprawidłowe dane');
  }
};

  return (
    <div className="modal-backdrop">
     <div className="modal-window">
        <button className="close-x-btn" onClick={onClose}>&times;</button>
        
        <h2>{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input name="nickname" placeholder="Nickname" onChange={handleChange} required />
          )}
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Hasło" onChange={handleChange} required />
          
          <button type="submit" className="auth-btn">
            {isLogin ? 'Zaloguj się' : 'Utwórz konto'}
          </button>
        </form>

        <p className="toggle-mode">
          {isLogin ? 'Nie masz konta?' : 'Masz już konto?'} 
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Zarejestruj się' : ' Zaloguj się'}
          </span>
        </p>
        
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default AuthModal;