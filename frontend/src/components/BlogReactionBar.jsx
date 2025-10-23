import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

export const BlogReactionBar = ({ blog , blogId}) => {
  console.log(blog.activity);
  return (
    <div className="flex items-center justify-between px-2 ">
      <div className="flex items-center gap-10 ">
        <Upvote blog={blog} blogId = {blogId}></Upvote>
        <Comment blog={blog} blogId = {blogId}></Comment>
      </div>
      <div className="flex items-center gap-6 ">
        <Bookmark />
        <Share />
        <Menu />
      </div>
    </div>
  );
};

export const Upvote = ({ blog, blogId }) => {
  // const [count, setCount] = useState(0);
  const [upvote, setUpvote] = useState(false);

  let {
      userAuth,
      userAuth: { fullname, access_token, profile_img, username },
    } = useContext(UserContext);

  const handleClick = () => {
    let count  ; 
    if(!upvote){
      count = blog.activity.total_likes+1 ; 
    }else{
      count =  blog.activity.total_likes ; 
    }


     axios.post("https://kalam-backend-l56d.onrender.com/post-likes" , {
      count, 
      blogId
    }, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res)=>{console.log(res)})
    .catch((err)=>console.log(err))


    setUpvote(!upvote);
    
  };

  
  console.log(blog.activity);
  
  return (
    <div className=" ">
      {!upvote ? (
        <div className="flex items-center justify-between gap-3 ">
          <i
            className="fi fi-rr-social-network text-2xl cursor-pointer"
            onClick={handleClick}
          ></i>
          <div className="text-lg text-neutral-500 hover:text-black">
            {blog.activity.total_likes}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 ">
          <i
            className="fi fi-sr-thumbs-up text-2xl cursor-pointer "
            onClick={handleClick}
          ></i>
          <div className="text-lg text-neutral-500 hover:text-black">
            {blog.activity.total_likes+ 1}
          </div>
        </div>
      )}
    </div>
  );
};

export const Comment = ({blog, blogId}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <i className="fi fi-rs-comment-dots text-2xl cursor-pointer"></i>
      <div className="text-lg text-neutral-500 hover:text-black">{blog.activity.total_comments}</div>
     
    </div>
  );
};

export const Bookmark = () => {
  return (
    <div>
      <i className="fi fi-rr-bookmark text-2xl"></i>
    </div>
  );
};

export const Share = () => {
  return (
    <div>
      <i className="fi fi-rs-share text-2xl"></i>
    </div>
  );
};

export const Menu = () => {
  return (
    <div>
      <i className="fi fi-rr-menu-dots text-2xl"></i>
    </div>
  );
};
