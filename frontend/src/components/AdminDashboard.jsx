import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestions } from '../api/quiz';
import { deleteQuestion, addQuestion, updateQuestion } from '../api/admin';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    content: '', 
    options: ['', '', '', ''], 
    correct_answer_index: 0, 
    image_url: '',
    quiz_id: quizId
  });

  useEffect(() => { loadQuestions(); }, [quizId]);

  const loadQuestions = async () => {
    try {
      const { data } = await getQuestions(quizId);
      setQuestions(data);
    } catch (err) {
      console.error("Błąd ładowania pytań:", err);
    }
  };

  const handleEditClick = (q) => {
    setEditingId(q.id);
    const paddedOptions = [...q.options];
    while (paddedOptions.length < 4) paddedOptions.push('');
    
    setFormData({
      content: q.content || '',
      options: paddedOptions,
      correct_answer_index: q.correct_answer_index ?? 0, 
      image_url: q.image_url || '',
      quiz_id: q.quiz_id || quizId
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nonEmptyOptions = formData.options.map(o => o.trim()).filter(o => o !== '');
    
    if (nonEmptyOptions.length < 2) {
      alert("Proszę podać co najmniej 2 odpowiedzi.");
      return;
    }

    try {
      const { id, ...cleanData } = formData;
      const payload = {
        ...cleanData,
        options: nonEmptyOptions,
        correct_answer_index: parseInt(formData.correct_answer_index, 10),
        image_url: formData.image_url || null,
        quiz_id: quizId
      };

      if (editingId) {
        await updateQuestion(editingId, payload);
      } else {
        await addQuestion(payload);
      }
      
      resetForm();
      await loadQuestions();
      alert("Zmiany zapisane pomyślnie!");
    } catch (err) { 
      console.error("Błąd API:", err.response?.data);
      alert("Wystąpił błąd podczas zapisywania."); 
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      content: '', 
      options: ['', '', '', ''], 
      correct_answer_index: 0, 
      image_url: '', 
      quiz_id: quizId 
    });
  };

  return (
    <div className="admin-view">
      <div className="admin-header-box">
        <h1>Zarządzanie treścią</h1>
        <p className="quiz-id-tag">Katalog pytań • Quiz ID: {quizId}</p>
      </div>
      
      <section className="admin-card editor-section">
        <h3 className="section-title">
          {editingId ? '⚡ Edycja pytania' : '✨ Nowe pytanie'}
        </h3>
        
        <form className="question-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Treść pytania</label>
            <textarea 
              className="styled-textarea"
              placeholder="Wpisz treść pytania, np. 'Czy ten załącznik jest bezpieczny?'" 
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              required 
            />
          </div>
          
          <div className="form-grid">
            <div className="options-section">
              <label className="input-label">Opcje odpowiedzi & klucz</label>
              <div className="options-input-column">
                {formData.options.map((opt, i) => (
                  <div 
                    key={i} 
                    className={`opt-input-wrapper ${formData.correct_answer_index === i ? 'is-correct-row' : ''}`}
                  >
                    <div className="radio-custom">
                      <input 
                        type="radio"
                        id={`opt-${i}`}
                        name="correct-choice"
                        checked={formData.correct_answer_index === i}
                        onChange={() => setFormData({...formData, correct_answer_index: i})}
                      />
                      <label htmlFor={`opt-${i}`}></label>
                    </div>
                    <input 
                      type="text"
                      className="styled-input"
                      placeholder={i < 2 ? `Odpowiedź ${i + 1} (wymagana)` : `Opcja ${i + 1} (opcjonalnie)`} 
                      value={opt}
                      onChange={e => {
                        const newOpts = [...formData.options];
                        newOpts[i] = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }} 
                      required={i < 2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="media-section">
              <label className="input-label">Załącznik wizualny</label>
              <input 
                type="text"
                className="styled-input"
                placeholder="URL do obrazka (np. z Imgur)..." 
                value={formData.image_url} 
                onChange={e => setFormData({...formData, image_url: e.target.value})} 
              />
              <div className="image-preview-container">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Podgląd" onError={(e) => e.target.style.display='none'} />
                ) : (
                  <div className="img-placeholder-content">
                    <span className="icon">🖼️</span>
                    <p>Podgląd obrazka</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
             <button type="submit" className="btn-primary-gradient">
               {editingId ? "Zaktualizuj w bazie" : "Dodaj pytanie"}
             </button>
             {editingId && (
               <button type="button" className="btn-outline" onClick={resetForm}>
                 Anuluj edycję
               </button>
             )}
          </div>
        </form>
      </section>

      <section className="inventory-section">
        <h3 className="section-title">Baza pytań ({questions.length})</h3>
        <div className="questions-masonry">
          {questions.map((q, idx) => (
            <div key={q.id} className="q-item-card">
              <div className="q-item-header">
                <span className="q-idx">PYTANIE #{idx + 1}</span>
                <div className="q-item-btns">
                  <button onClick={() => handleEditClick(q)} className="btn-mini-edit">Edytuj</button>
                  <button 
                    onClick={async () => {
                      if(window.confirm("Czy na pewno usunąć?")) {
                        await deleteQuestion(q.id);
                        loadQuestions();
                      }
                    }} 
                    className="btn-mini-delete"
                  >
                    Usuń
                  </button>
                </div>
              </div>
              <p className="q-item-text">{q.content}</p>
              <div className="q-item-meta">
                <span className="meta-tag">{q.options.length} opcje</span>
                {q.image_url && <span className="meta-tag img-tag">Załącznik</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;