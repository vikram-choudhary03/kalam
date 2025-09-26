import { Link, Navigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Pageanimation from "../utils/Pageanimation";
import defaultBanner from "../assets/blogbanner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/Editor";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools";
import axios from "axios";

const BlogEditor = () => {
  let blogBannerRef = useRef();

  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
  } = useContext(EditorContext);

  let { editorState, setEditorState } = useContext(EditorContext);
  //useEffect

  const editorRef = useRef(null);
  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Let's write an awesome story",
        onChange: async () => {
          console.log("EditorJS onChange - current blog:", blog);
          let savedData = await editorRef.current.save();
          console.log("EditorJS onChange - setting content:", savedData);
          setBlog(prvblog=>({ ...prvblog, content: savedData })); // Update state

          localStorage.setItem("blogContent", JSON.stringify(savedData));
        },
      });
    }

    return (()=>{
      if(editorRef.current && editorRef.current.destroy){
        editorRef.current.destroy(); 
        editorRef.current = null  ; 
      }
    })

    
  }, []);

  useEffect(() => {
    console.log("mount");
    
    console.log("Title effect - title:", title);
    console.log("Title effect - full blog:", blog);
    localStorage.setItem("blogTitle", title);
    return ()=>{
      console.log("unmount blogedior");
    }
    
  }, [blog]);

  useEffect(() => {
    localStorage.setItem("blogBanner", banner);
  }, [blog]);

  const handleClickbutton = () => {
    setBlog({...blog, des : content.blocks[0].data.text})
    setEditorState("publish");
  };


  const handleBannerUpload = (e) => {
    console.log(e.target);
    let img = e.target.files[0];

    if (img) {
      let loadingToast = toast.loading("Uploading...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");
            // blogBannerRef.current.src = url

            setBlog({ ...blog, banner: url });
          }
        })
        .catch((error) => {
          toast.dismiss(loadingToast);
          return toast.error(error);
        });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      //user has pressed enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    // this function makes the textarea height dynamic
    let input = e.target;
    console.log(input.scrollHeight);
    console.log(e.target);
    input.style.height = "auto";

    input.style.height = input.scrollHeight + "px";
    
    setBlog({...blog, title: input.value});
  };

  const handleError = (e) => {
    let img = e.target;
    console.log(img);

    img.src = defaultBanner;
  };

  console.log(blog);
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none  w-10">
          <img src={logo}></img>
        </Link>

        <p className="max-md:hidden  text-black line-clamp-1 w-full bg-amber-200">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark-two py-2 " onClick={handleClickbutton}>
            Publish
          </button>

          <button className="btn btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <Pageanimation>
        ;
        <section className="px-[5vw] ">
          <div className=" mx-auto   max-w-[900px]  w-full  ">
            <div className="relative aspect-video hover:opacity-80 border-4 border-gray bg-white ">
              <label htmlFor="uploadBanner">
                <img
                  // ref = {blogBannerRef}
                  src={banner}
                  className="z-20"
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              placeholder="Blog Title"
              className=" text-4xl font-medium w-full h-20 resize-none  outline-none mt-10 leading-tight placeholder:opacity-40 "
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
              value={title}
            ></textarea>

            <hr className="w-full  opacity-10 my-5 "></hr>

            <div
              id="textEditor"
              className="font-gelasio text-xl justify-start"
            ></div>
          </div>
        </section>
      </Pageanimation>
    </>
  );
};

export default BlogEditor;
