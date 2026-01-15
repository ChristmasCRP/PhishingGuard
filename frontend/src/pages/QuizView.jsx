import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions, checkAnswer } from '../api/quiz';
import './QuizView.css';

const QuizView = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchQuizData = async () => {
    try {
      const { data } = await getQuestions(quizId); 
      setQuestions(data);
    } catch (err) {
      console.error("Błąd ładowania quizu", err);
    } finally {
      setLoading(false);
    }
  };
  fetchQuizData();
}, [quizId]);

  const handleChoice = async (index) => {
    if (selectedResult) return;
    try {
      const { data } = await checkAnswer(questions[currentIdx].id, index);
      setSelectedResult({ ...data, userSelection: index });
    } catch (err) {
      alert("Musisz być zalogowany, aby sprawdzić odpowiedź!");
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedResult(null);
    } else {
      navigate('/quizzes');
    }
  };

  if (loading) return <div className="quiz-status">Wczytywanie wyzwania...</div>;
  if (!questions.length) return <div className="quiz-status">Brak pytań w tym quizie.</div>;

  const q = questions[currentIdx];

  return (
    <div className="quiz-view-wrapper">
      <div className="quiz-card-template">
        <div className="q-header">
          <h2>{q.content}</h2>
        </div>

        <div className="q-media">
          {q.image_url ? (
            <img src={q.image_url} alt="Zasób wizualny" />
          ) : (
            <div className="q-placeholder">
              <span>🛡️ PhishingGuard Analysis</span>
            </div>
          )}
        </div>

        <div className="q-grid">
          {q.options.map((opt, i) => {
            let statusClass = "";
            if (selectedResult) {
              if (i === selectedResult.correct_index) statusClass = "is-correct";
              else if (i === selectedResult.userSelection) statusClass = "is-wrong";
            }

            return (
              <button
                key={i}
                className={`q-option ${statusClass}`}
                onClick={() => handleChoice(i)}
                disabled={!!selectedResult}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {selectedResult && (
          <div className="q-footer">
            <button className="q-next-btn" onClick={nextQuestion}>
              {currentIdx + 1 < questions.length ? "Następne pytanie →" : "Zakończ quiz"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;