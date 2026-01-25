import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizList = ({ userRole }) => {
  const [quizzes, setQuizzes] = useState([
    { id: '1', title: 'Podstawy Phishingu', description: 'Naucz się rozpoznawać podejrzane maile.', difficulty: 'Łatwy' },
    { id: '2', title: 'Bezpieczeństwo Haseł', description: 'Jak tworzyć i zarządzać silnymi hasłami.', difficulty: 'Średni' },
    { id: '3', title: 'Socjotechnika', description: 'Nie daj się zmanipulować hakerom.', difficulty: 'Trudny' }
  ]);
  const navigate = useNavigate();

  const isAdmin = userRole === 'admin';

  return (
    <div className="max-w-[1100px] mx-auto mt-[100px] mb-10 px-5 text-center">
      
      <div className="mb-10">
        <h1 className="text-4xl md:text-[2.5rem] font-bold text-primary mb-2.5">
          Wybierz wyzwanie
        </h1>
        <p className="text-[#888] text-lg">
          Przetestuj swoją czujność w różnych scenariuszach cyberzagrożeń.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-5 w-full max-w-[1200px] mx-auto">
        {quizzes.map((quiz) => (
          <div 
            key={quiz.id}
            className="group relative bg-cardBg rounded-2xl p-6 border border-borderGray flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary animate-fadeIn"
          >
            <div className="absolute top-4 right-4 bg-lightCard px-2.5 py-1 rounded-md text-[0.75rem] text-primary border border-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {quiz.difficulty.toUpperCase()}
            </div>

            <h3 className="mt-4 mb-2.5 text-xl font-bold text-white text-left">
              {quiz.title}
            </h3>
            
            <p className="text-[#aaa] text-sm leading-relaxed mb-6 text-left flex-grow">
              {quiz.description}
            </p>

            <div className="flex flex-col gap-3 mt-auto">
              <button 
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                className="w-full bg-primary hover:bg-secondary text-white p-3 rounded-lg font-bold cursor-pointer transition-all duration-300 active:scale-95 shadow-lg"
              >
                Rozpocznij quiz
              </button>

              {isAdmin && (
                <button 
                  onClick={() => navigate(`/admin/edit/${quiz.id}`)}
                  className="w-full bg-transparent text-adminGold border border-adminGold p-2.5 rounded-lg font-bold cursor-pointer transition-all hover:bg-adminGold/10 active:scale-95"
                >
                  Edytuj pytania
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;