import { useQuizStore } from "../store/useQuizStore"
import { useEffect } from "react"

const MyQuizResults = () => {
    const {getMyQuizResults,userQuizResults}=useQuizStore();

    useEffect(()=>{
        getMyQuizResults();
    },[])

    return (
        <div className="mt-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Quiz Results</h1>

            {userQuizResults.length === 0 ? (
                <p className="font-black font-mono text-lg">No quiz results found for user</p>
            ) : (
                <div className="grid gap-4">
                {userQuizResults.map((quiz, index) => (
                    <div
                    key={quiz._id || index}
                    className="p-4 bg-base rounded-2xl shadow-md border border-primary/20 hover:shadow-lg transition"
                    >
                    <div className="flex justify-between">                    
                        <img src={quiz.course.image}
                        className="w-20 h-20 rounded-full"
                        />
                        <h1 className="text-3xl text-primary font-black underline">{quiz.course.name}</h1>
                    </div>

                    <h2 className="text-xl font-semibold text-blue-700 text-center underline">
                        {quiz.name || `Quiz ${index + 1}`}
                    </h2>
                    <div className="flex justify-between">
                        <p className="text-base-content mt-2">
                            Score: <span className="font-medium">{quiz.score} / {quiz.totalQuestions}</span>
                        </p>
                        <p className={`text-sm mt-1 ${(((quiz.score / quiz.totalQuestions)*100)>34)? 'text-success':'text-error'}`}>
                            Accuracy: <span className="font-medium">{((quiz.score / quiz.totalQuestions)*100).toFixed(2)}%</span>
                        </p>
                    </div>
                    </div>
                ))}
                </div>
                 )}
        </div>
    )
}

export default MyQuizResults