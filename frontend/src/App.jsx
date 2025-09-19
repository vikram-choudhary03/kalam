import { createContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import UserAuthform from './pages/UserAuthform'
import { lookInsession } from './common/Sessions'
import { Editor } from './pages/Editor'
import PublishForm from './components/PublishForm'

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
      <Route path="/" element={<Navbar/>}>
        <Route path="signin" element={<UserAuthform  type={"sign-in"}/>}/>
        <Route path="signup" element={<UserAuthform  type={"sign-up"}/>}/>
      </Route>
    
    </Routes>
     </UserContext.Provider>
    </>
   
    
  )



  
}

export default App
