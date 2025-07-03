import React, { useContext, useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaUserPlus } from "react-icons/fa6";
import { FaUserMinus,FaFacebookMessenger } from "react-icons/fa";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { AuthContext } from '../Context/AuthProvider';

const ProfileTop = ({photo, name, id, followers, followings, userID, bio}) => {
  

  const {authObj} = useContext(AuthContext);

  const [followBtn, setFollowBtn] = useState(true);

  const [click, setClick] = useState(false)

  const getFollowes = async() => {
    const otherDoc = doc(db, 'users',userID)
    const otherdata = await getDoc(otherDoc)
    const mySnapShot = await getDocs(query(collection(db, 'users'), where('uid', '==', authObj?.uid)))
    const myDoc = doc(db, 'users', mySnapShot?.docs[0]?.id)
    const mydata = await getDoc(myDoc)


    if(otherdata?.data()?.followers?.includes(authObj?.uid) && mydata?.data()?.following?.includes(authObj?.uid)){
      setFollowBtn(false)
    }else{
      setFollowBtn(true)
    }

  }

  useEffect(() => {
    getFollowes()
  }, [authObj, userID,click])

  const navigate = useNavigate()

  console.log(userID);




  return (
   <>
<div className='mb-40 relative w-full h-[300px] rounded-md' style={{
        background: `url(https://placehold.co/600x400/EEE/31343C) no-repeat`,
        backgroundSize: 'cover' ,
        backgroundPosition: 'center'
    }}>
        <div style={{boxShadow: '1px 1px 5px #aaa'}} className="absolute py-4 top-[20%] left-[50%] -translate-x-[50%] flex flex-col items-center bg-gray-100 w-[90%] rounded-lg ">
        <img src={photo} className="w-36 h-36 rounded-full" />
        <h2 className='font-bold text-3xl'>{name}</h2>
        <span className='font-semibold text-blue-500'>{bio}</span>
        <div className='flex flex-wrap gap-x-4'>
          <span>Followers <strong>{followers}</strong></span>
          <span>Following <strong>{followings}</strong></span>
        </div>
        <div className='flex flex-wrap gap-x-4'>
        {
          !id ? <Link className='flex items-center gap-2 font-bold text-white rounded-sm bg-blue-500 px-2 py-1 hover:bg-blue-400 my-2' to={'/up'}><BiEdit/> Edit Profile</Link> : <>{followBtn ? <button onClick={async() => {
            if(followBtn){
              const mySnapShot = await getDocs(query(collection(db, 'users'), where('uid', '==', authObj?.uid)))
              await updateDoc(doc(db, 'users',userID), {
                followers: arrayUnion(authObj?.uid)
              })
              await updateDoc(doc(db, 'users',mySnapShot?.docs[0]?.id), {
                following: arrayUnion(userID)
              })
              setClick(!click)
            }
          }} id={userID} className='flex items-center gap-2 font-bold text-white rounded-sm bg-blue-500 px-2 py-1 hover:bg-blue-400 my-2'><FaUserPlus id={userID}/> Follow</button> : <button onClick={async() => {
            if(!followBtn){
              const mySnapShot = await getDocs(query(collection(db, 'users'), where('uid', '==', authObj?.uid)))
              await updateDoc(doc(db, 'users',userID), {
                followers: arrayRemove(authObj?.uid)
              })
              await updateDoc(doc(db, 'users',mySnapShot?.docs[0]?.id), {
                following: arrayRemove(userID)
              })
              setClick(!click)
            }
          }} id={userID} className='flex items-center gap-2 font-bold text-white rounded-sm bg-gray-500 px-2 py-1 hover:bg-gray-400 my-2'><FaUserMinus id={userID}/> Unfollow</button>}</>
        }
        </div>
        </div>
    </div>

    </>
  )
}

export default ProfileTop