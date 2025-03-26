import { Validators } from "../../../config";
export class CreateTodoDto {
  private constructor(
    public readonly _id: string | undefined, // Agregamos _id opcional
    public readonly titulo: string,
    public readonly descripcion: string,
    public readonly estado: boolean
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {
    const { _id, titulo, descripcion, estado } = props;
    let estadoBoolean = estado;

    if (!titulo) return ["Missing titulo"];

    if (typeof estado !== "boolean") {
      estadoBoolean = estado === "true";
    }

    return [
      undefined,
      new CreateTodoDto(_id, titulo, descripcion, estadoBoolean),
    ];
  }
}
