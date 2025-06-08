import { useState,useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCourseStore } from "../store/useCourse";
import { Camera, Mail , Loader2 ,Eye,Trash2,Pen} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Card from "../components/Card";


const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile , beAdmin, cancelAdmin,updateBalance} = useAuthStore();
  const {getUserCourses,userCourses,deleteCourse,setUpdatingCourse} = useCourseStore()
  const inputRef=useRef()

  const [accountInfo, setAccountInfo] = useState({
    profilePic: authUser?.image,
    description: authUser?.description,
    name: authUser?.name,
  });

  useEffect(()=>{
    getUserCourses();
  },[userCourses])

  const [adminPass,setAdminPass] = useState("");
  const [balance,setBalance]=useState("");

  const handleAdminPass=async(e)=>{
    e.preventDefault();
    if(!adminPass.trim())return toast.error("Admin password cannot be empty");
    beAdmin(adminPass);
    setAdminPass("");
  }

  const updateBalanceForm=async(e)=>{
    e.preventDefault();
    if(isNaN(balance)||balance<0||balance>100000000)return toast.error("invalid amount");
    updateBalance(balance);
    setBalance("")
  }

  const AdminCancel=async () => {
    cancelAdmin();
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setAccountInfo((prev) => ({ ...prev, profilePic: base64Image }));
    };
  };

  const handleDataChange=async(e)=>{
    e.preventDefault();

 
    if(!accountInfo.name.trim())return toast.error("Name cannot be empty");
    if(!accountInfo.description.trim())return toast.error("Description cannot be empty");


    await updateProfile(accountInfo);
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={accountInfo.profilePic || authUser?.profilePic }
                alt="Profile"
                className="size-64 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

         

            <div className="space-y-1.5">
              <div className="text-lg font-bold text-primary-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address  : {authUser.email}
              </div>
            </div>

            <div className="space-y-6">
           

            <form onSubmit={handleDataChange}>

            <div className="space-y-1.5 my-5">
              <div className="text-lg font-bold text-primary-400 text-center  gap-2 min-w-full my-2">   
                    Full Name
              </div>
              <input
              type="text"
              className={`input input-bordered w-full pl-10 focus:outline-none rounded-md font-semibold text-md`}
              placeholder="Your name"
              value={accountInfo.name}
              onChange={(e) => setAccountInfo((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5 my-5">
              <div className="text-lg font-bold text-primary-400  text-center gap-2 min-w-full my-2">
                Description
              </div>
              <input
              type="text"
              className={`input input-bordered w-full pl-10 focus:outline-none rounded-md font-semibold text-md`}
              placeholder="about you"
              value={accountInfo.description}
              onChange={(e) => setAccountInfo((prev) => ({ ...prev, description: e.target.value }))}
            />
            </div>

            <button type="submit" className="btn bg-green-500 hover:bg-green-800 w-full mt-10 transition duration-450 ease-in-out" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "UPDATE"
              )}
            </button>

            </form>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Account balance</span>
                <span>{authUser.balance}</span>
              </div>


              <form onSubmit={updateBalanceForm}>

                <div className="space-y-1.5 my-5">
                    <div className="text-sm text-primary-400 flex items-center gap-2">
                      <Eye  className="w-4 h-4" />
                      update balance
                    </div>
                    <input
                      type="number"
                      className={`input input-bordered w-full pl-10 focus:outline-none`}
                      placeholder="enter amount"
                      value={balance}
                      onChange={(e) => setBalance(Number(e.target.value))}
                    />
                </div>

                <button type="submit" className="btn bg-green-500 hover:bg-green-800 w-full mt-10 transition duration-450 ease-in-out">
                  update
                </button>

              </form>

              <div className="flex items-center justify-between py-6">
              <span>Account Status:(click to toggle)</span>
                {authUser.isAdmin? (
                  <button className="text-green-500 btn" onClick={AdminCancel}>Admin</button>
                ):(
                    <span className="text-green-500" onClick={()=>inputRef.current.focus()}>User</span>
                )}
              </div>


              <form onSubmit={handleAdminPass}>
                <div className="space-y-1.5 my-5">
                  <div className="text-sm text-primary-400 flex items-center gap-2">
                    <Eye  className="w-4 h-4" />
                    admin password
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 focus:outline-none`}
                    placeholder="admin password"
                    value={adminPass}
                    ref={inputRef}
                    onChange={(e) => setAdminPass(e.target.value)}
                  />
              </div>
              <button type="submit" className="btn bg-green-500 hover:bg-green-800 w-full mt-10 transition duration-450 ease-in-out">
                submit
              </button>
             </form>

              
            </div>
          </div>
          </div>
      </div>

    
          <div className="mt-6 bg-base-200 rounded-xl p-6 min-w-screen">
            <h2 className="text-lg font-bold  mb-4 flex justify-center">YOUR COURSES</h2>
            <div className="space-y-3 text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCourses.length > 0 ? (
                userCourses.map((course) => (
                    <div className="flex flex-col" key={course._id}>
                        <Card course={course}/>

                        <span className="p-2 flex justify-between items-center">
                        <button className="btn-primary w-90 rounded-md p-4 flex text-white font-semibold bg-red-500
                        hover:bg-red-800 transition duration-300 ease-in-out" 
                        onClick={()=>deleteCourse(course._id)}>
                            <Trash2  className="mr-3"></Trash2 > delete
                        </button>
                        
                        <Link to={"/edit"}>
                            <button className="btn-primary w-90 rounded-md p-4 flex text-white font-semibold bg-yellow-500
                            hover:bg-yellow-600 transition duration-300 ease-in-out"
                            onClick={()=>setUpdatingCourse(course)}>
                            <Pen   className="mr-3"></Pen  > edit
                            </button>
                        </Link>
                        </span> 
                    </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No products found</p>
              )}
            </div>
          </div>
        
    </div>
  );
};
export default ProfilePage;