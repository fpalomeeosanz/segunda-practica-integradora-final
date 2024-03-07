import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import passport from "passport";

import __dirname from "./utils.js";
import { viewsRouter }  from "./routes/views.routes.js";
import  { sessionRouter }  from "./routes/sessions.routes.js";
import { userRouter } from "./routes/users.routes.js";
import inicializePassport from "./config/passport.config.js";

const MONGO = "mongodb+srv://fpalomerosanz:fpalomerosanz@cluster0.xx4eski.mongodb.net/e-commerce"

const app = express();

const connection = mongoose.connect(MONGO).then(() => {
    console.log('Conectadisimos a MongoDB ;)');
}).catch(err => console.error('Error al conectar a MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));


app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        //ttl:3600
    }),
    secret:"CoderSecret",
    resave:false,
    saveUninitialized:false
}))

inicializePassport()
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter);

const server = app.listen(8080, ()=>{
    console.log('Servidor todavia funcionando en el puerto 8080');
})