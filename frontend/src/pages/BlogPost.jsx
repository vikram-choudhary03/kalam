
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
let count  = 0; 
export const BlogPost = () => {

    
    const [blogData, setBlogData]  = useState({}) ; 
    const [isloading, setIsLoading] = useState(true) ; 
    const {blogId} = useParams() ; 
     useEffect(()=>{

      axios.get(`http://localhost:3000/blog/${blogId}`)
      .then((res)=>{
        setBlogData(res.data) ;
        setIsLoading(false) ; 
        count++;  
       console.log(res);
      }).catch((err)=>{
        console.log(err.message) ; 
      })

        
    }, [])

    console.log(count) ; 
    if(isloading){
      return <div className="mt-20 mx-auto max-w-[900px]">Loading blog...</div>
    }

  console.log(blogData);
  return (
    <div className='mt-20 '>
        <div className=' mx-auto  max-w-[900px] px-4 space-y-4'>
            
            <h1 className='  w-full text-6xl font-bold  break-normal  py-6  overflow-hidden'>{blogData.blog.title}</h1>

           
            <div className='flex gap-4  items-center'>
               <div className="h-10 w-10 rounded-full overflow-hidden border border-neutral-400 ">
                <img src={blogData.blog.author.profile_img}  className='object-fit'></img>
              </div>
              <div className='text-md text-neutral-700 hover:text-black'>{blogData.blog.author.fullname}</div>
              <button className='border  rounded-full px-3 py-1 bg-white border-neutral-400 shadow-md text-neutral-700 hover:text-black '>
                follow 
              </button>
            </div>
            <hr className="text-gray"></hr>
            <div>
                <div>
                    {blogData.blog.content.blocks.map((block, index)=>(
                      <BlockRenderer block={block} index = {index}></BlockRenderer>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}



const BlockRenderer = ({block, index})=>{


  switch  (block.type) {
    case 'paragraph' :
      return <SafeHTML  key={index} html={block.data.text} />

  }

}

const SafeHTML = ({html})=>{
 return (
  <div dangerouslySetInnerHTML={{__html :DOMPurify.sanitize(html) } } className='tracking-wide text-lg leading-8 text-justify mb-4'></div>
 )
}

