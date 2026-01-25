import { useState } from 'react';
import { loginUser, registerUser } from '../api/auth';

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
          
          onLoginSuccess(); // Props z App.jsx
        }
      } else {
        await registerUser(formData);
        alert('Rejestracja udana! Teraz możesz się zalogować.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Błąd API:", err);
      const errorMsg = err.response?.data?.detail || 'Błąd połączenia z serwerem';
      setError(typeof errorMsg === 'string' ? errorMsg : 'Nieprawidłowe dane');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999]">
      
      <div className="relative bg-cardBg p-10 rounded-2xl shadow-glow w-full max-w-[350px] text-center border border-borderGray animate-fadeIn">
        
        <button 
          onClick={onClose} 
          className="absolute top-2.5 right-4 bg-transparent border-none text-error text-[28px] font-bold cursor-pointer transition-all hover:text-red-600 hover:scale-125"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? 'Logowanie' : 'Rejestracja'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
          {!isLogin && (
            <input 
              name="nickname" 
              placeholder="Nickname" 
              onChange={handleChange} 
              className="w-full p-3 bg-lightCard border border-[#444] rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
              required 
            />
          )}
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            onChange={handleChange} 
            className="w-full p-3 bg-lightCard border border-[#444] rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Hasło" 
            onChange={handleChange} 
            className="w-full p-3 bg-lightCard border border-[#444] rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
            required 
          />
          
          {error && <p className="text-error text-xs mt-1">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-secondary text-white p-3 font-bold rounded-lg transition-all active:scale-95 mt-2 shadow-lg"
          >
            {isLogin ? 'Zaloguj się' : 'Utwórz konto'}
          </button>
        </form>

        <p className="mt-5 text-sm text-[#888]">
          {isLogin ? 'Nie masz konta?' : 'Masz już konto?'} 
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary cursor-pointer underline hover:text-secondary ml-1"
          >
            {isLogin ? 'Zarejestruj się' : 'Zaloguj się'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;