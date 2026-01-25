import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const QuizView = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/quiz/${quizId}`);
        setQuestions(response.data);
      } catch (err) {
        console.error("Błąd podczas pobierania pytań:", err);
      }
    };
    fetchQuestions();
  }, [quizId]);

  const handleOptionSelect = async (idx) => {
    if (result) return;
    setSelectedOption(idx);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/quiz/check', {
        question_id: questions[currentIdx].id,
        selected_index: idx
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResult(response.data);
      if (response.data.is_correct) {
        setScore(prev => prev + 1);
      }
    } catch (err) {
      console.error("Błąd podczas sprawdzania odpowiedzi:", err);
    }
  };

  const handleNext = () => {
    setCurrentIdx(prev => prev + 1);
    setSelectedOption(null);
    setResult(null);
  };

  if (questions.length === 0) {
    return <div className="text-center text-white mt-40 text-xl">Ładowanie pytań...</div>;
  }

  if (currentIdx >= questions.length) {
    return (
      <div className="text-center text-white mt-40 animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4">Koniec Quizu! 🏆</h2>
        <p className="text-xl text-[#888]">Twój wynik: <span className="text-primary font-bold">{score} / {questions.length}</span></p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="flex justify-center items-start pt-[120px] pb-10 px-5 min-h-[calc(100vh-70px)] bg-darkBg box-border">
      
      <div className="w-full max-w-[750px] bg-cardBg rounded-xl overflow-hidden border border-borderGray shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-fadeIn">
        
        <div className="bg-lightCard p-8 text-center border-b border-borderGray">
          <h2 className="m-0 text-xl md:text-2xl text-white leading-relaxed font-semibold">
            {currentQ.content}
          </h2>
        </div>

        <div className="w-full bg-black flex justify-center border-b border-borderGray">
          {currentQ.image_url ? (
            <img 
              src={currentQ.image_url} 
              alt="Pytanie" 
              className="max-w-full max-h-[400px] object-contain"
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#444] font-bold uppercase tracking-widest">
              Brak podglądu graficznego
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = result && i === result.correct_index;
            const isWrong = result && isSelected && !result.is_correct;

            let buttonClass = "bg-[#252525] border-2 border-borderGray text-[#ccc] p-5 rounded-lg transition-all duration-200 text-base md:text-lg font-medium min-h-[70px] flex items-center justify-center text-center ";
            
            if (isCorrect) {
              buttonClass += "!bg-success/20 !border-success !text-white";
            } else if (isWrong) {
              buttonClass += "!bg-error/20 !border-error !text-white";
            } else if (!result) {
              buttonClass += "hover:border-primary hover:bg-[#2a2a3a] hover:text-white cursor-pointer";
            } else {
              buttonClass += "opacity-50 cursor-default";
            }

            return (
              <button
                key={i}
                disabled={!!result}
                onClick={() => handleOptionSelect(i)}
                className={buttonClass}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {result && (
          <div className="p-6 pt-0 flex justify-center animate-fadeIn">
            <button 
              onClick={handleNext}
              className="w-full bg-primary hover:bg-secondary text-white py-4 px-10 rounded-lg font-bold transition-all duration-300 active:scale-95 shadow-lg"
            >
              {currentIdx === questions.length - 1 ? 'Zakończ quiz' : 'Następne pytanie'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;