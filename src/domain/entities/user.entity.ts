import { CustomError } from "../error/custom-error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, _id, name, email, emailValidated, password, role, img } = object;
    
    const entityId = id || _id;
    if (!entityId) {
      throw CustomError.badRequest("missing id");
    }

    if (!name) throw CustomError.badRequest("missing name");
    if (!email) throw CustomError.badRequest("missing email");
    if (emailValidated === undefined)
      throw CustomError.badRequest("missing email validation");
    if (!password) throw CustomError.badRequest("missing password");
    if (!role) throw CustomError.badRequest("missing role");

    return new UserEntity(
      entityId,
      name,
      email,
      emailValidated,
      password,
      role,
      img
    );
  }
}
