import { CategoryModel } from "../../data";
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UpdateCategoryDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  constructor() {}

  async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
    const existCategory = await CategoryModel.findOne({
      name: createCategoryDto.name,
    });
    if (existCategory) throw CustomError.badRequest("Category aleready exist");

    try {
      const category = new CategoryModel({
        ...createCategoryDto,
        user: user.id,
      });

      // encrypt

      //   user.password = bcryptAdapter.hash(registerUserDto.password);
      await category.save();
      // jwt

      // emaiil confirmacion

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page,
        limit,
        total,
        next:`/api/categories?page=${(page+1)}&limit=${limit}`,
        previus:(page-1>0)?`/api/categories?page=${(page+1)}&limit=${limit}`:null,
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
          // user:category.user
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getCategoryByName(id:string){



    console.log('sss',id)

    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find({name:id})

      ]);

      return {

        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
          // user:category.user
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

    


  }
}
