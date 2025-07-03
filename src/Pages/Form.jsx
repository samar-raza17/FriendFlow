import React, { useState } from 'react'
import Signup from '../Components/Signup'
import Login from '../Components/Login'

const Form = () => {
  const [login, setLogin] = useState(false)
  return (
   <>
    {
      login ? <Login setLogin={setLogin} login={login}/> :<Signup setLogin={setLogin} login={login}/>
    }
    </>
  )
}

export default Form