import React, { useContext, useEffect } from 'react'
import Sidebar from '../Components/Sidebar'
import Feed from '../Components/Feed'
import Rightbar from '../Components/Rightbar'
import PVUploads from '../Components/PVUploads'

const Home = () => {
  return (
    <div className='flex pt-[8vh]'>
      <Sidebar/>
      <Feed/>
      <Rightbar/>
      <PVUploads/>
    </div>
  )
}

export default Home