import productModel from "../models/productModel.js";

//falta completar metdods

class ProductManagerDB {
    constructor(){
        console.log('Funciona el ProductManagerDB');
    }
    getProducts = async (options) => {
        
        const products = await productModel.paginate(
            {},

            //falta hacer el filter aun
            {
                options
            }
        );
        return products
    }

    getProductById = async (pid) => {
        
        const products = await productModel.findOne({_id:id});
        return {
            status: "success",
            msg: products
        }
    }
}

export { ProductManagerDB };