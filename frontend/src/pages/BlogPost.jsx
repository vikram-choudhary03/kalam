import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export const BlogPost = () => {
  const [blogData, setBlogData] = useState({});
  const [isloading, setIsLoading] = useState(true);
  const { blogId } = useParams();
  useEffect(() => {
    axios
      .get(`https://kalam-backend-l56d.onrender.com/blog/${blogId}`)
      .then((res) => {
        setBlogData(res.data);
        setIsLoading(false);
       
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  
  if (isloading) {
    return <div className="mt-20 mx-auto max-w-[900px]">Loading blog...</div>;
  }

  console.log(blogData);
  return (
    <div className="mt-20 ">
      <div className=" mx-auto  max-w-[900px] px-4 space-y-4 ">
        <h1 className="  w-full text-6xl font-bold  break-normal  py-6  overflow-hidden ">
          {blogData.blog.title}
        </h1>

        <div className="flex gap-4  items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-neutral-400 ">
            <img
              src={blogData.blog.author.profile_img}
              className="object-fit"
            ></img>
          </div>
          <div className="text-md text-neutral-700 hover:text-black">
            {blogData.blog.author.fullname}
          </div>
          <button className="border  rounded-full px-3 py-1 bg-white border-neutral-400 shadow-md text-neutral-700 hover:text-black ">
            follow
          </button>
        </div>
        <hr className="text-gray"></hr>
        <div>
          {blogData.blog.content.blocks.map((block, index) => (
            <div className="mb-4">
              <BlockRenderer block={block} index={index}></BlockRenderer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BlockRenderer = ({ block, index }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <div
          key={index}
          dangerouslySetInnerHTML={SafeHTML(block.data.text)}
          className="tracking-wide text-lg leading-8 text-justify"
        ></div>
      );
    case "header":
      return <HeaderRender data={block.data} key={index}></HeaderRender>;
    case "list":
      return <ListRender data={block.data} key={index}></ListRender>;
    case "image":
      return <ImageRender data={block.data} key={index}></ImageRender>;
    case "quote":
      return <QuoteRender data={block.data} key={index}></QuoteRender>;
  }
};

const QuoteRender = ({ data , index}) => {
  return (
    <div className=" gap-8 flex relative  px-10   " key={index}>
      <div className="bg-black w-1 h-full absolute top-0 left-0"></div>
      <div className="space-y-1">
        <p className="text-xl font-bold italic  ">{data.text}</p>
        <p dangerouslySetInnerHTML={SafeHTML(data.caption)} className="italic text-gray-700"></p>
      </div>
    </div>
  );
};
const ImageRender = ({ data }) => {
  let { stretched, withBackground, withBorder } = data;
  withBorder = true;
  withBackground = true;
  stretched = false;
  return (
    <div className="">
      <div
        className={`${
          withBackground ? " flex  flex-col items-center space-y-1 py-4 " : ""
        } ${withBorder ? "border border-gray-100" : ""} `}
      >
        <img
          src={data.file.url}
          className={`
          ${stretched ? "w-full" : "w-auto"}  
          ${withBackground ? "bg-gray-100" : ""}
          ${withBorder ? "border border-gray-300" : ""} 
           `}
        />
        <p
          dangerouslySetInnerHTML={SafeHTML(data.caption)}
          className="italic  text-gray-400   "
        ></p>
      </div>
    </div>
  );
};

const SafeHTML = (html) => {
  return {
    __html: DOMPurify.sanitize(html),
  };
};

const HeaderRender = ({ data, index }) => {
  switch (data.level) {
    case 1:
      return (
        <h1
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={SafeHTML(data.text)}
          key={index}
        ></h1>
      );
    case 2:
      return (
        <h2
          className="text-2xl font-bold"
          dangerouslySetInnerHTML={SafeHTML(data.text)}
          key={index}
        ></h2>
      );
    case 3:
      return (
        <h3
          className="text-xl font-bold"
          dangerouslySetInnerHTML={SafeHTML(data.text)}
          key={index}
        ></h3>
      );
    case 4:
      return (
        <h4
          className="text-lg font-bold"
          dangerouslySetInnerHTML={SafeHTML(data.text)}
          key={index}
        ></h4>
      );
    case 5:
      return (
        <h5
          className="text-base font-bold"
          dangerouslySetInnerHTML={SafeHTML(data.text)}
          key={index}
        ></h5>
      );
    case 6:
      return (
        <h6
          className="text-base font-bold"
          dangerouslySetInnerHTML={SafeHTML(data.text)}
          key={index}
        ></h6>
      );
  }
};

const ListRender = ({ data }) => {
  switch (data.style) {
    case "ordered":
      return <OrderListRender data={data} />;
    case "unordered":
      return (
        <ListItemsMapRender
          data={data}
          className="list-disc leading-8 text-lg tracking-wide list-inside "
        />
      );
    case "checklist":
      return <ListCheckListMapRender data={data} />;
  }
};

const OrderListRender = ({ data }) => {
  switch (data.meta.counterType) {
    case "numeric":
      return (
        <ListItemsMapRender
          data={data}
          className="list-decimal leading-8 text-lg tracking-wide list-inside "
        />
      );
    case "lower roman":
      return (
        <ListItemsMapRender
          data={data}
          className="list-[lower-roman] leading-8 text-lg tracking-wide list-inside"
        />
      );
    case "upper roman":
      return (
        <ListItemsMapRender
          data={data}
          className="list-[upper-roman] leading-8 text-lg tracking-wide list-inside"
        />
      );
    case "upper alpha":
      return (
        <ListItemsMapRender
          data={data}
          className="list-[upper-alpha] leading-8 text-lg tracking-wide list-inside"
        />
      );
    case "lower alpha":
      return (
        <ListItemsMapRender
          data={data}
          className="list-[lower-alpha] leading-8 text-lg tracking-wide list-inside"
        />
      );
  }
};

const ListItemsMapRender = ({ data, className }) => {
  return (
    <ol className="pl-2">
      {data.items.map((item, index) => (
        <li
          dangerouslySetInnerHTML={SafeHTML(item.content)}
          key={index}
          className={`${className}`}
        />
      ))}
    </ol>
  );
};

const ListCheckListMapRender = ({ data }) => {
  const ischecked = true;
  return (
    <ul className="pl-2">
      {data.items.map((item, index) => (
        <li key={index}>
          {item.meta.checked ? (
            <input
              disabled
              checked
              type="checkbox"
              className="h-4 w-4  mr-1  rounded-sm "
              id={index}
            ></input>
          ) : (
            <input
              disabled
              type="checkbox"
              className="h-4 w-4  mr-1  rounded-sm "
              id={index}
            ></input>
          )}
          <label
            htmlFor={index}
            className=" ms-1 text-lg "
            dangerouslySetInnerHTML={SafeHTML(item.content)}
          ></label>
        </li>
      ))}
    </ul>
  );
};
