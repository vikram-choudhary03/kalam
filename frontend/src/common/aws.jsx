import axios from 'axios' 
export const uploadImage = async (img)=>{

    let imgUrl = null ; 

    await axios.get("http://localhost:3000/get-upload-url")
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