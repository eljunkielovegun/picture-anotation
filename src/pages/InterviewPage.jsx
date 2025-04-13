import photoData from '../data/annotations';

function InterviewPage() {
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
    </div>
  );
}

export default InterviewPage;
