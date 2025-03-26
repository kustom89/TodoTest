import mongoose, { Schema } from "mongoose";

const todoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
  },
  descripcion: {
    type: String
  },
  estado: {
    type: Boolean,
    default: false
  },
  isDeleted: { // Nueva propiedad para marcar como eliminado
    type: Boolean,
    default: false // Por defecto, no está eliminado
  }
});

todoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id; // Eliminar _id al devolver el objeto en JSON
  }
});

export const TodoModel = mongoose.model('Todo', todoSchema);
