import { Router } from "express";
import  userModel  from "../dao/models/userModel.js";

const router = Router();

const publicAccess = (req,res,next) =>{
    if(req.session.user){
        return res.redirect('/');
    }
    next();
}

const privateAccess = (req,res,next) =>{
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}

router.get('/register', publicAccess, (req,res)=>{
    res.render('register')
});

router.get('/login', publicAccess, (req,res)=>{
    res.render('login')
});

router.get('/',privateAccess, (req,res)=>{
    res.render('profile', {user:req.session.user})
});

router.get('/users', async (req,res) => {
    
    const users = await userModel.find().lean();
    
    res.render("users", {users, isAdmin: true})
});

router.get("/resetPassword", publicAccess, (req,res)=>{
    res.render("resetPassword");
});

export { router as viewsRouter } ;