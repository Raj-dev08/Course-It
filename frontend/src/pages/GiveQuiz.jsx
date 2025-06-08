import { useQuizStore } from "../store/useQuizStore"
import { useParams,useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";


const GiveQuiz = () => {
    const {id}=useParams();
    const {startQuiz,giveQuiz,getQuiz,quiz}=useQuizStore();
    const [answers,setAnswers]=useState([]);
    const [submitted, setSubmitted] = useState(false);
    const navigate=useNavigate(); 
    const [timeLeft, setTimeLeft] = useState();

    useEffect(()=>{
        const init=async()=>{
            const quizdata=await getQuiz(id);
            const servertime=await startQuiz(id);

            console.log(servertime)

            const now=Number(Date.now());

            const endTime = servertime + quizdata?.duration * 60 * 1000;
            const remaining = Math.floor((endTime - now) / 1000);

            setTimeLeft(Math.max(remaining, 0));

            // console.log(timeLeft);
        }
        init()
    },[])

    
    useEffect(() => {
        if (submitted) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(-1);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [submitted]);

    useEffect(() => {
        Fillanswers();
    }, [quiz]);

    const Fillanswers = ()=>{
        if (quiz?.questions?.length) {
            setAnswers(new Array(quiz.questions.length).fill(-1));
        }
    }


    // console.log(quiz)
    // console.log(answers)

    // quiz?.questions?.forEach((q)=>{
    //     console.log(q);
    //     console.log(q.question)
    //     q.options.forEach((o)=>{
    //         console.log(o.index,o.option)
    //     })
    // })

    const handleOptionSelect=(index,optionIndex)=>{
        const newAnswers=[...answers]

        newAnswers[index]=optionIndex+1

        setAnswers(newAnswers)
    }   

    const handleSubmit = async()=>{
        await giveQuiz(id,answers)
        setSubmitted(true);
        
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    return (
         <div className="mt-[80px] mx-auto min-w-screen">
            <h1 className="text-center font-extrabold text-3xl">{quiz.name}</h1>
            <p className="text-center my-4">{quiz.description}</p>
            <div className="text-red-600 font-semibold text-lg">
                Time Left: {formatTime(timeLeft)}
            </div>

            {quiz?.questions?.map((q,index)=>(
                <div key={index} className="bg-primary-content my-3 rounded-lg mx-3 p-10">
                <div className="flex">
                    <span className="font-extrabold text-3xl mr-5 bg-primary p-2 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer">
                        {index+1}
                    </span>
                    <h1 className="font-extrabold text-3xl text-center mb-4">{q.question}</h1>
                </div>
                {q.options.map((o,optionIndex)=>(
                    <label key={optionIndex}
                     className="flex items-center space-x-2 input input-bordered rounded-lg my-3 hover:cursor-pointer"
                     onClick={() => handleOptionSelect(index,optionIndex)}>
                        <input
                            type="radio"
                            name={`question-${index}`}
                            checked={answers[index] === optionIndex+1}
                            onChange={() => handleOptionSelect(index,optionIndex)}
                        />
                        <span className="font-semibold text-lg font-mono">{o.option}</span>
                    </label>
                ))}
                </div>
            ))}
            <div className="flex justify-between">
                <button className="btn btn-primary " onClick={Fillanswers}>
                        RESET
                </button>
                <button className="btn btn-primary " onClick={handleSubmit}>
                        SUBMIT
                </button>
            </div>
         </div>
    )
}

export default GiveQuiz