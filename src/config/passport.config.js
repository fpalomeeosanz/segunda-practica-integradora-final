import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/userModel.js";
import cartModel from "../dao/models/cartModel.js"
import { createHash, validatePassword } from "../utils.js";


const LocalStrategy = local.Strategy;

const inicializePassport = () => {

    //PASSPORT LOCAL
    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"},
        async ( req, username, password, done ) => {
        const { first_name, last_name, email, age } = req.body;
        try {
             
      //CREA CARRITO
      const cart = await cartModel.create({}); 
      console.log(cart);
      const { first_name, last_name, email, age, password } = req.body;
      
      //ASIGNA ID
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        cart: cart._id,
        password: createHash(password)
        };
        
      //GUARDA USER
      const result = await userModel.create(newUser);

        } catch (error) {
            return done(error)
        }    

    }));

    passport.use("login", new LocalStrategy(
    {usernameField:"email"},
    async (username, password, done)=>{
        try {
            const user = await userModel.findOne({email:username})
            if(!user){
                return done(null, false);
            }
            if(!validatePassword(password, user)){
                return done(null, false);
            } 
            return done(null,user)
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });

    passport.deserializeUser(async (id,done)=>{
        let user = await userModel.findById(id);
        done(null, user);
    });

    //PASSPORT GITHUB
    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.514facd7ce886c08",
        clientSecret:"56881637e9a2a221631a807f39594c71724c73af",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async(accesToken, refreshToken,profile, done)=>{
        try {
            console.log(profile._json.name);
            const first_name = profile._json.name
            let email;
            if(!profile._json.email){
                email = profile.username;
            }

            let user = await userModel.findOne({email:profile._json.email});
            if(user){
                console.log('Usuario ya registrado');
                return done(null,false)
            }

            const newUser = {
                first_name,
                last_name: "",
                email,
                age: 18,
                password: ""
            }
            const result = await userModel.create(newUser);
            return done (null, result);

        } catch (error) {
            return done(error)
        }

    }));  
}

export default inicializePassport;