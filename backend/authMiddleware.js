const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const { User } = require("./db");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  
  const  authHeader = req.headers.authorization;
  console.log(authHeader) ; 
  if(!authHeader  || !authHeader.startsWith('Bearer') ){
    return res.status(401).json({"msg" : "No Auth Header/Incorrect Auth Header"}); 
  }
  
  const access_token = authHeader.split(" ")[1]; 

  try {

    if (!access_token) {
      return res.status(401).json({ msg: "Unauthorised" });
    }
    const decoded = await jwt.verify(access_token, process.env.SECRET_ACCESS_KEY);

    console.log(decoded);

    

    const dbuser = await User.findById(decoded.id)

    if(!dbuser){
        return res.status(404).jons({msg : "User is not registered, Please sign in "}); 
    }

    req.id = decoded.id ;
    next() ; 
   
  } catch (err) {
    return res.status(404).json({
      err: err.message,
    });
  }
};

module.exports = authMiddleware;
