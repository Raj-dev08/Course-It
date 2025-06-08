import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useQuizStore = create((set,get) => ({
    quiz:[],
    isQuizLoading: false,
    isCreatingQuiz: false,
    userQuizzes: [],
    isUserQuizzesLoading: false,
    userQuizResults: [],
    isUserQuizResultsLoading: false,
    isGivingQuiz: false,
    quizResults: [],
    score: null,
    courseQuiz:[],
    resultFilter:null,

    setResultFilter:(data)=>{
        set({resultFilter:data});
    },

    

    getQuizFromCourse: async (id) => {
         set({ isQuizLoading: true });
        try {
            const res = await axiosInstance.get(`/quiz/course-quiz/${id}`);
            // console.log(res)
            set({ courseQuiz: res.data.quiz, isQuizLoading: false });
        } catch (error) {
            console.log("Error fetching quiz:", error);
            toast.error(error.response.data.message || "Failed to load quiz");
            set({ isQuizLoading: false });
        }
    },

    getQuiz: async (id) => {
        set({ isQuizLoading: true });
        try {
            const res = await axiosInstance.get(`/quiz/quiz/${id}`);
            set({ quiz: res.data.quiz, isQuizLoading: false });
            return res.data.quiz
        } catch (error) {
            console.log("Error fetching quiz:", error);
            toast.error(error.response.data.message || "Failed to load quiz");
            set({ isQuizLoading: false });
        }
    },

    createQuiz: async (id, quizData) => {
        set({ isCreatingQuiz: true });
        try {
            const res = await axiosInstance.post(`/quiz/create-quiz/${id}`, quizData);
            set({ isCreatingQuiz: false });
            toast.success(res.data.message||"Quiz created successfully");
        } catch (error) {
            console.log("Error creating quiz:", error);
            toast.error(error.response.data.message || "Failed to create quiz");
            set({ isCreatingQuiz: false });
        }
    },

    startQuiz: async (id) => {
        try {
            const res=await axiosInstance.post(`/quiz/start-quiz/${id}`);
            toast.success(res.data.message||"Quiz started successfully");
            // console.log(res.data)
            return res.data.startTime;
        } catch (error) {
            console.log("Error starting quiz:", error);
            toast.error(error.response.data.message || "Failed to start quiz");
        }
    },

    giveQuiz: async (id, answers) => {
        set({ isGivingQuiz: true });
        try {
            const res = await axiosInstance.post(`/quiz/give-quiz/${id}`, answers);
            set({ score: res.data.score, isGivingQuiz: false });
            toast.success(res.data.message || "Quiz submitted successfully");
        } catch (error) {
            console.log("Error submitting quiz:", error);
            toast.error(error.response.data.message || "Failed to submit quiz");
            set({ isGivingQuiz: false });
        }
    },

    getMyQuizzes: async () => {
        set({ isUserQuizzesLoading: true });
        try {
            const res = await axiosInstance.get("/quiz/my-quizzes");
            set({ userQuizzes: res.data.quizzes, isUserQuizzesLoading: false });
        } catch (error) {
            console.log("Error fetching user quizzes:", error);
            toast.error(error.response.data.message || "Failed to load quizzes");
            set({ isUserQuizzesLoading: false });
        }
    },

    getMyQuizResults: async () => {
        set({ isUserQuizResultsLoading: true });
        try {
            const result=get().resultFilter;
            let res;
            if(result){
                res = await axiosInstance.get(`/quiz/my-quiz-results?courseId=${result}`);
                set({resultFilter:null})
            }else{
                res = await axiosInstance.get("/quiz/my-quiz-results");
            }

            
            set({ userQuizResults: res.data.quizzes, isUserQuizResultsLoading: false });
        } catch (error) {
            console.log("Error fetching user quiz results:", error);
            toast.error(error.response.data.message || "Failed to load quiz results");
            set({ isUserQuizResultsLoading: false });
        }
    },

    getQuizResults: async (id) => {
        set({ isQuizLoading: true });
        try {
            const res = await axiosInstance.get(`/quiz/show-results/${id}`);
            set({ quizResults: res.data.quiz, 
                isQuizLoading: false ,
            });
        } catch (error) {
            console.log("Error fetching quiz results:", error);
            toast.error(error.response.data.message || "Failed to load quiz results");
            set({ isQuizLoading: false });
        }
    }, 

    deleteQuiz: async (id) => {
        try {
            const res = await axiosInstance.delete(`/quiz/delete/${id}`);
            set((state) => ({
                userQuizzes: state.userQuizzes.filter(quiz => quiz.id !== id),
                courseQuiz:state.courseQuiz.filter(quiz=>quiz.id !== id)
            }));
            toast.success(res.data.message || "Quiz deleted successfully");
        } catch (error) {
            console.log("Error deleting quiz:", error);
            toast.error(error.response.data.message || "Failed to delete quiz");
        }
    },

    stopQuiz: async (id) => {
        try {
            const res = await axiosInstance.put(`/quiz/stop/${id}`);
            toast.success(res.data.message || "Quiz stopped successfully");
        } catch (error) {
            console.log("Error stopping quiz:", error);
            toast.error(error.response.data.message || "Failed to stop quiz");
        }
    },

}))