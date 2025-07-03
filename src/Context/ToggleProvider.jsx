import React, { createContext, useState } from 'react'

export const toggleContext = createContext()

const ToggleProvider = ({children}) => {
    const [isToggle, setIsToggle] = useState(false)
  return (
    <toggleContext.Provider value={{isToggle, setIsToggle}}>{children}</toggleContext.Provider>
  )
}

export default ToggleProvider