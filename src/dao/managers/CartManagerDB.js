import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

class CartManagerDB {
    constructor(){
        console.log('Funciona el CartManagerDB');
    }
    getCarts = async () => {
        const carts = await cartModel.find();
        return carts;
    }

    getCartById = async (cid) => {
        const cart = await cartModel.find({_id:cid})
        return cart;
    }

    createCart= async () => {
        const cart = await cartModel.create();
        return cart;
    }

    addProductToCart= async (cid, pid, quantity = 1) => {
        const cart = await cartModel.findOne({_id:cid});
        if (!cart){
            return{
                status: "error",
                msg: `El carrito ${cid} no existe`
            }
        };

        const product = await productModel.findOne({_id:pid});
        if (!product){
            return{
                status: "error",
                msg: `El producto ${pid} no existe`
            }
        };

        let productToCart = cart.product;

        const indexProduct = productToCart.findIndex((product) => product.product == pid);

        if(indexProduct == -1){
            const newProduct = {
                product: pid,
                quantity: quantity
            }
            cart.product.push(newProduct);
        } else {
            cart.product[indexProduct].quantity += quantity;
        }
        await cart.save();
        
        return cart;
    }
}

export { CartManagerDB }