import { useRef,useEffect,useState } from "react"
import { useCourseStore } from "../store/useCourse"
import Masonry from 'react-masonry-css'
import Card from "../components/Card"



const HomePage = () => {
    const { getCourses, courses, isLoadingCourses ,hasMoreCourses,searchFilter} = useCourseStore();
    const [page, setPage] = useState(1);
    const limit = 2;
    const skip=courses?.length;
    const observerRef = useRef(null);

    
    useEffect(() => {
        getCourses(limit,skip);
    }, [page]);

    useEffect(()=>{
      setPage(1);
    },[searchFilter])


     useEffect(() => {
    if (!hasMoreCourses || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingCourses && hasMoreCourses) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.2 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMoreCourses, isLoadingCourses,courses]);

  const breakpointColumnsObj = {
    default: 3,
    768: 2,
    480: 1,
  }


  return (
     <div className="min-h-screen pt-16 container mx-auto p-4 flex flex-col ">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >

        {courses.map((course) => (
            <Card key={course._id} course={course}/> 
  
        ))}
        
      </Masonry>
      {isLoadingCourses && <p className="text-center mt-4">Loading...</p>}
      {!hasMoreCourses && <p className="text-center mt-4">No more courses to load.</p>}
      <div ref={observerRef} className="h-10"></div>
    </div>
  )
}

export default HomePage