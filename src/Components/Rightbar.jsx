import React, { useContext } from 'react'

const Rightbar = () => {
  return (
    <div className={`transition-all duration-300 border-l-2 border-gray-200 h-[91vh] bg-white xl:w-[20%] xl:static fixed top-[8vh] -right-[1000%]`}>
      {
        ["https://cdn.dribbble.com/users/322038/screenshots/6166737/media/4311fdd83bc80e2a5df60ece4728da64.gif","https://cdn.dribbble.com/users/3821672/screenshots/7160183/chatting.gif","https://cdn.dribbble.com/users/1894420/screenshots/14081986/media/790c0983a729e5ce15f4d25f42697e77.gif"].map((img, index) => {
          return(
        <div key={index} className="w-full h-[200px] p-3">
            <img src={img} className="w-full h-full rounded-md" />
        </div>
          )
        })
      }

    </div>
  )
}

export default Rightbar