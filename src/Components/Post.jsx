import React, { useContext, useEffect, useState } from 'react'
import { LuMoreVertical } from "react-icons/lu";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { IoShareSocial } from "react-icons/io5";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {db} from '../Firebase/firebase'
import { useQuery } from '@tanstack/react-query';
import { logEvent } from 'firebase/analytics';
import { AuthContext } from '../Context/AuthProvider';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

dayjs.extend(relativeTime);

const Post = ({uid,uploadAt, image, likes, AllComments, video,note, title, docID, isLikeBtn, isNavigate}) => {



  const {authObj} = useContext(AuthContext);
  const [data, setData] = useState([])

  const getPostsDetails = async() => {
     const q = query(collection(db, 'users'), where('uid', '==', uid))
    const snapShot = await getDocs(q) 
    const postAnswer = snapShot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setData(postAnswer)
  }

  useEffect(() => {
    getPostsDetails()
  }, [uid])

  const finalData = data&&data[0]

  const fetchLikes = async(e) => {
    const docRef =  doc(db, 'posts', e?.target?.id)
    const snapShot = await getDoc(docRef)

    if(!snapShot?.data()?.likes.includes(authObj?.uid)){
      await updateDoc(docRef, {
        likes: arrayUnion(authObj?.uid)
      })
    }else{
      await updateDoc(docRef, {
        likes: arrayRemove(authObj?.uid)
      })
    }
  }

  const [commentText, setCommentText] = useState('')

  const [idGetted, setIdGetted] = useState(false);
  const [isComment, setIsComment] = useState(false)
  const [isShare, setIsShare] = useState(false)

  const navigate = useNavigate();
  const [shareLink, setShareLink] = useState(null)
  const [shares, setShares] = useState('')


  window.addEventListener('scroll', () => {
    setIsComment(false)
    setIsShare(false)
  })





  return (
    <div className='border-2 border-gray-200 p-1 rounded-md lg:w-[70%] w-full mx-auto my-4'>
      {/* Comments Bar */}
      <ul className={`z-[25] ${isComment ? 'scale-1' : 'scale-y-0'} origin-center transition-all duration-300 fixed p-1 top-[50%] left-[50%] bg-gray-100 max-w-[500px] w-full -translate-x-[50%] -translate-y-[50%] h-[500px] rounded-md`}style={{boxShadow: '1px 1px 5px #aaa', opacity: '0.9'}}>
        <i onClick={() => {
          setIdGetted(false)
          setIsComment(false)
          setCommentText('')
        }} className="cursor-pointer fa-solid fa-xmark w-7 h-7 flex justify-center items-center rounded-full absolute top1 right-1 bg-red-500 text-white"></i>
        <div className="overflow-y-auto w-full h-[85%] border-2 border-gray-300 p-2">
        {
          AllComments?.length> 0 ?AllComments?.map((cmnt, index) => {
            return(
              <Comment text={cmnt?.text} uid={cmnt?.uid} key={index} />
            )
          }) : <div className='w-full h-full flex justify-center items-center font-semibold text-xl'>No Comments yet on this Post</div>
        }
        </div>
        <div className="w-full h-[15%] flex items-center">
          <textarea value={commentText} onChange={(e) => setCommentText(e?.target?.value)} className='p-2 text-black font-bold border-2 border-black rounded-l-md h-full w-[80%] resize-none'></textarea>
          <i className="fa-solid fa-share w-[20%] h-full flex justify-center items-center bg-gray-900 rounded-r-md text-white text-xl cursor-pointer" onClick={async() => {
            const comntRef = doc(db, 'posts', idGetted);
            await updateDoc(comntRef, {
              comments: arrayUnion({
                uid: authObj?.uid,
                text: commentText.trim(),
              })
            })
            setCommentText('')
          }}></i>
        </div>
      </ul>

      {/* Share Bar */}
      <div className={`z-[25] ${isShare ? 'scale-1' : 'scale-y-0'} origin-center transition-all duration-300 fixed p-1 top-[50%] left-[50%] bg-gray-100 max-w-[500px] w-full -translate-x-[50%] -translate-y-[50%] h-[150px] rounded-md`}style={{boxShadow: '1px 1px 5px #aaa', opacity: '0.9'}}>
      <i onClick={() => {
          setIdGetted(false)
          setIsShare(false)
        }} className="cursor-pointer fa-solid fa-xmark w-7 h-7 rounded-full absolute top1 right-1 bg-red-500 text-white flex justify-center items-center"></i>
        <div className="w-full mt-12 flex items-center gap-1">
          <input onClick={(e) => {
            navigate(`/post/${docID}`)
          }} type="text" className='cursor-pointer text-xs w-[80%] bg-transparent text-blue-500 focus:placeholder:text-blue-500 font-semibold border-2 rounded-l-md border-blue-500 p-2 h-[50px] outline-none ' readOnly  value={shares}/>
          <button onClick={() => {
            navigator.clipboard.writeText(shares)
            .then(() => {
                toast.success("Text copied to clipboard!", {
                  autoClose: 500
                });
            })
            .catch(err => {
                console.log("Kuch galat ho gaya: ", err);
            });
          }} className='rounded-r-md bg-blue-500 text-white font-bold w-[20%] h-[50px] hover:bg-blue-600'>Copy</button>
        </div>
      </div>

        <div className="flex px-2 justify-between items-center border-b-2 border-gray-100 pb-2 mb-2">
        <div onClick={(e) => {
          isNavigate && navigate(`/others/${e?.target?.id}`)
        }} id={uid} className="cursor-pointer flex gap-1 items-center py-2">
        <div className="relative w-8 h-8 rounded-full">
        <img id={uid} src={data && finalData?.data?.userPhoto} className="w-full h-full rounded-full object-cover object-center" />
        {finalData?.data?.isActive && <div className="w-2 h-2 rounded-full bg-green-500 absolute top-0 right-0"></div>}
        </div>
        <span id={uid} className='text-md font-semibold ml-1'>{finalData?.data?.userName}</span>
        <strong id={uid} className='text-xs text-gray-600'>{dayjs.unix(uploadAt).fromNow()}</strong>
        </div>
        </div>
        {title && <p className='text-lg my-2 px-2'>{title}</p>}
       {image &&  <img src={image} className="object-contain mx-auto object-center max-h-[500px]" />}
       {video &&  <video src={video} controls className="object-contain mx-auto object-center max-h-[550px]"></video>}
       {note &&  <h1 style={{wordBreak: 'break-all'}} className="p-4 sm:text-xl text-lg font-semibold">{note}</h1>}
        <div className="mt-2 px-2 flex items-center justify-between">
          <button onClick={fetchLikes} id={docID} className='w-[32%] bg-gray-50 h-[50px] rounded-md hover:bg-gray-100 flex justify-center items-center gap-2 font-semibold sm:text-xl text-md text-blue-500'>{likes} {isLikeBtn ? <AiFillLike id={docID} className='text-2xl' /> : <AiOutlineLike id={docID} className='text-2xl' />}</button>
          <button onClick={(e) => {
            setIdGetted(e?.target?.id)
            setIsComment(!isComment)
          }} id={docID} className='w-[32%] bg-gray-50 h-[50px] rounded-md hover:bg-gray-100 flex justify-center items-center gap-2 font-semibold sm:text-xl text-md text-orange-500'>{AllComments?.length}<GoComment id={docID}  className='text-2xl' /> </button>
          <button onClick={async(e) => {
            setIsShare(!isShare)
            setShares(`https://friendflow.vercel.app/post/${e.target.id}`)
          }} id={docID} className='w-[32%] bg-gray-50 h-[50px] rounded-md hover:bg-gray-100 flex justify-center items-center gap-2 font-semibold sm:text-xl text-md text-gray-700'><IoShareSocial id={docID}  className='text-2xl' /> </button>
        </div>
    </div>
  )
}

export default Post