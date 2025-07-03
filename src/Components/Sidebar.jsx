import React, { useContext } from 'react'
import { BiHome, BiImage } from 'react-icons/bi'
import { MdOndemandVideo } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { NavLink } from 'react-router-dom';
import {BarsContext} from '../Context/BarsProvider'
import { FaFacebookMessenger, FaRegUserCircle } from 'react-icons/fa';
import {auth} from '../Firebase/firebase'
import { AuthContext } from '../Context/AuthProvider';

const Sidebar = () => {
  const {isSide} = useContext(BarsContext)
  const {authObj} = useContext(AuthContext)
  return (
    <div className={`z-10 bg-white border-r-2 border-gray-200 lg:w-[20%] md:w-[35%] md:static fixed top-[14vh] ${isSide ? 'left-0' : '-left-[1000%]'} w-[230px] h-[91vh] pr-2 transition-all duration-300`}>
      <div className='font-bold text-xl text-gray-600'>
        <NavLink to={'/'} className={(({isActive}) => `${isActive ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 hover:bg-gray-200'} rounded-r-md flex gap-2 items-center py-6 px-3 my-2 cursor-pointer`)}><BiHome className='text-2xl'/> Home</NavLink>
        <NavLink to={'/photos'} className={(({isActive}) => `${isActive ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 hover:bg-gray-200'} rounded-r-md flex gap-2 items-center py-6 px-3 my-2 cursor-pointer`)}><BiImage className='text-2xl'/> Photos</NavLink>
        <NavLink to={'/videos'} className={(({isActive}) => `${isActive ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 hover:bg-gray-200'} rounded-r-md flex gap-2 items-center py-6 px-3 my-2 cursor-pointer`)}><MdOndemandVideo className='text-2xl'/> Videos</NavLink>
        <NavLink to={'/notes'} className={(({isActive}) => `${isActive ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 hover:bg-gray-200'} rounded-r-md flex gap-2 items-center py-6 px-3 my-2 cursor-pointer`)}><TiDocumentText className='text-2xl'/> Notes</NavLink>
        {
          authObj && <><NavLink to={'/me'} className={(({isActive}) => `${isActive ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-gray-100 hover:bg-gray-200'} rounded-r-md flex gap-2 items-center py-6 px-3 my-2 cursor-pointer`)}><FaRegUserCircle className='text-2xl'/> Profile</NavLink>
          </>
        }
      </div>
    </div>
  )
}

export default Sidebar