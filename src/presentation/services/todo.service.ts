import mongoose from "mongoose"; // Importa mongoose para validar ObjectId
import { TodoModel } from "../../data/mongo/models/todo.model";
import {
  CreateTodoDto,
  CustomError,
  PaginationDto,
} from "../../domain";

export class TodoService {
  constructor() {}

  async createTodo(createTodoDto: CreateTodoDto) {
    const existTodo = await TodoModel.findOne({
      name: createTodoDto.titulo
    });
    if (existTodo) throw CustomError.badRequest("todo aleready exist");

    try {
      const todo = new TodoModel({
        ...createTodoDto,
      });

      // encrypt

      //   user.password = bcryptAdapter.hash(registerUserDto.password);
      await todo.save();
      // jwt

      // emaiil confirmacion

      return todo
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getTodos(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, todos] = await Promise.all([
        
        TodoModel.countDocuments({ isDeleted: false }),
        TodoModel.find({ isDeleted: false })
        .skip((page - 1) * limit)
          .limit(limit)
      ]);

      return {
        page,
        limit,
        total,
        next:`/api/categories?page=${(page+1)}&limit=${limit}`,
        previus:(page-1>0)?`/api/categories?page=${(page+1)}&limit=${limit}`:null,
        todos: todos
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  async getTodoByTitle(query: string) {
    try {
        let todo;

        // Verificar si el query es un ObjectId válido
        if (mongoose.Types.ObjectId.isValid(query)) {
            todo = await TodoModel.findById(query);
            return todo ? [todo] : []; // Retornar un array con el elemento o vacío si no existe
        } 
        
        // Búsqueda por título sin distinguir mayúsculas/minúsculas y eliminando espacios extra
        todo = await TodoModel.find({ titulo: { $regex: `^${query.trim()}$`, $options: "i" }, isDeleted: false });

        return todo; // Retorna directamente el array
    } catch (error) {
        throw CustomError.internalServer(`Error: ${error}`);
    }
}


async deleteTodoById(id: string) {
  try {
      // Buscar el todo por ID
      const todo = await TodoModel.findById(id);

      if (!todo) {
          return { message: "No se encontró un todo con ese ID" };
      }

      // Marcar como eliminado
      todo.isDeleted = true;

      // Guardar los cambios
      await todo.save();

      return { message: "Todo eliminado correctamente", id: todo.id };
  } catch (error) {
      throw new Error(`Error: ${error}`);
  }
}


  putTodoByTitle = async (titulo: string, updateData: any) => {
    try {
      // Si el título está incluido en los datos de actualización, actualízalo
      if (updateData.titulo) {
        const updatedTodo = await TodoModel.findOneAndUpdate(
          { titulo }, // Buscar el todo por el título original
          { $set: updateData }, // Actualizar con los nuevos datos
          { new: true } // Devuelve el todo actualizado
        );
        return updatedTodo;
      }
  
      // Si no se incluye el título en la actualización, solo actualizar otros campos
      const updatedTodo = await TodoModel.findOneAndUpdate(
        { titulo },
        { $set: updateData },
        { new: true }
      );
      return updatedTodo;
    } catch (error) {
      throw new Error(`Error al actualizar el todo: ${error}`);
    }
  };
  
  
  
}
