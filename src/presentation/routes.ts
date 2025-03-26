import { Router } from 'express';
import { ImagesRoutes } from './images/routes';
import { TodoRoutes } from './todo/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/todo', TodoRoutes.routes );
    router.use('/api/images', ImagesRoutes.routes );



    return router;
  }


}

