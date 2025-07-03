import React, { useContext, useState } from 'react'
import { BiImage } from 'react-icons/bi'
import { MdOndemandVideo } from 'react-icons/md'
import {UploaderContext} from '../Context/UploaderProvider'
import {AuthContext} from '../Context/AuthProvider'
import { addDoc, collection, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../Firebase/firebase'
import { toast } from 'react-toastify'

const Upload = () => {
  const {setIsImage, setIsVideo} = useContext(UploaderContext);
  const {authObj, DP, uploadName} = useContext(AuthContext);
  const [text, setText] = useState('')
  const [isLoad, setIsLoad] = useState(false)


  return (
    <form onSubmit={async(e) => {
      setIsLoad(true)
      e.preventDefault()
      try{
        await addDoc(collection(db, 'posts'), {
          uploadAt: serverTimestamp(),
          uid: authObj?.uid,
          likes: [],
          comments: [],
          note: text
        })
        setIsLoad(false)
        setText('')
      }catch(err){
        console.log(err);
        setIsLoad(false)
        toast.error(err, {
          autoClose: 500
        })
      }
    }} className='relative flex flex-col gap-4 py-5 px-2 lg:w-[80%] w-full mx-auto rounded-md' style={{boxShadow: '1px 1px 5px #aaa'}}>
      {isLoad && <div className='loader2' style={{
        color: "#3b82f6 "
      }}></div>}
        <div className="flex items-start gap-3">
            <img src={DP} className="w-9 h-9 rounded-full object-cover object-center" />
            <textarea required minLength={10} maxLength={200} value={text} onChange={(e) => setText(e?.target?.value)} className="w-full p-1 outline-none border-none bg-transparent resize-none" placeholder={`Whats in your Mind ${uploadName}?`}></textarea>
        </div>
        <div className="flex items-center justify-between">
            <span onClick={() => setIsVideo(true)} className='cursor-pointer hover:bg-gray-100 w-[49%] flex gap-2 items-center font-semibold text-md bg-gray-50 rounded-md h-[50px] justify-center'><MdOndemandVideo className='text-xl text-blue-500'/> Upload Video</span>
            <span onClick={() => setIsImage(true)} className='cursor-pointer hover:bg-gray-100 w-[49%] flex gap-2 items-center font-semibold text-md bg-gray-50 rounded-md h-[50px] justify-center'><BiImage className='text-xl text-orange-500'/> Upload Image</span>
        </div>
        <button disabled={isLoad} className='h-[50px] bg-green-500 text-white font-semibold text-xl w-full rounded-md hover:bg-green-600'>Post</button>
    </form>
  )
}

export default Upload