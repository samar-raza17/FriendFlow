import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Post from '../Components/Post'
import Rightbar from '../Components/Rightbar'
import ProfileTop from '../Components/ProfileTop'
import Upload from '../Components/Upload'
import PVUploads from '../Components/PVUploads'
import {db} from '../Firebase/firebase'
import { AuthContext } from '../Context/AuthProvider'
import {collection, getDocs, onSnapshot, query, where} from 'firebase/firestore'

const Me = () => {
  const {authObj,isUser} = useContext(AuthContext);
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)




  useEffect(() => {
    if (!authObj?.uid) return;

    setIsLoading(true);
    const q = query(collection(db, 'posts'), where('uid', '==', authObj?.uid));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
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

  const [userData, setUserData] =  useState([]);
  const [userID, setUserID] = useState('')

  const getProfileDetails = async() => {
    const q = query(collection(db, 'users'), where('uid', '==', authObj?.uid))
    const snapShot = await getDocs(q);
    setUserData(snapShot?.docs[0]?.data())
    setUserID(snapShot?.docs[0]?.id)
  }

  useEffect(() => {
    getProfileDetails()
  }, [authObj])
  return (
    <div className='flex pt-[8vh]'>
      <Sidebar/>
      <div className='p-5 xl:w-[60%] w-full overflow-y-auto h-[92vh]'>
      <ProfileTop  photo={userData?.userPhoto} name={userData?.userName} followers={userData?.followers?.length} followings={userData?.following?.length} bio={userData?.bio} userID={userID} />
        {authObj && <Upload/>}
        {isLoading && <div className='loader1 mx-auto my-20'></div>}
        {isError && <h1 className='text-3xl font-bold py-4 text-center text-red-500'>Something went wrong!...</h1>}
       {
       data?.length > 0 ? data?.map((data, index) => {
        const id = data?.id;
        const doc = data?.data;
        return(
          <Post key={index} image={doc?.image} uploadAt={doc?.uploadAt?.seconds} likes={doc?.likes?.length} video={doc?.video} note={doc?.note} uid={doc?.uid} title={doc?.title} docID={id} isLikeBtn={doc?.likes?.includes(authObj?.uid)} AllComments={doc?.comments}/>
        )
       }) : authObj ? <h1 className='text-3xl font-bold py-4 text-center text-blue-500'>No Posts Yet</h1> : <h1 className='text-3xl font-bold py-4 text-center text-blue-500'>Bro Phly Login kro jabhi post dekhna</h1>
       }
      </div>
      <Rightbar/>
      <PVUploads/>
    </div>
  )
}

export default Me