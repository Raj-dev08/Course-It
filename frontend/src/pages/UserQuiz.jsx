import { useEffect } from 'react';
import { useQuizStore } from '../store/useQuizStore';

const UserQuiz = () => {
  const {
    getMyQuizzes,
    userQuizzes,
    isUserQuizzesLoading,
    deleteQuiz,
    stopQuiz,
  } = useQuizStore();

  useEffect(() => {
    getMyQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await deleteQuiz(id);
    }
  };

  const handleStop = async (id) => {
    if (window.confirm('Are you sure you want to stop this quiz?')) {
      await stopQuiz(id);
    }
  };

  if (isUserQuizzesLoading) return <p className="text-center mt-4">Loading quizzes...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto mt-[80px]">
      <h2 className="text-2xl font-semibold mb-4">Your Quizzes</h2>
      {userQuizzes.length === 0 ? (
        <p className="text-primary-content">You haven't created any quizzes yet.</p>
      ) : (
        <ul className="space-y-4">
          {userQuizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="border border-primary/20 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold mb-1">{quiz.name}</h3>
              <p className="text-sm mb-1">
                Status: <span className={quiz.status ? 'text-green-600' : 'text-red-600'}>{quiz.status ? 'Active' : 'Stopped'}</span>
              </p>
              <p className="text-sm mb-1">Duration: {quiz.duration} minutes</p>
              <p className="text-sm mb-3">Description: {quiz.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStop(quiz.id)}
                  className="btn btn-warning"
                >
                  Stop Quiz
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="btn btn-error"
                >
                  Delete Quiz
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserQuiz;