const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require("dotenv").config();
const { User, Blog } = require("./db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccountKey = require("./kalam-543f8-firebase-adminsdk-fbsvc-948ae4f630.json");
const { nanoid } = require("nanoid");
const { getAuth } = require("firebase-admin/auth");

const aws = require("aws-sdk");
const verifyAuth = require("./authMiddleware");
const authMiddleware = require("./authMiddleware");
app.use(cors());
app.use(express.json()); //it parse the JSON data in request body, and make acessible to server routes handlers through req.body


const PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const s3 = new aws.S3({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "kalambucket",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.profile_img,
    username: user.username,
    fullname: user.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await User.exists({ username }); // user.exists returns _id  else null

  isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";

  return username;
};

app.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then((url) => {
      res.status(200).json({ uploadURL: url });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    });
});

app.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  //validate data from frontend

  if (fullname.length < 3) {
    return res.status(400).json({
      error: "Full name must be atleast 3 letters long",
    });
  }
  //spaces are truthy in JavaScript
  if (!email) {
    return res.status(400).json({
      error: "Email can't be empty",
    });
  }

  if (!emailRegex.test(email)) {
    k;
    return res.status(400).json({
      error: "Email is Invalid",
    });
  }
  if (!password || !passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should  be 6 to 20 long with a numeric, 1 uppercase and 1 lowercase letters",
    });
  }

  const username = await generateUsername(email) ; 
  bcrypt.hash(password, 10, async (error, hashpassword) => {
    const user = await new User({ fullname, email, password: hashpassword , username});

     user
      .save()
      .then((user) => {
        return res.status(200).json(formatDatatoSend(user));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(500).json({ error: "Email already exist" });
        }

        return res.status(500).json({ error: err.message });
      });
  });
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Email Not found " });
    }

    if (user.google_auth) {
      return res.status(403).json({
        error: "Account was created using google. Try logging with google",
      });
    }
    let isValidpassword;

    try {
      isValidpassword = await bcrypt.compare(password, user.password);
    } catch (err) {
      return res
        .status(500)
        .json({ err: "Error occured while login, please try again" });
    }

    if (!isValidpassword) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    res.status(200).json(formatDatatoSend(user));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      console.log(decodedUser);
      let { email, name, picture } = decodedUser;

      //foudn from the stackoveflow, do more research onthis
      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ email: email })
        .select("fullname username profile_img google_auth")
        .then((u) => {
          return u || null;
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });

      if (user) {
        //login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up  without google. Please login with password to access account",
          });
        }
      } else {
        //sign up

        let username = await generateUsername(email);

        user = new User({
          fullname: name,
          profile_img: picture,
          email,
          username: username,
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((error) => {
            return res.status(500).json({ error: error.message });
          });

        //user.save returns the user doc it saved in db
      }

      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});



app.post("/create-blog", verifyAuth, async (req, res) => {
  try {
    

    const { title, banner, content, des, tags } = req.body;
    

    if(!title.length){
      return res.status(403).json({err : "Must provide the title"})
    }

    if(!des.length  ){
      return res.status(403).json({err : " des.length is greater than 200"})
    }

    if(!banner.length){
      return res.status(403).json({err : "banner should not be empty"})
    }
    try {
      const numstring  = '0123456789' ; 
      const blog_id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + nanoid() ; 
      console.log(blog_id); 
      const dbblog = await Blog.create( {
        blog_id, 
        author : req.id, 
        ...req.body
      });
      
      
      const userdoc = await User.findByIdAndUpdate(req.id, {
        $push: {
          blogs: dbblog._id,
        },
      });
  
    }catch(err){
      return res.status(422).json({
        "err" : err.message
      })
    }
    
   
    return res.status(200).json({
      msg: "blog submitted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
});


app.get("/get-blogs" , authMiddleware,   async (req, res) =>{

  try {


    const blogs = await Blog.find({}).populate({path : 'author' , select:'fullname username profile_img'});

    
    
    console.log(blogs) ; 
    
    return res.status(200).json({
       blogs
    })
  }catch(err){
    return res.status(503).json({
      "err" : err.message
    })
}
})


app.get("/blog/:blogId" ,authMiddleware,  async (req, res) =>{
 
  try {

    const blogId =  req.params.blogId ; 
    const blog = await Blog.findOne({blog_id : blogId}).populate({path : 'author' , select : 'fullname profile_img username'})
    
    
    console.log(blog) ; 
    
    return res.status(200).json({
       blog
    })
  }catch(err){
    return res.status(503).json({
      "err" : err.message
    })
}
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
