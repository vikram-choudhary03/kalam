import { createContext, useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet, Route, Routes } from 'react-router-dom'
import UserAuthform from './pages/UserAuthform'
import { lookInsession } from './common/Sessions'
import { Editor } from './pages/Editor'
import PublishForm from './components/PublishForm'
import { Home } from './pages/Home'
import { BlogPost } from './pages/BlogPost'

export const UserContext = createContext({}); 

function App() {

  const [userAuth, setUserAuth]  = useState({}); 

  useEffect(() =>{

    let userInSession = lookInsession("user"); 
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null })
  }, [])
  return (
    <>
     <UserContext.Provider value={{userAuth, setUserAuth}}>
     <Routes>
      <Route  path="/editor"  element={<Editor/>} />
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} ></Route>
        <Route path="signin" element={<UserAuthform  type={"sign-in"}/>}/>
        <Route path="signup" element={<UserAuthform  type={"sign-up"}/>}/>
        <Route path="blog/:blogId"  element={<BlogPost/>} />
        
      </Route>
    
    </Routes>
     </UserContext.Provider>
    </>
   
    
  )



  
}


const Layout = ()=>{
  return (
    <div className=''>
        <Navbar/>
        <Outlet/>
      
    </div>
  )
}

export default App
