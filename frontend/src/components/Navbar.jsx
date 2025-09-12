import { Link, Outlet } from "react-router";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import user from "../assets/user.png"
import UserNavigationPanel from "./UserNavigationPanel";

const Navbar = () => {
  const [searchvisible, setSearchVisible] = useState(false);

  const [userNavPanel, setUserNavPanel] = useState(false); 

  
  const handleUserNavPanel = ()=>{

    setUserNavPanel(currentVal => !currentVal); 

  }
  // let p = "https://lh3.googleusercontent.com/a/ACg8ocKKH1LzhhdZdAT7-c7TsdP5nFdI3T_zuX7qh4lXwHys-4bdXw=s96-c";
  const handleBlur = ()=>{

    setTimeout(()=>{
      setUserNavPanel(false); 
    }, 200);
     
    console.log(profile_img); 
    

  }
  
  const {userAuth, userAuth : {access_token, profile_img }} = useContext(UserContext); 
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10 ">
          <img src={logo} className=" w-full " />
        </Link>

        <div
          className={
            "absolute  bg-blue-400   w-full  py-4  px-[5vw] top-full left-0  border-b border-gray mt-0.5    md:border-0   md:relative  md:inset-0 md:p-0 md:w-auto  " +
            (!searchvisible ? "hidden md:block" : "block")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full  md:w-auto  bg-gray p-4 pl-6  md:pr-6  pr-[12%] rounded-full placeholder:text-gray-500       md:pl-12 "
          ></input>
          <i className="fi fi-rr-search absolute right-[10%]  md:pointer-events-none md:left-5  top-1/2 -translate-y-1/2 text-md text-gray-500   "></i>
        </div>
        <div className="flex  items-center gap-3 md:gap-6  ml-auto ">
          <button
            className="md:hidden bg-gray w-12 h-12 rounded-full flex items-center justify-center "
            onClick={() => setSearchVisible((searchvisible) => !searchvisible)}
          >
            <i className="fi fi-rr-search text-xl  "></i>
          </button>

          <Link to="/editor" className="hidden md:flex   gap-2 link ">
            <i className="fi fi-tr-file-edit"></i>
            <p>Write</p>
          </Link>


          {access_token ? 
          <>
            <Link to="/dashboard/notification">
              <button className="w-12 h-12 rounded-full bg-gray relative hover:bg-black/10  items-center"> 
              <i className="fi fi-rr-bell text-xl  mt-1 r"></i>
              </button>
            </Link>

            <div className=" relative  " onClick={handleUserNavPanel}  onBlur={handleBlur}>
              <button className="w-12 h-12 mt-1 bg-gray rounded-full ">
                  <img src={profile_img} className="center w-full h-full rounded-full "/>
              </button>
              
              {userNavPanel ?  <UserNavigationPanel/>
              : ""}
             
            </div>

            
          </>
          :
          <>
            <Link className="btn btn-dark py-2" to="/signin">
            Sign in
          </Link>
          <Link className="hidden md:block btn btn-light py-2" to="/signup">
            Sign up
          </Link>
          </>

        }
        
        </div>
      </nav>
      
      <Outlet/>
    </>
  );
};

export default Navbar;
