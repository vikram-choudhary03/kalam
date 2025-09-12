
const storeInsesion = (key, value) =>{
    return sessionStorage.setItem(key, value); 
}

const  lookInsession = ( key)=>{
    return sessionStorage.getItem(key); 
}

const removeFromsession = (key) =>{
    return sessionStorage.removeItem(key);
}

export {removeFromsession,lookInsession, storeInsesion } ; 