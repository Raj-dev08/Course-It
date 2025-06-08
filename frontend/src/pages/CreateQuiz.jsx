import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuizStore } from "../store/useQuizStore";

const CreateQuizPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { createQuiz, isCreatingQuiz } = useQuizStore();

  const [quizData, setQuizData] = useState({
    name: "",
    description: "",
    duration: 0,
    questions: [
      {
        question: "",
        correctAnswer: 1,
        options: [
          { option: "", index: 1 },
          { option: "", index: 2 },
          { option: "", index: 3 },
          { option: "", index: 4 },
        ],
      },
    ],
  });

  const handleChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[oIndex].option = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question: "",
          correctAnswer: 1,
          options: [
            { option: "", index: 0 },
            { option: "", index: 1 },
            { option: "", index: 2 },
            { option: "", index: 3 },
          ],
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createQuiz(courseId, quizData);
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-[80px]">
      <h2 className="text-2xl font-bold text-center mb-10">Create Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={quizData.name}
          onChange={handleChange}
          placeholder="Quiz Name"
          className="input input-bordered w-full rounded-lg"
          required
        />
        <textarea
          name="description"
          value={quizData.description}
          onChange={handleChange}
          placeholder="Quiz Description"
          className="input input-bordered w-full rounded-lg px-3 pt-1"
          required
        />
        <div className="flex">
        <p className="font-semibold font-mono">Duration (minutes) </p>
        <input
          type="number"
          name="duration"
          value={quizData.duration}
          onChange={handleChange}
          placeholder="Duration (minutes)"
          className="input input-bordered w-full rounded-lg p-3 text-center"
          required
        />
        </div>

        {quizData.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-base-300 p-4 rounded space-y-2">
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
              placeholder={`Question ${qIndex + 1}`}
              className="input input-bordered w-full rounded-lg"
              required
            />
            <div className="flex"> 
            <p className="font-semibold font-mono">Correct Answer</p>
            <input
              type="number"
              value={q.correctAnswer}
              min={1}
              max={4}
              onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", parseInt(e.target.value))}
              className="input input-bordered w-full rounded-lg"
              placeholder="Correct Answer Index (0-3)"
              required
            />
            </div>
            {q.options.map((o, oIndex) => (
              <input
                key={oIndex}
                type="text"
                value={o.option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                placeholder={`Option ${oIndex + 1}`}
                className="input input-bordered w-full rounded-lg"
                required
              />
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="btn bg-blue-600 hover:bg-blue-800 m-3 px-4 py-2 rounded"
        >
          Add Question
        </button>

        <button
          type="submit"
          disabled={isCreatingQuiz}
          className="btn bg-green-600 hover:bg-green-800 px-6 py-2 rounded disabled:opacity-50"
        >
          {isCreatingQuiz ? "Creating..." : "Create Quiz"}
        </button>
      </form>
    </div>
  );
};

export default CreateQuizPage;
