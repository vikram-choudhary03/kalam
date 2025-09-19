import { useContext, useEffect } from "react";
import { EditorContext } from "../pages/Editor";
import { UserContext } from "../App";

const PublishForm = () => {

 
  let { editorState, setEditorState } = useContext(EditorContext);

  const handleEditorState = ()=>{
    setEditorState("editor") ;
  }
  return (
    <div className="grid  grid-cols-2 h-screen  relative">
      <div className="absolute right-20 top-10 py-1 px-2  border-1 border-black " onClick={handleEditorState}>
      <i class="fi fi-rr-cross" ></i>
      </div>
      <FirstCol></FirstCol>
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

  let deslimit = 140;
  let tmpDesc = "";
  console.log(des);
  const makeDesc = () => {
    let s = des;

    let i = 0;
    console.log(des);
    while (i < s.length && tmpDesc.length <= deslimit - 3) {
      if (s[i] == "<") {
        while (i < s.length && s[i] != ">") {
          i++;
        }
        i++;
        continue;
      }

      tmpDesc += s[i];
      i++;

      console.log(tmpDesc);
      tmpDesc = tmpDesc.replace(/&nbsp;/g, ' ');

    }

    if (tmpDesc.length == deslimit - 3) {
      tempDesc += "...";
    }
  };

  makeDesc();

  return (
    <div className=" w-full  px-30 py-40 ">
      <div className="flex flex-col  w-full gap-4 justify-between">
        <h1 className="text-xl font-semibold tracking-tight font-inter -mb-4">
          Story Preview
        </h1>
        <div className="mt-4">
          <img
            src={banner}
            className="w-full h-60 bg object-cover object-fit"
          ></img>
        </div>
        <div className="font-gelasio text-xl font-extrabold mt text-wrap ">
          {title}
        </div>
        <hr className=" -mt-4 w-full text-neutral-400 "></hr>
        <div className="text-base text-[#000000ad] font-normal tracking-wide text-wrap my-2">
          {tmpDesc}
        </div>
        <hr className="w-full text-neutral-400 "></hr>
      </div>
      
    </div>
  );
};

export const SecondCol = () => {

  let {userAuth, userAuth : {fullname}} = useContext(UserContext);
  console.log(userAuth) ; 

  const handleBlogPublish = ()=>{
    console.log(userAuth); 

  }
  return (
    <div className=" w-full  px-30 py-40">
      <div className="flex flex-col  w-full gap-4 justify-between">
        <div className="flex w-full gap-4  text-xl  tracking-tight font-inter">
          <h1>Publishing: </h1>
          <h1 className="font-semibold">{fullname}</h1>
        </div>
        <div>
          Add or change topics (up to 5) so readers know what your story is
          about
        </div>
        <input
          className="w-full p-5 text-md border-1 border-neutral-300"
          placeholder="Add a topic..."
        />
        <div className="items-start flex ">
          <button className="text-md px-4 py-2 text-white bg-[#1a8917] font-normal rounded-full "  onClick={handleBlogPublish}>Publish Now</button>
        </div>
      </div>
    </div>
  );
};

export default PublishForm;
