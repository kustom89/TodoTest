import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = props;
    let availableBoolean = available;

    if (!name) return ["Missing name"];

    if (!user) return ["Missing user"];

    if (!Validators.isMongoID(user)) return ["Invalid User ID"];

    if (!category) return ["Missing category"];
    if (!Validators.isMongoID(category)) return ["Missing category"];

    // if(!available) return['Missing available'];
    // if(!price) return['Missing price'];
    // if(!description) return['Missing description'];
    if (typeof available !== "boolean") {
      availableBoolean = available === "true";
    }

    return [
      undefined,
      new CreateProductDto(
        name,
        availableBoolean,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
