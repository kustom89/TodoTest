import { ProductModel } from "../../data";
import {
    CreateProductDto,
  CustomError,
  PaginationDto,
} from "../../domain";

export class ProductService {
  constructor() {}

  async createProduct(createProductDto: CreateProductDto) {
    const existProduct = await ProductModel.findOne({
      name: createProductDto.name
    });
    if (existProduct) throw CustomError.badRequest("Category aleready exist");

    try {
      const product = new ProductModel({
        ...createProductDto,
      });

      // encrypt

      //   user.password = bcryptAdapter.hash(registerUserDto.password);
      await product.save();
      // jwt

      // emaiil confirmacion

      return product
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit).populate('user').populate('category')
      ]);

      return {
        page,
        limit,
        total,
        next:`/api/categories?page=${(page+1)}&limit=${limit}`,
        previus:(page-1>0)?`/api/categories?page=${(page+1)}&limit=${limit}`:null,
        products: products
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
