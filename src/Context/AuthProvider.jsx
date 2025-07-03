import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from '../Firebase/firebase'

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [isUser, setIsUser] = useState(false)
    const [authObj, setAuthObj] = useState(false)
    const [DP, setDP] = useState(null);
    const [uploadName, setUploadName] = useState(null)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setIsUser(true)
        setAuthObj(user)
      } else {
        setIsUser(false)
        setAuthObj(false)
      }
    });
  return (
    <AuthContext.Provider value={{
        authObj, setAuthObj,isUser, setIsUser,DP, setDP,uploadName, setUploadName
    }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider