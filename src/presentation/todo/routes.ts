import { Router } from 'express';
import {  TodoController } from './controller';
import { TodoService } from '../services/todo.service';




export class TodoRoutes {


  static get routes(): Router {

    const router = Router();

    const todoService=new  TodoService();
    const controller = new TodoController(todoService)

    // Definir las rutas
    router.get('/', controller.getTodos/*TodoRoutes.routes */ );
    router.get('/:id', controller.getTodoByTitle/*TodoRoutes.routes */ );
    router.put('/:id', controller.putTodoById/*TodoRoutes.routes */ );
    router.delete('/:id', controller.deleteTodoByTitle/*TodoRoutes.routes */ );
    router.post('/', controller.createTodos /*TodoRoutes.routes */ );



    return router;
  }


}

