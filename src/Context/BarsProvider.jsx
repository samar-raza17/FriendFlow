import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'

export const BarsContext = createContext();

const BarsProvider = ({children}) => {
    const [isSide, setIsSide] = useState(false);
    const [isRight, setIsRight] = useState(false);
  return (
    <BarsContext.Provider value={{isSide, setIsSide,isRight, setIsRight}}>{children}</BarsContext.Provider>
  )
}

export default BarsProvider