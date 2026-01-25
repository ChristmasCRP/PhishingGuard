import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-70px)] mx-auto text-center px-5 py-10 bg-[radial-gradient(circle_at_center,_#1e1e2e_0%,_#121212_100%)]">
      
      <div className="flex flex-col items-center max-w-[800px] w-full animate-fadeIn">
        
        {/* Ikona (hero-icon) */}
        <div className="text-[4rem] mb-5 drop-shadow-2xl">🛡️</div>
        
        <h1 className="text-4xl md:text-[3.5rem] font-extrabold mb-5 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent leading-[1.2]">
          Zadbaj o swoje bezpieczeństwo w sieci
        </h1>
        
        <p className="text-lg md:text-xl text-[#aaa] leading-relaxed mb-10 max-w-[600px]">
          Cyberprzestępcy nie śpią, a phishing to ich ulubiona broń. 
          Dowiedz się, jak rozpoznawać fałszywe wiadomości i chroń swoje dane.
        </p>
        
        <Link 
          to="/quizzes" 
          className="inline-block bg-primary hover:bg-secondary text-white px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(100,108,255,0.3)] hover:shadow-[0_6px_20px_rgba(100,108,255,0.5)] hover:scale-105 cursor-pointer no-underline"
        >
          Przejdź do quizów
        </Link>

        <div className="flex justify-center flex-wrap gap-x-12 gap-y-8 mt-20 pt-10 border-t border-borderGray w-full max-w-[800px]">
          <div className="flex flex-col items-center">
            <strong className="text-2xl font-black text-primary">10+</strong>
            <span className="text-[#888] text-sm mt-1 uppercase tracking-wider font-semibold">
              Interaktywnych lekcji
            </span>
          </div>
          <div className="flex flex-col items-center">
            <strong className="text-2xl font-black text-primary">100%</strong>
            <span className="text-[#888] text-sm mt-1 uppercase tracking-wider font-semibold">
              Praktycznej wiedzy
            </span>
          </div>
          <div className="flex flex-col items-center">
            <strong className="text-2xl font-black text-primary">FREE</strong>
            <span className="text-[#888] text-sm mt-1 uppercase tracking-wider font-semibold">
              Zawsze za darmo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;