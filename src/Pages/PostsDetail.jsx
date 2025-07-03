import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Rightbar from '../Components/Rightbar';
import { AuthContext } from '../Context/AuthProvider';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router-dom';
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Comment from '../Components/Comment';
import { toast } from 'react-toastify';
dayjs.extend(relativeTime);


const PostsDetail = () => {
  const { authObj, isUser } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [postData, setPostData] = useState([])

  const {id} = useParams()

  const getPostDetails = () => {
    const docRef = doc(db, 'posts', id);
    const unsubscribe = onSnapshot(docRef, (snapShot) => {
        if (snapShot.exists()) {
            setPostData(snapShot.data());
        } else {
            console.log('No such document!');
            setPostData(null);
        }
    }, (error) => {
        console.error("Error fetching document:", error);
    });
    return unsubscribe;
};

  useEffect(() => {
    getPostDetails();
  }, [authObj])

  const [userData, setUserData] = useState([]);


  const getUserDetails = async() => {
    const q = query(collection(db, 'users'), where('uid', '==', postData?.uid))
    const snapShot = await getDocs(q)
    setUserData(snapShot?.docs[0]?.data())
  }

  useEffect(() => {
    getUserDetails()
  }, [postData])


  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const [cmntText, setCmntText] = useState('')
  const navigate = useNavigate()


  return (
    <div className="flex pt-[8vh] mt-7">
      <Sidebar />
      <div className="p-5 xl:w-[60%] w-full bg-white rounded-lg shadow-lg flex flex-col">
        {/* Post Section */}
        <div className="flex flex-col border-b pb-4 mb-4">
          {/* User Info */}
          <div onClick={(e) => navigate(`/others/${e?.target?.id}`)} id={userData?.uid} className="cursor-pointer flex items-center mb-4">
            <img
            id={userData?.uid}
              src={userData?.userPhoto}
              alt="User Avatar"
              className="rounded-full mr-3 w-10 h-10"
            />
            <div
            id={userData?.uid}>
              <h3 id={userData?.uid} className="font-semibold text-lg">{userData?.userName}</h3>
              <p id={userData?.uid} className="text-gray-500 text-sm">Posted {dayjs.unix(postData?.uploadAt?.seconds).fromNow()}</p>
            </div>
          </div>

          {/* Post Image */}
          {postData?.image && <img
            src={postData?.image}
            alt="Post Image"
            className="w-full object-contain max-h-[400px] rounded-lg mb-4"
          />}
          {postData?.video && <video
            src={postData?.video}
            alt="Post Image"
            className="w-full object-contain max-h-[400px] rounded-lg mb-4"></video>}
          {postData?.note && <h1 style={{wordBreak: 'break-all'}} className="p-4 sm:text-xl text-lg font-semibold">{postData?.note}</h1>}
        </div>

        {/* Interaction Buttons */}
        <div className="flex justify-between mb-2">
        <button onClick={async() => {
           if(!postData?.likes?.includes(authObj?.uid)){
            await updateDoc(doc(db, 'posts', id), {
              likes: arrayUnion(authObj?.uid)
            })
          }else{
            await updateDoc(doc(db, 'posts', id), {
              likes: arrayRemove(authObj?.uid)
            })
          }
        }} id={id} className='w-[32%] bg-gray-50 h-[50px] rounded-md hover:bg-gray-100 flex justify-center items-center gap-2 font-semibold sm:text-xl text-md text-blue-500'>{postData?.likes?.length} {postData?.likes?.includes(authObj?.uid) ? <AiFillLike id={id} className='text-2xl' /> : <AiOutlineLike id={id} className='text-2xl' />}</button>
          <button onClick={(e) => {
            toggleComments()
          }} id={'docID'} className='w-[32%] bg-gray-50 h-[50px] rounded-md hover:bg-gray-100 flex justify-center items-center gap-2 font-semibold sm:text-xl text-md text-orange-500'>{postData?.comments?.length}<GoComment id={'docID'}  className='text-2xl' /> </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="comments-section border-t border-gray-200 pt-2">
          {
            postData?.comments?.map((cmnt, index) => {
              return(
                <Comment text={cmnt?.text} uid={cmnt?.uid} key={index}/>
              )
            })
          }
            {/* Additional comments can be added here */}
          </div>
        )}

        {/* Input for New Comment */}
        <div className="flex gap-1 mt-4">
          <input
          value={cmntText}
          onChange={(e) => setCmntText(e?.target?.value)}
            type="text"
            placeholder="Write a comment..."
            className="w-full border rounded-md p-2 focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out"
          />
          <button onClick={async() => {
            if(authObj){
              await updateDoc(doc(db, 'posts', id), {
                comments: arrayUnion({
                  text: cmntText?.trim(),
                  uid: authObj?.uid
                })
              })
              setCmntText('')
            }else{
              toast.error('Login your Account', {
                autoClose: 500
              })
            }
          }} className='bg-blue-500 rounded-md text-white px-2 py-1'>Send</button>
        </div>
      </div>
      <Rightbar />
    </div>
  );
};

export default PostsDetail;
