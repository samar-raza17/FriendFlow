import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Post from '../Components/Post'
import Rightbar from '../Components/Rightbar'
import ProfileTop from '../Components/ProfileTop'
import Upload from '../Components/Upload'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../Firebase/firebase'
import { AuthContext } from '../Context/AuthProvider'

const Others = () => {
  const {id} = useParams()
  const [userID, setUserID] =  useState(null);
  const [userData, setUserData] =  useState([]);

  const {authObj} = useContext(AuthContext)

  const getProfileDetails = () => {
    const q = query(collection(db, 'users'), where('uid', '==', id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setUserID(doc?.id);
        setUserData(doc?.data());
      }
    });
    return () => unsubscribe();
  }

  useEffect(() => {
    const unsubscribe = getProfileDetails();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  const [posts, setPosts] = useState([])

  const getPostThisUser = () => {
    if (!userData || !userData.uid) {
      console.error("User data is not available or UID is null");
      return;
    }


    const q = query(collection(db, 'posts'), where('uid', '==', id))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
    }, (error) => {
      console.error("Error fetching posts: ", error);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getPostThisUser();
    return () => unsubscribe && unsubscribe();
  }, [userData]);

  return (
    <div className='flex pt-[8vh]'>
      <Sidebar/>
      <div className='p-5 xl:w-[60%] w-full overflow-y-auto h-[92vh]'>
        <ProfileTop  photo={userData?.userPhoto} name={userData?.userName} id={id} followers={userData?.followers?.length} followings={userData?.following?.length} userID={userID} />
                {
                  posts?.length > 0 && posts?.map((data, index) => {

                    return(
                      <Post key={index} image={data?.image} uploadAt={data?.uploadAt?.seconds} likes={data?.likes?.length} video={data?.video} note={data?.note} uid={data?.uid} title={data?.title} docID={data?.id} isLikeBtn={data?.likes?.includes(authObj?.uid)} AllComments={data?.comments}/>
                    )
                  })
                }
                 
      </div>
      <Rightbar/>
    </div>
  )
}

export default Others