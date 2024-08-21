import { Router } from 'express';
import {  ProductController } from './controller';
import { ProductService } from '../services/product.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';




export class ProductRoutes {


  static get routes(): Router {

    const router = Router();

    const productService=new  ProductService();
    const controller = new ProductController(productService)

    // Definir las rutas
    router.get('/', controller.getProducts/*TodoRoutes.routes */ );
     router.post('/',[AuthMiddleware.validateJWT], controller.createproducts /*TodoRoutes.routes */ );



    return router;
  }


}

