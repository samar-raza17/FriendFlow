import React, { createContext, useState } from 'react'

export const UploaderContext = createContext();

const UploaderProvider = ({children}) => {
    const [isImage, setIsImage] = useState(false)
    const [isVideo, setIsVideo] = useState(false)
  return (
    <UploaderContext.Provider value={{isImage, setIsImage,isVideo, setIsVideo}}>{children}</UploaderContext.Provider>
  )
}

export default UploaderProvider