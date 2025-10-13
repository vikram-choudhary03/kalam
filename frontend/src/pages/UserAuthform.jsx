import { useContext, useEffect, useRef, useState } from "react";
import Inputbox from "../components/Inputbox";
import googleIcon from "../assets/google.png";
import { Link, Navigate } from "react-router-dom";
import Pageanimation from "../utils/Pageanimation";
import {Toaster, toast} from "react-hot-toast"; 
import axios from 'axios'; 
import { storeInsesion } from "../common/Sessions";
import { UserContext } from "../App";
import { authwithgoogle } from "../common/Firebase";
const UserAuthform = ({type})=>{

    const [show, setshow] = useState(true); 

    const signupform =  useRef(); 
    const signinform =  useRef(); 
    

    let {userAuth: {access_token}, setUserAuth} = useContext(UserContext); 

    console.log(access_token); 

    const handlesubmit = (e)=>{

       e.preventDefault(); 
    
       let serverRoute = type =="sign-in" ?"/signin" : "/signup"
        
        const emailRegex  =   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
        

      let form ; 
      if(type == "sign-up"){
        form = new FormData(signupform.current) ; 
      } else{
        form = new FormData(signinform.current) ; 
      }
       
       let formData = {} ; 

       for(let [key, value] of form.entries()){
        formData[key] = value; 
       }
      
    
       
       let {fullname,email, password} = formData; 
       
       
       if(type == "sign-up"){
        if(fullname.length <3){
            return toast.error("Full name must be atleast 3 letters long"
            ) ; 
       }
       
    }

    if(!email) {
        return toast.error("Email can't be empty"
        )
    }

    if( !emailRegex.test(email)){
        return toast.error("Email is Invalid"
        )
    }
    if ( !password ||  !passwordRegex.test(password)){
        return toast.error(
            "Password should  be 6 to 20 long with a numeric, 1 uppercase and 1 lowercase letters"
        )
    }

    tosenduserformdata(serverRoute, formData); 

    }

    const tosenduserformdata = (serverRoute, formData)=>{

        axios.post("https://kalam-backend-l56d.onrender.com"+serverRoute , formData)
        .then(({data})=>{
           storeInsesion("user", JSON.stringify(data));
           
           setUserAuth(data); 
           console.log(sessionStorage); 
        })
        .catch(({response})=>{
            toast.error(response.data.error); 
        })



    }


    const handlGoogleAuth =   (e)=>{
        e.preventDefault(); 
         authwithgoogle().then(user=>{
            
            let serverRoute = "/google-auth"; 

            let formData ={
                access_token : user.accessToken 

            } 


            tosenduserformdata(serverRoute ,formData); 
        })
        .catch((err)=>{
            toast.error("trouble login through google");
            return console.log(err);
        })
    }

    return (
        
        access_token ? 
        <Navigate to="/" />
        : 
        <Pageanimation keyValue={type}>
                <section className="h-cover flex items-center justify-center bg-amber-200 mt-20 ">
        <Toaster />
        <form ref={ type == "sign-up" ? signupform : signinform} className=" w-[80%] max-w-[400px] ">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24 ">
                {type =="sign-in" ?"Welcome Back" :"Join us today"}
            </h1>
            
            {
                type != "sign-in" ?
                <Inputbox 
                    name="fullname"
                    type="text"
                    placeholder="Full Name"
                    icon = "fi-rr-user"
                />
                : ""
            }

            <Inputbox 
                name="email"
                type="email"
                placeholder="Email"
                icon = "fi-rr-envelope"
            />
           
            <Inputbox 
                name="password"
                type="password"         
                placeholder="Password"
                icon = "fi-rr-key" 
            />
            
            <button className="btn btn-dark center mt-14  " type="submit" onClick={handlesubmit}>
                {type.replace("-", " ")}
            </button>
            
            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold "> 
                <hr className="w-1/2 border-black"/>
                <p>or</p>
                <hr className="w-1/2 border-black"/>
            </div>

            <button className="btn btn-dark flex items-center justify-center gap-4 w-[90%] center "
                onClick={handlGoogleAuth}
            >
                <img src={googleIcon} className="w-5 " />
                continue with google
            </button>

            {
                type == "sign-in" ?
                <p className="mt-6 text-gray-500 text-center ">
                    Don't have an account ?
                    <Link to="/signup" className="underline text-black text-xl ml-1 ">
                        Join us today
                    </Link>
                </p>
                : 
                <p className="mt-6 text-gray-500 text-center ">
                    Already a member ?
                    <Link to="/signin" className="underline text-black text-xl ml-1 ">
                        Sign in here
                    </Link>
                </p>
            }


        </form>
      </section>
        </Pageanimation>
  
    )
}


export default  UserAuthform ;