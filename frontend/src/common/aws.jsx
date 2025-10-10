import axios from 'axios' 
export const uploadImage = async (img)=>{

    let imgUrl = null ; 

    await axios.get("https://kalam-backend-v2.onrender.com/get-upload-url")
    .then(async ({data : {uploadURL}}) =>{

         await axios({
            method : 'PUT',
            url : uploadURL , 
            headers : {'Content-Type' : 'image/jpeg'},
            data : img
        
        })
        .then (()=>{
            console.log(uploadURL) ; 
            imgUrl = uploadURL.split("?")[0] ; 

        })
    }) 

    return imgUrl  ; 

}