import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { quizId: paramQuizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [questionData, setQuestionData] = useState({
    quiz_id: paramQuizId || '',
    content: '',
    image_url: '',
    options: ['', '', '', ''],
    correct_answer_index: 0
  });

  const fetchQuestions = async () => {
    if (!questionData.quiz_id) return;
    try {
      const response = await axios.get(`http://localhost:8000/quiz/${questionData.quiz_id}`);
      setQuestions(response.data);
    } catch (err) {
      console.error("Błąd pobierania pytań:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [questionData.quiz_id]);

  const handleInputChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (idx, val) => {
    const newOptions = [...questionData.options];
    newOptions[idx] = val;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/admin/quiz/${editingId}`, questionData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Pytanie zaktualizowane!");
      } else {
        await axios.post('http://localhost:8000/admin/questions', questionData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Pytanie dodane!");
      }
      setEditingId(null);
      setQuestionData({ ...questionData, content: '', image_url: '', options: ['', '', '', ''], correct_answer_index: 0 });
      fetchQuestions();
    } catch (err) {
      alert("Błąd zapisu!");
    }
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setQuestionData({
      quiz_id: q.quiz_id,
      content: q.content,
      image_url: q.image_url || '',
      options: [...q.options],
      correct_answer_index: q.correct_answer_index
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Usunąć to pytanie?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/admin/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions();
    } catch (err) {
      alert("Błąd usuwania!");
    }
  };

  return (
    <div className="max-w-[1050px] mx-auto mt-[110px] mb-[60px] px-6 font-sans">
      
      <div className="mb-9 border-l-[5px] border-primary pl-5">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {editingId ? 'Edytuj Pytanie' : 'Panel Administratora'}
        </h1>
        <p className="text-[#888] text-sm mt-1">
          ID Quizu: <span className="text-primary font-mono">{questionData.quiz_id || 'Brak'}</span>
        </p>
      </div>

      <div className="bg-[#181818] border border-[#2a2a2a] rounded-[20px] p-8 md:p-10 shadow-glow animate-fadeIn">
        <h2 className="text-primary text-[1.1rem] uppercase tracking-[2px] mb-8 font-bold">
          {editingId ? 'Modyfikacja treści' : 'Dodaj nowe pytanie'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 mb-10">
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-[#aaa] text-[0.8rem] font-semibold mb-3 uppercase">Treść pytania</label>
                <textarea
                  name="content"
                  value={questionData.content}
                  onChange={handleInputChange}
                  placeholder="Wpisz treść pytania..."
                  className="w-full min-h-[120px] bg-[#0f0f0f] border border-[#333] rounded-xl text-white p-4 text-base focus:outline-none focus:border-primary focus:bg-[#121212] transition-all focus:ring-4 focus:ring-primary/15"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[#aaa] text-[0.8rem] font-semibold mb-3 uppercase">URL obrazka (opcjonalnie)</label>
                <input
                  name="image_url"
                  value={questionData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.png"
                  className="w-full bg-[#0f0f0f] border border-[#333] rounded-xl text-white px-[18px] py-[14px] text-base focus:outline-none focus:border-primary focus:bg-[#121212] transition-all focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[#aaa] text-[0.8rem] font-semibold mb-3 uppercase block">Odpowiedzi (zaznacz poprawną)</label>
              <div className="flex flex-col gap-3">
                {questionData.options.map((opt, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-4 px-4 py-2 rounded-xl border transition-all duration-300 ${
                      questionData.correct_answer_index === idx 
                      ? 'border-primary bg-primary/10 shadow-[inset_0_0_15px_rgba(100,108,255,0.05)]' 
                      : 'bg-[#0f0f0f] border-[#333]'
                    }`}
                  >
                    <div className="relative w-6 h-6 shrink-0">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={questionData.correct_answer_index === idx}
                        onChange={() => setQuestionData({ ...questionData, correct_answer_index: idx })}
                        className="peer opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                      />
                      <div className="absolute inset-0 bg-[#222] border-2 border-[#444] rounded-full peer-checked:border-primary peer-checked:bg-primary transition-all peer-checked:shadow-[0_0_10px_rgba(100,108,255,0.5)]"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>

                    <input
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Opcja ${idx + 1}`}
                      className="w-full bg-transparent border-none text-white focus:outline-none py-2"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 h-[180px] bg-[#0a0a0a] border-2 border-dashed border-[#222] rounded-2xl overflow-hidden flex items-center justify-center">
                {questionData.image_url ? (
                  <img src={questionData.image_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-[#333]">
                    <span className="block text-3xl mb-1">🖼️</span>
                    <span className="text-xs uppercase font-bold">Podgląd obrazu</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              className="bg-gradient-to-br from-primary to-secondary text-white px-10 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(100,108,255,0.3)] active:scale-95"
            >
              {editingId ? 'Zapisz zmiany' : 'Opublikuj pytanie'}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setQuestionData({ ...questionData, content: '', image_url: '', options: ['', '', '', ''], correct_answer_index: 0 });
                }}
                className="bg-transparent border border-[#333] text-[#888] px-8 py-4 rounded-xl font-bold hover:bg-[#222] transition-all"
              >
                Anuluj
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-[70px]">
        <h2 className="text-primary text-[1.1rem] uppercase tracking-[2px] mb-8 font-bold">Lista pytań w tym quizie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q, idx) => (
            <div 
              key={q.id} 
              className="bg-[#181818] border border-[#252525] rounded-[18px] p-6 transition-all hover:border-primary hover:-translate-y-1 group animate-fadeIn"
            >
              <div className="flex justify-between items-center mb-5">
                <span className="text-primary font-black text-[0.75rem]">Pytanie #{idx + 1}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(q)}
                    className="bg-[#333] text-white px-3 py-1.5 rounded-lg text-[0.75rem] font-bold hover:bg-primary transition-colors"
                  >
                    Edytuj
                  </button>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="bg-error/10 text-error px-3 py-1.5 rounded-lg text-[0.75rem] font-bold hover:bg-error hover:text-white transition-colors"
                  >
                    Usuń
                  </button>
                </div>
              </div>
              <p className="text-[#ccc] text-[0.95rem] leading-relaxed line-clamp-3 mb-4">{q.content}</p>
              <div className="flex gap-2">
                <span className="text-[0.7rem] bg-[#111] px-2.5 py-1 rounded-md text-[#666]">Opcji: {q.options.length}</span>
                {q.image_url && <span className="text-[0.7rem] bg-[#111] px-2.5 py-1 rounded-md text-primary border border-primary/20">Z grafiką</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;