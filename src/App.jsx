import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Photos from './Pages/Photos'
import Videos from './Pages/Videos'
import Notes from './Pages/Notes'
import Me from './Pages/Me'
import Others from './Pages/Others'
import Form from './Pages/Form'
import UP from './Pages/UP'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import PostDetail from './Pages/PostsDetail'
import ScrollTop from './Components/ScrollTop'



function App() {

  return (
    <>
    <ToastContainer />
    <BrowserRouter>
    <ScrollTop/>
    <Routes>
      <Route path='/' element={<Navbar><Outlet/></Navbar>}>
      <Route index element={<Home/>}/>
      <Route path='photos' element={<Photos/>}/>
      <Route path='videos' element={<Videos/>}/>
      <Route path='notes' element={<Notes/>}/>
      <Route path='me' element={<Me/>}/>
      <Route path='others/:id' element={<Others/>}/>
      <Route path='post/:id' element={<PostDetail/>}/>
      </Route>
      <Route path='/up' element={<UP/>}/>
      <Route path='/form' element={<Form/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
