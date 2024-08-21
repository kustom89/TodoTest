import {envs} from '../../config';
import { CategoryModel, MongoDataBase, ProductModel, UserModel } from '../mongo';
import { seedData } from './data';


(async()=>{
await MongoDataBase.connect({
    dbName:envs.MONGO_DB_NAME,
    mongoUrl:envs.MONGO_URL
})
await main()

await MongoDataBase.disconnect();
})();

const randomBetween0Andx =(x:number)=>{
    return Math.floor(Math.random() * x)
}


async function main(){
    //borrar users de la bd

    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),

    ])

    // crear users

    const users = await UserModel.insertMany(seedData.users)


    // crear categorias
    const categories = await CategoryModel.insertMany( seedData.categories.map(category=>{
        return {...category,
            user:users[0]._id
        }
    }))
    // crear Productos

    const products = await ProductModel.insertMany(
        seedData.products.map(product =>{
            return{
                ...product,
                user:users[randomBetween0Andx(seedData.users.length-1)]._id,
                category:categories[ randomBetween0Andx(seedData.categories.length-1)]._id
            }
        })
    )

    console.log('object')
}