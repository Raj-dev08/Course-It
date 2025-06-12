import {Loader2} from "lucide-react";
import toast from "react-hot-toast";

const CourseHandler = ({ courseData, setCourseData, createCourse, isCreatingCourse ,mode}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
        createCourse(courseData);
    }

    const validateForm = () => {
        if (!courseData.description.trim()) return toast.error("Description is required");
        if (!courseData.name.trim()) return toast.error("Name is required");
        if (!courseData.timings.trim()) return toast.error("Timings are required");
        if (!courseData.price) return toast.error("Price is required");
        if (isNaN(courseData.price)) return toast.error("Price must be a number");
        if (!courseData.image.trim()) return toast.error("Image URL is required");

        return true;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setCourseData({ ...courseData, image: base64Image });
        };
    };


  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-base-200">
        <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl m-[10%] bg-base-100 rounded-xl shadow-[0_0_10px] shadow-primary/25 overflow-hidden">
            <form onSubmit={handleSubmit} className="w-full  p-4 sm:p-8 flex flex-col ">
                <div className="flex flex-col items-center gap-4 mx-auto lg:max-h-[50%] max-h-[20%] max-w-[50%] my-[5%]">
                    <div className="relative">
                    <img
                        src={courseData.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR7i5iYvIShtm3wLrx_2IpPm0suJAS2Re7YA&s"}
                        alt="Post"
                        className="w-full object-cover border-4 rounded-full border-base-content/20"
                    />     
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isCreatingCourse}
                        />
                    </div>

                    <h1 className="text-3xl font-bold text-center flex">Course Image</h1>
                    <p className="text-sm text-center text-gray-500">Click on the image to upload a new one</p>
                    
                    
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Course Name</span>
                    </label>
                    <input
                        type="text"
                        className={`input input-bordered w-full`}
                        placeholder="Course Name"
                        value={courseData.name}
                        onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                    />
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Course Description</span>
                    </label>
                    <textarea
                        className={`textarea textarea-bordered w-full min-h-24 overflow-auto`}
                        placeholder="Course Description (add detailed description)"
                        value={courseData.description}
                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    />
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Course Timings</span>
                    </label>
                    <input
                        type="text"
                        className={`input input-bordered w-full`}
                        placeholder="Course Timings (eg. 10:00 AM - 11:00 AM, 10may - 16 oct)"
                        value={courseData.timings}
                        onChange={(e) => setCourseData({ ...courseData, timings: e.target.value })}
                    />
                </div>

                <div className="form-control my-4">
                    <label className="label">
                        <span className="label-text font-medium">Course Price</span>
                    </label>
                    <input
                        type="number"
                        className={`input input-bordered w-full`}
                        placeholder="Course Price"
                        value={courseData.price}
                        onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-full my-[5%]" disabled={isCreatingCourse}>
                    {isCreatingCourse ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        mode==="create"?"Create Course":"Update Course"
                    )}
                </button>
            </form>
        </div>
    </div>
  )
}

export default CourseHandler
