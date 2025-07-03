import React, { useEffect, useState } from 'react'
import {collection, getDocs} from 'firebase/firestore'
import {db} from '../Firebase/firebase'


const Comment = ({text, uid}) => {

  const [cmnterObj, setCmnterObj] = useState(null)

  const getCommenters = async() => {
    const snapShot = await getDocs(collection(db, 'users'))
    snapShot.forEach(doc => {
      if(doc?.data()?.uid  == uid){
        setCmnterObj({photo:doc?.data()?.userPhoto, name:doc?.data()?.userName})
      }
      
    })
  }
  useEffect(() => {
    getCommenters()
  }, [])

  return (
    <li className='border-b-2 border-gray-300 w-full flex items-center px-4 py-2 justify-between'>
  <div className="flex items-center flex-col w-[10%] border-r-2 border-gray-300 pr-3">
    <img
      src={cmnterObj?.photo}
      alt={''}
      className="min-w-8 min-h-8 rounded-full object-cover border border-gray-500"
    />
    <span className='font-bold text-xs text-gray-700 mt-1'>{cmnterObj?.name.split(' ')[0]}</span>
  </div>
  <p className="text-black font-semibold relative w-[85%] leading-relaxed pb-2">
    {text}
  </p>
</li>

  )
}

export default Comment