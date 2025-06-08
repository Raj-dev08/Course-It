import { useEffect } from "react";
import { useQuizStore } from "../store/useQuizStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate ,useParams} from "react-router-dom";
import { Loader2 ,Trash2 ,Navigation ,Ban } from "lucide-react";
import toast from "react-hot-toast";

const QuizPage = () => {
  const {id}=useParams();
  const navigate = useNavigate();
  const { courseQuiz, getQuizFromCourse, isQuizLoading,setResultFilter ,deleteQuiz ,stopQuiz} = useQuizStore();
  const {authUser}=useAuthStore();

  useEffect(() => {
    getQuizFromCourse(id);
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

  const handleQuizView=(status,id)=>{
    if(status==="Active")return toast.error("quiz still running")

    navigate(`/quiz-result/${id}`)
  }

  return (
    <div className="p-4 relative min-h-screen mt-[80px]">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">All Quizzes</h2>
        <Link to="/my-quiz-results" onClick={()=>setResultFilter(id)}>
          <h2 className="text-2xl font-bold mb-4 hover:text-blue-500 hover:underline">Quiz Results</h2>
        </Link>
      </div>
      {isQuizLoading ? (
        <Loader2/>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {courseQuiz?.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-base-content backdrop-blur-9xl shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition max-w-[300px] text-center"
           
            >
              <u className="text-4xl font-bold text-base-300" onClick={()=>handleQuizView(quiz.status,quiz.id)}>{quiz.name}</u>
              <h3 className="text-md  mt-1 font-semibold text-base-300 ">{quiz.description}</h3>
              <p className="text-md mt-1 font-semibold text-base-300">Time: {quiz.duration} min</p>
              <p className="text-md mt-1 font-semibold text-base-300">Status: {quiz.status}</p>
              <div className="flex justify-between my-2">
                {authUser.isAdmin && (
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="btn btn-error  text-2xl"
                  >
                    <Trash2/>
                  </button>
                  
                )}

                {authUser.isAdmin && (
                  <button
                    onClick={() => handleStop(quiz.id)}
                    className="btn btn-warning  text-2xl"
                  >
                    <Ban/>
                  </button>
                  
                )}

                <button  className="btn btn-primary  text-2xl"
                  onClick={() => navigate(`/quiz/${quiz.id}`)} >
                  <Navigation/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {authUser.isAdmin && (
        <button
          onClick={() => navigate(`/create-quiz/${id}`)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn btn-secondary transition flex items-center justify-center text-2xl"
        >
          +
        </button>
      )}
    </div>
  );
};

export default QuizPage;
