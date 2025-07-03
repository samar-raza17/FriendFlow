import React, { useContext, useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { FaAlignLeft, FaAngleDown, FaUserFriends } from 'react-icons/fa'
import { LuLogOut } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { toggleContext } from '../Context/ToggleProvider'
import { FaXmark } from 'react-icons/fa6'
import {BarsContext} from '../Context/BarsProvider'
import {collection, doc, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {auth, db} from '../Firebase/firebase'
import {AuthContext} from '../Context/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'

const Navbar = ({children}) => {
  const {isSide,setIsSide} = useContext(BarsContext)
  const {authObj, isUser, setDP,setUploadName} = useContext(AuthContext)
  const {isToggle, setIsToggle} = useContext(toggleContext)
  const [data, setData] = useState([])


  useEffect(() => {
    const GetUserData = () => {
      const q = query(collection(db, 'users'), where('uid', '==', authObj?.uid));
      
      const unsubscribe = onSnapshot(q, (snapShot) => {
        if (!snapShot.empty) {
          const docID = snapShot.docs[0]?.id;
          const docData = snapShot.docs[0]?.data();
          setData({
            docID,
            docData,
          });
        } else {
          setData(null);
        }
      });
      return () => unsubscribe();
    };
  
    if (authObj) {
      GetUserData();
    }
  }, [authObj]);

  useEffect(() => {
    setDP(data?.docData?.userPhoto)
    setUploadName(data?.docData?.userName)
  }, [data])





  return (
    <>
    <div className='z-20 bg-white fixed top-0 left-0 w-full h-[8vh] flex justify-between  items-center px-3 text-blue-500 font-bold' style={{boxShadow: '1px 1px 5px #aaa'}}>
      <Link to={'/'} className='text-3xl'>FriendFlow</Link>
      {
        authObj ? <div onClick={() => setIsToggle(!isToggle)} className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-md cursor-pointer">
        {data?.docData && <img src={data?.docData?.userPhoto} className="w-10 h-10 rounded-full object-cover object-center" />}
        <span className='flex gap-1 items-center'>{data && data?.docData?.userName.split(' ')[0]} <FaAngleDown/></span>
      </div> : <Link to='/form' className='bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600'>Login</Link>
      }

      {/* Toggle */}
      <ul className={`${isToggle ? 'scale-1' : 'scale-y-0'} origin-top transition-all duration-300 w-[200px] p-2 absolute top-[100%] right-1 bg-gray-100`}>
        <li onClick={async(e) => {
          const q =  query(collection(db, 'users'), where('uid', '==', e?.target?.id))
          const snapShot = await getDocs(q)
          if(!snapShot.empty){
            const docID = snapShot?.docs[0]?.id
            signOut(auth).then(async() => {
              await updateDoc(doc(db, 'users', docID), {
                isActive: false,
                lastSeen: serverTimestamp()
              })
              setIsToggle(false)
            })

          }
        }} id={data && data?.docData?.uid} className='bg-gray-50 hover:bg-gray-200 cursor-pointer py-2 px-3 rounded-md mb-2 flex items-center gap-2'><LuLogOut id={data && data?.docID}/> Logout</li>
        <Link to={'/up'} className='bg-gray-50 hover:bg-gray-200 cursor-pointer py-2 px-3 rounded-md my-2 flex items-center gap-2'><BiEdit/> Edit Profile</Link>
      </ul>

    </div>
    <div className="z-10 fixed top-[9vh] left-0 md:hidden w-full p-2 text-blue-500 text-xl flex justify-between md:justify-end">
      <div onClick={() => {
        setIsSide(!isSide)
      }} className="md:hidden flex justify-center items-center cursor-pointer w-8 h-8 rounded-full bg-gray-100">
      {isSide ?<FaXmark/> : <FaAlignLeft/>}
      </div>
    </div>
    {children}
    </>
  )
}

export default Navbar