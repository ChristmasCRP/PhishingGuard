import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizList } from '../api/quiz';
import './QuizList.css';

const QuizList = ({ userRole }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setQuizzes([
          { id: '1', title: 'Podstawy Phishingu', description: 'Naucz się rozpoznawać podejrzane maile.', difficulty: 'Łatwy' },
          { id: '2', title: 'Bezpieczeństwo Haseł', description: 'Jak tworzyć i zarządzać silnymi hasłami.', difficulty: 'Średni' },
          { id: '3', title: 'Socjotechnika', description: 'Nie daj się zmanipulować hakerom.', difficulty: 'Trudny' },
        ]);
      } catch (err) {
        console.error("Błąd pobierania listy quizów", err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  if (loading) return <div className="loader">Wczytywanie wyzwań...</div>;

return (
    <div className="quiz-list-container">
      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="card-badge">{quiz.difficulty}</div>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            
            <div className="card-actions">
              <button 
                className="start-quiz-btn" 
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                Rozpocznij Quiz
              </button>

              {userRole === 'admin' && (
                <button 
                  className="edit-quiz-btn" 
                  onClick={() => navigate(`/admin/edit/${quiz.id}`)}
                >
                  ⚙️ Edytuj Pytania
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