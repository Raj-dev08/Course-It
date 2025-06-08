import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCourseStore = create((set,get) => ({
    courses:[],
    isLoadingCourses: false,
    userCourses: [],
    isLoadingUserCourses: false,
    hasMoreCourses: true,
    isCreatingCourse: false,
    clickedCourse: null,
    searchFilter:"",
    updatingCourse:[],

    setUpdatingCourse:(data)=>{
        set({updatingCourse:data})
    },

    changeSearchfilter:(data)=>{    
        set({searchFilter:data})
        set({courses:[],hasMoreCourses:true})
    },

    getCourses: async (limit,skip)=>{
        set({ isLoadingCourses: true });
        try {
            let res;
            if(get().searchFilter!==""){
                res=await axiosInstance.get(`/courses?limit=${limit}&skip=${skip}&search=${get().searchFilter}`);
            }
            else{
                res=await axiosInstance.get(`/courses?limit=${limit}&skip=${skip}`);
            }
         

            const existingCourses = new Set(get().courses.map(course => course._id));
            const newCourses = res.data.courses.filter(course => !existingCourses.has(course._id));

            set((state) => ({
                courses: [...state.courses, ...newCourses],
                hasMoreCourses: res.data.hasMore,
                isLoadingCourses: false,
            }));
        } catch (error) {
            console.log("error in getting courses", error);
            toast.error(error.response.data.message || "Failed to load courses");
        } 
    },
    createCourse: async (courseData) => {
        set({ isCreatingCourse: true });
        try {
            const res = await axiosInstance.post("/courses/create-course", courseData);

           

            set((state) => ({
                courses: [res.data.newCourse, ...state.courses],
                isCreatingCourse: false,
            }));

            get().changeSearchfilter("")

            toast.success("Course created successfully");
        } catch (error) {
            console.log("error in creating course", error);
            toast.error(error.response.data.message || "Failed to create course"); 
        }
    },

    clickCourse: async (courseId) => {
        set({ isLoadingCourses: true });
        try {
            const res = await axiosInstance.get(`/courses/${courseId}`);
            set({ clickedCourse: res.data.course, isLoadingCourses: false });
        } catch (error) {
            console.log("error in getting course", error);
            toast.error(error.response.data.message || "Failed to load course");
        }
    },

    getUserCourses: async () => {
        set({ isLoadingUserCourses: true });
        try {
            const res = await axiosInstance.get("/courses/profile");
            if(res.data.userCourses.length===0){
                return toast.error("no courses created")
            }
            set({ userCourses: res.data.userCourses, isLoadingUserCourses: false });
        } catch (error) {
            console.log("error in getting user courses", error);
            toast.error(error.response.data.message || "Failed to load user courses");
        }
    },

    joinCourse: async (courseId) => {
        try {
            const res=await axiosInstance.post(`/courses/join/${courseId}`);
            toast.success(res.data.message||"Successfully joined the course");
        } catch (error) {
            console.log("error in joining course", error);
            toast.error(error.response.data.message || "Failed to join course");
        }
    },

    deleteCourse: async (courseId) => {
        try {
            const res=await axiosInstance.delete(`/courses/delete/${courseId}`);

            set((state) => ({
                courses: state.courses.filter(course => course._id !== courseId),
            }));


            
            toast.success(res.data.message||"Course deleted successfully");
        } catch (error) {
            console.log("error in deleting course", error);
            toast.error(error.response.data.message || "Failed to delete course");
        }
    },

    updateCourse: async (courseData) => {
        try {
            const res = await axiosInstance.put(`/courses/update/${courseData._id}`, courseData);
            set((state) => ({
                courses: state.courses.map(course => course._id === courseData._id ? res.data.updatedCourse : course),
            }));
            get().changeSearchfilter("")
            toast.success(res.data.message || "Course updated successfully");
        } catch (error) {
            console.log("error in updating course", error);
            toast.error(error.response.data.message || "Failed to update course");
        }
    }
}));