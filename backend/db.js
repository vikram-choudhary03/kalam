const mongoose = require('mongoose'); 
require('dotenv').config(); 

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.hjzcu.mongodb.net/kalam`); 




let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];


const userSchema = new mongoose.Schema({
    fullname :{
        type : String, 
        required : true , 

    },
    email :{
        type : String, 
        required : true, 
        unique : true  
    },
    password : {
        type : String , 
        // required : true 
    },
    username :{
        type : String, 
    }, 
    

    bio :{
        type :String, 
        maxlength : [200, 'Bio shoudl be more than 200']
    },

    profile_img: {
        type: String,
        default: () => {
            return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
        } 
    },

    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },

    account_info:{
        total_posts: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
    },
    google_auth: {
        type: Boolean,
        default: false
    },
    blogs: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Blog',
        default: [],
    }
    
},
{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

});


const blogSchema = new mongoose.Schema({

    blog_id :{
        type : String, 
        required : true , 
        unique : true 
    }, 
    title :{
        type : String, 
        required : true
    }, 
    banner :{
        type : String, 
        // required : true 
    }, 
    des :{
        type : String, 
        maxlength : 200 
    }, 
    content :{
        type :[] , 
        // required : true
    }, 
    tags :{
        type : [String], 
        //required : true 
    }, 
    activity :{
        total_likes :{
            type : Number, 
            default : 0 
        }, 
        total_comments :{
            type : Number, 
            default : 0
        }, 
        total_reads :{
            type : Number, 
            default : 0
        }, 
        total_parent_comments:{
            type : Number, 
            default : 0 
        }, 
    }, 
    draft :{
        type : Boolean, 
        default : true
    }, 
}, 
{
   timestamps :{
    createdAt :'publishedAt'
   } 
})


const User = mongoose.model("User", userSchema); 

const Blog = mongoose.model("Blog", blogSchema) ; 
module.exports = {User, Blog} ; 