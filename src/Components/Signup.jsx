import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {auth, db, googleSignIn} from '../Firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = ({setLogin, login}) => {
  const [isLoad, setIsLoad] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const onSubmit = ({userName, email, password}) => {
    setIsLoad(true)
    createUserWithEmailAndPassword(auth, email, password)
  .then(async(userCredential) => {
    // Signed up
    const user = userCredential.user;
    console.log(user);
    try{
      await addDoc(collection(db, 'users'), {
        userName: userName.trim(),
        userPhoto: 'https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png',
        isActive: false,
        followers: [],
        following: [],
        createAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        userEmail: email,
        bgImage: 'https://placehold.co/600x400/EEE/31343C',
        uid: user?.uid
      })
      setIsLoad(!true)
      reset()
      setLogin(true)
    }catch(err){
      console.log(err);
      setIsLoad(!true)
      toast.error(err?.message, {
        autoClose: 500
      })
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage, {
      autoClose: 500
    })
    setIsLoad(!true)
    // ..
  });
  }
  return (
    <>
    <div className="w-full min-h-screen flex justify-center items-center">
        <div className="relative max-w-[500px] w-full p-6 rounded-md flex flex-col items-center gap-4" style={{boxShadow: '1px 1px 5px #aaa'}}>
          {isLoad&&<div className="loader2" style={{color: '#3b82f6 '}}></div>}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-3 w-full">
          <h1 className='text-4xl font-bold text-blue-500'>SIGNUP</h1>
            <div className="w-full">
            <input {...register("userName", {
          required: "This field is required",
          minLength: { value: 3, message: "Minimum length is 3" },
          maxLength: { value: 20, message: "Maximum length is 20" }
        })} type="text" className='text-lg w-full bg-transparent text-blue-500 focus:placeholder:text-blue-500 font-semibold border-2 focus:border-blue-500 p-2 h-[50px] outline-none' placeholder='Enter your Name' />
            {errors.userName && <span className='text-xs font-bold text-red-500'>{errors.userName.message}</span>}
            </div>
            <div className="w-full">
            <input {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address"
          }
        })} type="email" className='text-lg w-full bg-transparent text-blue-500 focus:placeholder:text-blue-500 font-semibold border-2 focus:border-blue-500 p-2 h-[50px] outline-none' placeholder='example@gmail.com' />
            {errors.email && <span className='text-xs font-bold text-red-500'>{errors.email.message}</span>}
            </div>
            <div className="w-full">
            <input {...register("password", {
          required: "This field is required",
          minLength: { value: 8, message: "Minimum length is 8" }
        })} type="password" className='text-lg w-full bg-transparent text-blue-500 focus:placeholder:text-blue-500 font-semibold border-2 focus:border-blue-500 p-2 h-[50px] outline-none' placeholder='********' />
            {errors.password && <span className='text-xs font-bold text-red-500'>{errors.password.message}</span>}
            </div>
            <button disabled={isLoad} className={`${isLoad && 'cursor-not-allowed'} flex justify-center items-center font-semibold text-xl w-full h-[50px] bg-blue-500 rounded-md hover:bg-blue-600 text-white`}>Submit</button>
          </form>
            <p>Already have an <strong onClick={() => setLogin(!login)} className='text-blue-500 cursor-pointer'>Account?</strong></p>
            <button disabled={isLoad} onClick={() => {
              googleSignIn(navigate)
            }} className={`${isLoad && 'cursor-not-allowed'} flex justify-center items-center font-semibold text-xl w-full h-[50px] bg-transparent rounded-md hover:bg-gray-100 text-blue-500 border-2 border-blue-500 gap-2`}><img src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-64.png" width="20" />Continue with Google</button>
        </div>
    </div>
    </>

  )
}

export default Signup