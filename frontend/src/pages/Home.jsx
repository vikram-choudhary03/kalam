import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Audio, Bars, RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
export const Home = () => {

  let {
    userAuth,
    userAuth: { fullname, access_token, profile_img, username },
  } = useContext(UserContext);

  return (

    <div className=" ">
      {access_token ? 
      <div className="grid  grid-cols-3  divide-x h-screen divide-gray ">
        <div className="col-span-2 px-[10vw]   ">
          <div className="navbar   pl-0 pb-[0vw] border-b-1  border-gray border-1 top-20">
            <div className="flex items-center gap-20  text-gray-600  text-md  font-medium">
              <h2 className="hover:text-black">For you</h2>
              <h3 className="hover:text-black">Featured</h3>
            </div>  
          </div>

          <DisplayBlog></DisplayBlog>
        </div>
        <div className="cols-span-1 pr-[5vw] ">secondcol</div>
      </div>
      : ""}v
    </div>
  );
};

const DisplayBlog = () => {
  const [data, setData] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const navigate  = useNavigate(); 
  const [color, setColor] = useState("#ffffff");
  
  let {
    userAuth,
    userAuth: { fullname, access_token, profile_img, username },
  } = useContext(UserContext);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("http://localhost:3000/get-blogs");

        if (!res.data) {
          return "err";
        }

        setData(res.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchdata();
  }, []);

  const handleBlogClick = (index)=>{
    let blogId = data.blogs[index].blog_id ; 
    navigate("/blog/"+blogId) ; 
  }
  const override = {
    display: "block",
    margin: "14px auto",
  };


  if (isloading) {
    return (
      <div className="flex items-center py-10">
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  

  return (
    <div className="py-20 ">
      {data.blogs.map((blog, index) => (
        <div key={index}>
        <div className="grid grid-cols-3  py-10 cursor-pointer" onClick={()=>handleBlogClick(index)} >
          <div className="col-span-2 pr-10  space-y-6 ">
            <div className="flex items-center gap-4  w-full text-neutral-600 hover:text-black">
              <div className="h-6 w-6 rounded-full overflow-hidden border border-neutral-400 ">
                <img src={blog.author.profile_img} className=""></img>
              </div>
              <div onClick={()=>console.log("dfdsf")}>{blog.author.fullname}</div>
            </div>
           
            <h1 className="text-3xl font-bold  tracking-tight ">{blog.title}</h1>

            <p className="text-lg font-normal tracking-wide ">{blog.des} </p>
          </div>
          <div className="col-span-1 flex flex-col items-center justify-center ">
            
            <img src={blog.banner} className="border-1 h-30 w-45 object-cover "></img>

           
          </div>
         </div>
       
        <hr className="border-gray border-1 "></hr>
        </div>
      ))}
    </div>
  );
};

const Title = () => {
  return <h1></h1>;
};
