import photoData from '../data/annotations';
import { useNavigate } from 'react-router-dom';

function InterviewPage() {
  const navigate = useNavigate();
  const { interview, photo } = photoData;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview</h1>
        <p className="text-gray-600">Conversation with Curtis Quam about the annotation process</p>
      </div>

      <div className="space-y-8">
        {interview.questions.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              {item.question}
            </h2>
            
            {Array.isArray(item.answers) ? (
              item.answers.map((answer, answerIndex) => (
                <p key={answerIndex} className="text-gray-700 mb-4">
                  {answer}
                </p>
              ))
            ) : (
              <p className="text-gray-700">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
      
      {/* Home button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center shadow-lg transition-colors z-[9999]"
        aria-label="Return to Home Page"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="w-7 h-7 text-gray-800"
        >
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      </button>
    </div>
  );
}

export default InterviewPage;
