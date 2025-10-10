import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../pages/Editor";
import { UserContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";



  
const PublishForm = () => {
  let { editorState, setEditorState } = useContext(EditorContext);

  

  const handleEditorState = () => {
    setEditorState("editor");
  };

  

  
  return (
    <div className="grid  grid-cols-1 p-10 md:grid-cols-2 h-screen  relative">
      <div
        className="absolute right-20 top-10 py-1 px-2  border-1 border-black "
        onClick={handleEditorState}
      >
        <i className="fi fi-rr-cross"></i>
      </div>
      <FirstCol  ></FirstCol>
      <SecondCol></SecondCol>
    </div>
  );
};

export const FirstCol = () => {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
  } = useContext(EditorContext);


 

  return (
    <div className=" w-full  md:px-30 md:py-40 ">
      <div className="flex flex-col  w-full gap-4 justify-between">
        <h1 className="text-xl font-semibold tracking-tight font-inter -mb-4">
          Story Preview
        </h1>
        <div className="mt-4">
          <img
            src={banner}
            className="w-full  bg aspect-video"
          ></img>
        </div>
        <div className="font-gelasio text-xl font-extrabold mt text-wrap ">
          {title}
        </div>
        <hr className=" -mt-4 w-full text-neutral-400 "></hr>
        <div className="text-base text-[#000000ad] font-normal tracking-wide text-wrap my-2">
          {des}
        </div>
        <hr className="w-full text-neutral-400 "></hr>
      </div>
    </div>
  );
};

export const SecondCol = () => {
  let {
    userAuth,
    userAuth: { fullname , access_token},
  } = useContext(UserContext);

  let {
    blog,
    blog: { title, banner, content, tags, des, author },
    setBlog,
  } = useContext(EditorContext);

  const navigate = useNavigate() ; 
  const [inputtags, setInputTags] = useState("");
  const [isEntered , setIsEntered] = useState(false); 
  const inputTagsRef = null;
  

  const handleChangeTags = (e) => {
    setInputTags(e.target.value);
    setIsEntered(false);
  };

  const handleKeyDownTags = (e) => {
    
    if (e.key == "Enter") {
      let tmp = [];
      tmp = tags;
      tmp.push(inputtags);
      console.log(blog);
      setBlog({ ...blog, tags: tmp });

      setInputTags("");
      setIsEntered(true); 
      // inputTagsRef.current = null ;
    }
  };

  const handleTagsclick = (index)=>{
   
    let tmp = tags ; 
    
    tmp.splice(index, 1); 
   

    setBlog({...blog, tags: tmp}); 


  }

  const handleBlogPublish  =async ()=>{

    try {
      const res = await axios.post("https://kalam-backend-v2.onrender.com/create-blog" , {
        title, 
        banner, 
        content,
        tags, 
        des
    }, {
        headers : {
          'Authorization': `Bearer ${access_token}`
        }
    })
      
      console.log(res.data) ; 
      localStorage.removeItem('blogTitle');
      localStorage.removeItem('blogBanner');
      localStorage.removeItem('blogContent');
      // localStorage.removeItem('des');


      // setBlog({...blog, 
      //   title : '', 
      //   banner : defaultBanner, 
      //   content : '', 
      //   des : '', 
      //   tags : []}
      // )

     navigate('/'); 
    
    }catch(err){
      console.log(err.message);
    }
   

    

  }
 
  return (
    <div className=" w-full  md:px-30 md:py-40">
      <div className="flex flex-col  w-full gap-4 justify-between">
        <div className="flex w-full gap-4 text-lg md:text-xl  tracking-tight font-inter">
          <h1>Publishing: </h1>
          <h1 className="font-semibold">{fullname}</h1>
        </div>
        <div className="text-md">
          Add or change topics (up to 5) so readers know what your story is
          about
        </div>
        <div className=" px-6  border-1 border-neutral-400  max-w-full bg-neutral-50 flex items-center gap-2 space-between py-2 flex-wrap ">
          {tags.length != 0 ? (
            <div className=" flex gap-2 flex-wrap cursor-pointer    ">
              {tags.map((tag, index) => {
                return (
                  <div className="flex gap-2 items-center  px-4 py-3 bg-white  border-1 border-neutral-300  hover:border-gray-500 " key={index}>
                    <span  className=" ">
                      {tag}
                    </span>
                    <button className="" onClick={()=> handleTagsclick(index)}>
                    <i class="fi fi-rs-cross-small"></i>
                    </button>
                    
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )} 

          {tags.length >= 5 ? (
            ""
          ) : (
            <input
              className=" min-w-0 flex-1 text-md placeholder:text-neutral-400 focus:outline-none   my-3"
              placeholder="Add a topic..."
              onChange={handleChangeTags}
              onKeyDown={handleKeyDownTags}
              value={inputtags}
              ref={inputTagsRef}
            />
          )}

          
        </div>

        <div className="items-start flex ">
          <button
            className="text-md px-4 py-2 text-white bg-[#1a8917] font-normal rounded-full "
            onClick={handleBlogPublish}
          >
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishForm;
