import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Post from '../Components/Post'
import Rightbar from '../Components/Rightbar'
import { AuthContext } from '../Context/AuthProvider'
import {db} from '../Firebase/firebase'
import {collection, getDocs, onSnapshot, query, where} from 'firebase/firestore'
import Skeleton4Post from '../Components/Skeleton4Post'

const Videos = () => {

  const {authObj,isUser} = useContext(AuthContext);
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)


  useEffect(() => {
    if (!authObj?.uid) return;

    setIsLoading(true);
    const q = query(collection(db, 'posts'), where('uid', '!=', authObj?.uid));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
        .filter((post) => post.data.hasOwnProperty('video'));
        setData(newPosts);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching posts: ", error);
        setIsError(true);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();

  }, [authObj?.uid,isUser])
  return (
    <div className='flex pt-[8vh]'>
      <Sidebar/>
      <div className='p-5 xl:w-[60%] w-full overflow-y-auto h-[92vh]'>
      {isLoading && <Skeleton4Post/>}
        {isError && <h1 className='text-3xl font-bold py-4 text-center text-red-500'>Something went wrong!...</h1>}
       {
       data?.length > 0 ? data?.map((data, index) => {
        const id = data?.id;
        const doc = data?.data;
        return(
          <Post key={index} video={doc?.video} uploadAt={doc?.uploadAt?.seconds} likes={doc?.likes?.length} uid={doc?.uid} title={doc?.title} docID={id}isLikeBtn={doc?.likes?.includes(authObj?.uid)} isNavigate={true}/>
        )
       }) : authObj ? <h1 className='text-3xl font-bold py-4 text-center text-blue-500'>No Posts Yet</h1> : <h1 className='text-3xl font-bold py-4 text-center text-blue-500'>Please Login your Account</h1>
       }
      </div>
      <Rightbar/>
    </div>
  )
}

export default Videos