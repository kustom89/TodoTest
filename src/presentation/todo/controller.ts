import { CreateTodoDto, CustomError, PaginationDto } from "../../domain/";
import { TodoService } from "../services/todo.service"
import { Request, request, Response } from "express";
import { TodoModel } from '../../data/mongo/models/todo.model';

export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  };

  createTodos = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create({ ...req.body });
    if (error) return res.status(400).json({ error });
  
    try {
      if (createTodoDto?._id) {  // Verifica si el ID ya existe en MongoDB
        const existingTodo = await TodoModel.findById(createTodoDto._id);
        if (existingTodo) {
          return res.status(409).json({ message: "Ya existe una tarea con este ID" });
        }
      }
  
      const newTodo = await TodoModel.create(createTodoDto);
      res.status(201).json(newTodo);
    } catch (error) {
      this.handleError(error, res);
    }
  };
  
  

  getTodos = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.todoService
      .getTodos(paginationDto!)
      .then((todos) => res.status(201).json(todos))
      .catch((error) => this.handleError(error, res));
  };

  getTodoByTitle = async (req: Request, res: Response) => {
    const titulo = req.params.id; // Se obtiene el título desde los parámetros de la URL
    if (!titulo) {
      return res.status(400).json({ error: "Título es requerido" });
    }
  
    try {
      const todos = await this.todoService.getTodoByTitle(titulo);
  
      if (!todos ) {
        return res.status(404).json({ error: "No se encontraron todos con ese título" });
      }
  
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  };


  putTodoById = async (req: Request, res: Response) => {
    const { id } = req.params; // Obtener el ID desde la URL
    const updateData = req.body; // Datos a actualizar
  
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }
  
    try {
      // Buscar y actualizar la tarea por ID
      const updatedTodo = await TodoModel.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedTodo) {
        return res.status(404).json({ error: 'No se encontró la tarea' });
      }
  
      res.json({ message: 'Tarea actualizada con éxito', updatedTodo });
    } catch (error:any) {
      res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
  };
  

  deleteTodoByTitle = async (req: Request, res: Response) => {
    const id = req.params.id; // Obtener el título de los parámetros de la URL

    // Validación para asegurar que el título está presente
    if (!id) {
      return res.status(400).json({ error: "Título es requerido" });
    }

    try {
      // Intentar eliminar el "todo" con el título proporcionado
      const deletedTodo = await this.todoService.deleteTodoById(id);

      // Si no se encontró ningún "todo" con ese título
      if (!deletedTodo) {
        return res.status(404).json({ error: "No se encontró un todo con ese título" });
      }

      // Responder con éxito
      res.json({ message: "Todo eliminado con éxito", deletedTodo });
    } catch (error) {
      // Manejo de errores del servidor
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
};

}
