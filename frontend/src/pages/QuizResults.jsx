import { useEffect } from "react";
import { useQuizStore } from "../store/useQuizStore"
import { useParams,Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const QuizResults = () => {
    const {getQuizResults,quizResults,isQuizLoading}=useQuizStore();
    const {id}=useParams();

    useEffect(()=>{
        getQuizResults(id)
    },[id])

    
    if (isQuizLoading) {
        return <Loader2/>;
    }

    if (!quizResults || quizResults.length === 0) {
        return (
            <div className="text-center mt-10 text-lg font-semibold min-h-screen flex justify-center items-center">
                    <div className="bg-primary min-w-[100px] min-h-[100px] flex justify-center items-center p-10 rounded-md border-primary/25 shadow-lg">No results found.</div>
            </div>
        )
    }


    console.log(quizResults)
    return (
          <div className="max-w-3xl mx-auto p-4 mt-[80px]">
            <h2 className="text-4xl font-black mb-4 text-primary text-center underline">Quiz Results</h2>
            <div className="flex justify-between">
                <p className="text-3xl text-primary font-extrabold">Quiz Name:</p>
                <p className="text-3xl text-primary mr-9 font-mono font-extrabold">{quizResults.name}</p>
            </div>
            <div className="text-center text-xl text-primary font-mono font-bold my-5">
                Description : {quizResults.description}
            </div>

            <div className="flex justify-between">
                <p className="text-xl text-primary font-extrabold">Quiz Creator:</p>
                <p className="text-xl text-primary mr-9 font-mono font-extrabold">{quizResults.creator.name}</p>
            </div>

            {quizResults.questions.map((q,index)=>(
                <div key={index+Math.random()} className="textarea input-bordered p-3 my-4">
                    <div className="flex justify-between m-3">
                        <p className="text-2xl text-primary">{index+1}. {q.question}</p>
                        <p className="text-2xl text-primary mr-10">Correct answer : {q.correctAnswer}</p>
                    </div>
                    {q.options.map((o,i)=>(
                        <div key={i} className="my-2">
                            <div className="text-xl text-secondary border border-primary/20 p-2 rounded-md">{i+1}. {o.option}</div>
                        </div>
                           
                    ))}
                </div>
            ))}
            
            {quizResults.students.lenght!==0 && quizResults.students.map((student)=>(
                <div key={student._id} className="bg-base-300 p-4 rounded-md">
                    <div className="flex justify-between">
                        <div className="flex">
                            <img src={student.studentId.profilePic} 
                            className="w-10 h-10 rounded-full"/>
                            <Link to={`/profile/${student.studentId._id}`}>
                                <p className="text-primary text-xl font-mono font-bold mx-3">Name: {student.studentId.name}</p>
                            </Link>
                        </div>
                        <p className="text-primary text-lg font-mono font-bold">Score: {student.score}/{quizResults.questions.length}</p>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default QuizResults