import { useState } from "react";

const Inputbox = ({name, type, id, value,placeholder, icon})=>{
    const [showpassword, setShowPassword] = useState(false); 
    return (
        <div className="relative w-[100%] mb-4 items-center">
            <input 
                name={name}
                type={type =="password" ? showpassword ? "text" : "password"  : type }
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                className="input-box"
               
            />
            <i className={"fi "+ icon + " input-icon"} ></i>
            
            {
                type=="password" ?
                    !showpassword ? 
                    <i className="fi fi-rr-eye-crossed input-icon left-auto  right-4 cursor-pointer" 
                    onClick={()=>setShowPassword(showpassword => !showpassword)}
                    ></i> : 
                    <i className="fi fi-rr-eye input-icon left-auto  right-4 cursor-pointer" 
                    onClick={()=>setShowPassword(showpassword => !showpassword)}></i>
                : ""
            }
        </div>
    )
}

export default Inputbox  ;