import { Routes, Route ,Navigate ,useLocation} from "react-router-dom"
import { useEffect } from "react"
import { AnimatePresence } from "framer-motion";

import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore";

import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import CoursePage from "./pages/CoursePage"
import HomePage from "./pages/HomePage"
import NavBar from "./components/NavBar"
import ProfilePage from "./pages/ProfilePage"
import EditPage from "./pages/EditPage"
import CourseView from "./pages/CourseView"
import UserProfile from "./pages/UserProfile"
import { IncomingRequests ,OutgoingRequests} from "./pages/IncomingFriendRequest"
import FriendsPage from "./pages/FriendList"
import MessagePage from "./pages/MessagePage"
import GroupChatPage from "./pages/GroupChatPage"
import QuizPage from "./pages/QuizPage"
import CreateQuizPage from "./pages/CreateQuiz"
import GiveQuiz from "./pages/GiveQuiz"
import MyQuizResults from "./pages/MyQuizResults"
import UserQuiz from "./pages/UserQuiz"
import QuizResults from "./pages/QuizResults"
import CallPage from "./pages/CallPage"
import SettingsPage from "./pages/SettingsPage";


import { Toaster } from "react-hot-toast"
import { Loader } from "lucide-react"


function App() {
  const { authUser, isCheckingAuth ,checkAuth} = useAuthStore();
  const location = useLocation();
  const {theme}=useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div data-theme={theme} className="bg-gradient-to-b from-base-300 to-primary/20 min-h-screen"> 
        <Toaster position="top-right" reverseOrder={false} />
        <NavBar />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
              <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>} />
              <Route path="/create-course" element={<CoursePage />} />
              <Route path="/profile" element={<ProfilePage/>}/>
              <Route path="/edit" element={<EditPage/>}/>
              <Route path="/course/:id" element={authUser?<CourseView/>:<Navigate to="/login"/>}/>
              <Route path="/profile/:id" element={authUser?<UserProfile/>:<Navigate to="/login"/>}/>
              <Route path="/incoming-request" element={authUser?<IncomingRequests/>:<Navigate to="/login"/>}/>
              <Route path="/outgoing-request" element={authUser?<OutgoingRequests/>:<Navigate to="/login"/>}/>
              <Route path="/my-friends" element={authUser?<FriendsPage/>:<Navigate to="/login"/>}/>
              <Route path="/messages" element={authUser?<MessagePage/>:<Navigate to="/login"/>}/>
              <Route path="/chat" element={authUser?<GroupChatPage/>:<Navigate to="/login"/>}/>
              <Route path="/quizes/:id" element={authUser?<QuizPage/>:<Navigate to="/login"/>}/>
              <Route path="/create-quiz/:id" element={authUser?<CreateQuizPage/>:<Navigate to="/login"/>}/>
              <Route path="/quiz/:id" element={authUser?<GiveQuiz/>:<Navigate to="/login"/>}/>
              <Route path="/my-quiz-results" element={authUser?<MyQuizResults/>:<Navigate to="/login"/>}/>
              <Route path="/my-created-quiz" element={authUser?<UserQuiz/>:<Navigate to="/login"/>}/>
              <Route path="/quiz-result/:id" element={authUser?<QuizResults/>:<Navigate to="/login"/>}/>
              <Route path="/call/:id" element={authUser?<CallPage/>:<Navigate to="/login"/>}/>
              <Route path="/settings" element={<SettingsPage/>}/>
              
          </Routes>
          </AnimatePresence>
    </div>
    
  )
}

export default App