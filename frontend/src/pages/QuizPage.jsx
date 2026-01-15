import { useEffect, useState } from 'react';
import { getQuestions, checkAnswer } from '../api/quiz';
import './QuizPage.css';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null); // Przechowuje info czy poprawna
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data } = await getQuestions();
        setQuestions(data);
      } catch (err) {
        console.error("Błąd ładowania pytań:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleOptionClick = async (index) => {
    if (selectedResult) return; // Blokada ponownego kliknięcia w tym samym pytaniu

    try {
      const { data } = await checkAnswer(questions[currentIndex].id, index);
      setSelectedResult(data);
    } catch (err) {
      alert("Musisz być zalogowany, aby sprawdzać odpowiedzi!");
    }
  };

  const nextQuestion = () => {
    setSelectedResult(null);
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) return <div className="quiz-loader">Ładowanie pytań...</div>;
  if (questions.length === 0) return <div className="quiz-loader">Baza pytań jest pusta.</div>;
  if (currentIndex >= questions.length) return <div className="quiz-end">Koniec quizu! Gratulacje.</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <span className="quiz-progress">Pytanie {currentIndex + 1} / {questions.length}</span>
        <h2 className="quiz-question">{currentQ.content}</h2>
        
        {currentQ.image_url && (
          <img src={currentQ.image_url} alt="Podgląd do pytania" className="quiz-image" />
        )}

        <div className="quiz-options">
          {currentQ.options.map((option, i) => {
            let btnClass = "";
            if (selectedResult) {
              if (i === selectedResult.correct_index) btnClass = "correct";
              else if (i === selectedResult.user_selected_index) btnClass = "incorrect"; // opcjonalne dodanie w backendzie
            }

            return (
              <button 
                key={i}
                className={`option-btn ${btnClass}`}
                onClick={() => handleOptionClick(i)}
                disabled={!!selectedResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedResult && (
          <div className="quiz-feedback">
            <p className={selectedResult.is_correct ? "msg-success" : "msg-error"}>
              {selectedResult.is_correct ? "✅ Świetnie! Poprawna odpowiedź." : "❌ Niestety, to nie ta odpowiedź."}
            </p>
            <button className="next-btn" onClick={nextQuestion}>Następne pytanie</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;