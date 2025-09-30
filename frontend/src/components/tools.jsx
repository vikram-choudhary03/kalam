// importing tools

import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../common/aws";
import CodeTool from '@editorjs/code';
import Table from '@editorjs/table'
const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (error) {
      reject(error);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

const uploadImageByFile = async (e) => {
  try {
    const url = await uploadImage(e);
    if (url) {
      return {
        success: 1,
        file: { url },
      };
    }
  } catch (err) {
    return err;
  }
};
export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    inlineToolbar: true,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [1,2,3,4,5,6],
      defaultLevel: 3,
    },
    inlineToolbar : true,
    shortcut: 'CMD+SHIFT+H',
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
  code : {
    class: CodeTool
  },
  table : {
    class :   Table 
  }
};
