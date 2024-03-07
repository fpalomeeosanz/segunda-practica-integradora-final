import { Router } from "express";
import userModel from "../dao/models/userModel.js";


const router = Router();

//get general
router.get("/", async (req,res) =>{
    
    const users = await userModel.find();

    res.send({
        status: "succes",
        message: users
    })
})
//get individual
router.get("/:uid", async (req,res) =>{

    const id = req.params.uid;
    const user = await userModel.find({_id:id});

    res.send({
        status: "succes",
        message: users
    })
})
//creacion 

//actualizacion por cambiar...
router.put("/:uid", async (req,res) =>{
    
    const id = req.params.uid;

    const {firts_name, last_name, email, thumbnail} = req.body;
    //validar con BD
    const updateUser = {
        firts_name,
        last_name,
        email,
        thumbnail
    }

    const result = await userModel.updateOne({_id:id},{$set:updateUser});

    res.send({
        status: "succes",
        message: result
    })
})
//eliminacion
router.delete("/:uid", async (req,res) =>{
    
    const id = req.params.uid;
    const result = await userModel.deleteOne({_id:id})

    res.send({
        status: "succes",
        message: result
    })
})

export { router as userRouter } ;