import { Router } from "express";
import { ProductManagerDB } from "../dao/dbManagers/productManagerDB.js";

const router = Router();
const productManagerDB = new ProductManagerDB();

//GET listo
router.get(`/`, async (req,res) =>{
 try{ 
    const {limit, page, sort, query, price, } = req.query;
    
    const options = {
     limit: limit || 10,
     page: page || 1,
     sort: { price: sort === "asc" ? 1 : -1 },
     query: buildQuery(query),
     lean: TransformStreamDefaultController,
    };

    const products = await productManagerDB.getProductsPaginated(options);

    const totalPages = await products.totalPages;

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
   
    const response = {
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage !== null ? `/?page=${prevPage}` : null,
      nextLink: nextPage !== null ? `/?page=${nextPage}` : null,
    };

    res.send(response);

  } catch (error) {
    console.log(error);

    res.status(500).json({
    status: "error", 
    msg: "Error al obtener productos"}
  ); 
 }
 //funcion para buscar por filtros con operdador "$ne" para comparar el valor del parámetro query con un valor no especificado.
 function buildQuery(query) {

 const filter = {};

 if (query) {
  if (query === "category") {
    filter.category = { $ne: null };
  } else if (query === "availability") {
    filter.stock = { $ne: 0 }; 
  } else {
    filter[query] = { $ne: null };
  }
 }

 return filter; 
     
}
});

router.get(`/:pid`, async (req,res) =>{

    const pid = req.params.pid;
    const product = await productManagerDB.getProductById(pid);

    if (!product) {
        res.status(404).json({
          status: "error",
          msg: `Ruta PRODUCTO: NOT FOUND`
        });
        return;
    }
    res.send({
        status: "success",
        msg: `Ruta GET PRODUCT ID: ${pid}`,
        producto: product
    })
});

//POST pendiente
router.post(`/`, async (req,res) =>{

    const product = req.body; 
    product.id = id;
    product.status = true;
    product.title = req.body.title;
    product.description = req.body.description;
    product.code = req.body.code;
    product.price = req.body.price;
    product.stock = req.body.stock;
    product.category = req.body.category;

    const createdProduct = await productManagerFile.createProduct(product);

    res.send({
        status: "success",
        msg: `Ruta PRODUCTO: ${pid} CREADO`,
        producto: createdProduct,
    })
});

//PUT listo
router.put(`/:pid`, async (req,res) =>{

    const pid = req.params.pid;
    const updatedProduct = req.body;

    if (!updatedProduct || !updatedProduct.title || !updatedProduct.price) {
        res.status(400).send({
          status: "error",
          msg: "COMPLETA LOS CAMPOS: title, price"
        });
      return;
    }

    updatedProduct.id = pid;
      
    const updatedProductResponse = await productManagerDB.updateProduct(pid, updatedProduct);
    
    if (!updatedProductResponse) {
        res.status(404).send({
          status: "error",
          msg: `Ruta PRODUCTO: NOT FOUND`
        });
    }

    res.send({
        status: "success",
        msg: `Ruta PUT de PRODUCTS con ID: ${pid}`,
        producto: updatedProductResponse
    })
});

//DELETE
router.delete(`/:pid`, async (req,res) =>{

    const pid = req.params.pid;
    const deletedProductResponse = await productManagerDB.deleteProduct(pid);

    if (!deletedProductResponse) {
      res.status(404).send({
        status: "error",
        msg: `Ruta PRODUCTO: NOT FOUND`
      })
    }

    res.send({
        status: "success",
        msg: `Ruta DELETE de PRODUCTS con ID: ${pid}`,
        producto: deletedProductResponse
    })
});


export { router as productRouter }