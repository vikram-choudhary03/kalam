import { Link } from "react-router-dom"
import Pageanimation from "../utils/Pageanimation"
import { useContext } from "react"
import { UserContext } from "../App"
import { removeFromsession, } from "../common/Sessions"

const UserNavigationPanel = ()=>{ 

    const {userAuth :{username}, setUserAuth} = useContext(UserContext); 

    const signOutUser = ()=>{

      removeFromsession("user"); 
      setUserAuth({acces_token : null}); 
      localStorage.clear();

    }
    return (
        
        <Pageanimation  className ="absolute right-0 z-50  " transition={{duration : 0.2}}>
            
          <div  className="bg-white right-0   border border-gray w-60 duration-200 ">
            
            <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4 ">
            <i className="fi fi-tr-file-edit"></i>
            <p>Write</p>  
            </Link>

           <Link to={`/user/${username}`} className="py-4 pl-8 link ">
             Profile
           </Link>

           <Link to="/dashboard/blogs "className="py-4 pl-8 link ">
             Dashboard 
           </Link>

           <Link to="/settings/edit-profile "className="py-4 pl-8 link ">
             Settings 
           </Link>
          
            <span  className="absolute border-t border-gray w-[100%] "></span>

            <button className="text-left p-4 hover:bg-gray  w-full  pl-8 " onClick={signOutUser}>

              <h1 className="font-medium text-xl ">Sign Out</h1>
              <p className="text-grey-500">@{username}</p>
            </button>

            
          </div>   

        </Pageanimation>
    )
}


export default UserNavigationPanel; 