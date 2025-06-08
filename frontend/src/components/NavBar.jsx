import { Link , useLocation} from 'react-router-dom'
import { useAuthStore } from "../store/useAuthStore"
import { useCourseStore } from '../store/useCourse'
import { useState ,useEffect} from 'react'
import { AlignLeft, Search , Bell, Users, House , BadgePlus , User ,UserPlus , MessageCircle  , LogOut ,LogIn ,FileText ,BookA, Settings } from 'lucide-react'
import { useUserStore } from '../store/useUserStore'

const NavBar = () => {
    const { authUser, logout ,checkAuth} = useAuthStore();
    const { changeSearchfilter}=useCourseStore();
    const {friendRequestToUser,getReceivedFriendrequests}=useUserStore();
    const [isOpen, setIsOpen] = useState(false);
    const [text,setText]=useState("");
    const location=useLocation();

    // console.log(location)

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(()=>{
        getReceivedFriendrequests()
    },[])

    const handleFormChange=(e)=>{
        e.preventDefault()
        changeSearchfilter(text)
    }
    


  return (
    <header className="bg-base-100 fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
            <nav className={`sidebar ${isOpen ? 'open' : 'hidden'} shadow-lg`} onClick={()=>setIsOpen(false)}>
                <div className='hover:bg-base-300 p-2 rounded-md'>
                    <Link to="/" className="flex">
                        <House/> 
                        <p className='hidden lg:block mx-2'>Home</p>
                    </Link>
                </div>
                {authUser ? (
                    <>
                        <div className={`hover:bg-base-300 p-2 rounded-md ${location.pathname==="create-course"?'bg-base-300':''}`}>
                            <Link to="/create-course" className='flex text-center'>
                                <BadgePlus/>
                                <p className='hidden lg:block mx-2'>Create Course</p>
                            </Link>
                        </div>
                        <div className={`hover:bg-base-300 p-2 rounded-md ${location.pathname==="/profile"?'bg-base-300':''}`}>
                            <Link to="/profile">
                                <User/>
                                <p className='hidden lg:block mx-2'>Profile</p>
                            </Link>
                        </div>
                        {/* <div className="hover:bg-base-300 p-2 rounded-md">
                            <Link to="/incoming-request">Received FriendRequests</Link>
                        </div> */}

                        <div className={`hover:bg-base-300 p-2 rounded-md ${location.pathname==="/outgoing-request"?'bg-base-300':''}`}>
                            <Link to="/outgoing-request">
                                <UserPlus  />
                                <p className='hidden lg:block mx-2'>Sent FriendRequests</p>
                            </Link>
                        </div>

                        <div className={`hover:bg-base-300 p-2 rounded-md ${location.pathname==="/my-friends"?'bg-base-300':''}`}>
                            <Link to="/my-friends" className='flex'>
                                <Users/>
                                <p className='hidden lg:block mx-2'>My friends</p>
                            </Link>
                        </div>

                        <div className={`hover:bg-base-300 p-2 rounded-md ${location.pathname==="/messages"?'bg-base-300':''}`}>
                            <Link to="/messages"> 
                                <MessageCircle />
                                <p className='hidden lg:block mx-2'>Messages</p>
                            </Link>
                        </div>

                        <div className={`hover:bg-base-300 p-2 rounded-md ${location.pathname==="/my-quiz-results"?'bg-base-300':''}`}>
                            <Link to="/my-quiz-results"> 
                                <FileText />
                                <p className='hidden lg:block mx-2'>My quiz results</p>
                            </Link>
                        </div>

                        <div className={`hover:bg-base-300 p-2 rounded-md ${location.pathname==="/my-created-quiz"?'bg-base-300':''}`}>
                            <Link to="/my-created-quiz"> 
                                <BookA />
                                <p className='hidden lg:block mx-2'>my created quiz</p>
                            </Link>
                        </div>


                        <div onClick={logout} className="p-2 cursor-pointer hover:bg-base-300 rounded-md">
                            <LogOut />
                            <p className='hidden lg:block mx-2'>Log Out</p>
                        </div>
                    </>
                ) : (
                    <>
                         <div className="hover:bg-base-300 p-2 rounded-md">
                            <Link to="/login">
                                <LogIn  />
                                <p className='hidden lg:block mx-2'>Log In</p>
                            </Link>
                        </div>

                        {/* <div className="hover:bg-base-300 p-2 rounded-md">
                            <Link to="/signup">Sign Up</Link>
                        </div> */}
                    </>
                )}
            </nav> 
            <button onClick={toggleMenu} className='w-51'>
                <AlignLeft className="w-6 h-6" />
            </button>

            <form onSubmit={handleFormChange} className='flex'>
                <input
                    type="text"
                    className='input input-bordered focus:outline-none rounded-md w-full'
                    placeholder='search'
                    value={text}
                    onChange={(e)=>{setText(e.target.value)}}
                />
                 <button type="submit" className='mx-2'> 
                    <Search/>
                 </button>
            </form>
            

                <Link to="/" className="text-2xl font-bold hidden lg:block">CourseApp</Link>
                
                <Link to="/settings">
                    <div className='flex '>
                        <Settings/>
                    </div>
                </Link>
                <Link to="/incoming-request">
                    <div className='flex '>
                        <Bell/>
                        <sup className='text-blue-500 font-semibold'>{friendRequestToUser.length}</sup>
                    </div>
                </Link>
        </div>
    </header>
  )
}

export default NavBar