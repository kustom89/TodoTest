import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, LoginUserDto } from "../../domain";
import { UserEntity } from "../../domain/entities/user.entity";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email aleready exist");

    try {
      const user = new UserModel(registerUserDto);

      // encrypt

      user.password = bcryptAdapter.hash(registerUserDto.password);
      await user.save();
      // jwt
      await this.sendEmailValidationLink(user.email)

      // emaiil confirmacion

      const { password, ...userEntity } = UserEntity.fromObject(user);
      const token = await JwtAdapter.generateToken({id:user.id})
      if(!token) throw CustomError.internalServer("Error while creating jwt");

      return { user: userEntity,  token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    //findone

    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest("Email or password not exist");
    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching)
      throw CustomError.badRequest("Email or password not exist");


    const { password, ...userEntity } = UserEntity.fromObject(user);
    const token = await JwtAdapter.generateToken({id:user.id})
    if(!token) throw CustomError.internalServer("Error while creating jwt");
 

    return {
      user: { ...userEntity },
      token: token,
    };

  }

  private sendEmailValidationLink = async(email:string)=>{

    const token = await JwtAdapter.generateToken({email})
    if(!token)
      throw CustomError.internalServer("Error getting token");

    const link =`${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const html =`
    <h1>Validate you email</h1>
    <p>click to the following link to validate your email</p>
    <a href="${link}">vlidate you email ${email}</a>
    `;

    const options ={
      to:email,
      subject:'Validate your email',
      htmlBody:html
    }

    const isSet = await this.emailService.sendEmail(options);
    if(!isSet) throw CustomError.internalServer("Errorsending email");

    return true

  }

  public validateEmail = async (token:string)=>{

    const payload = await JwtAdapter.validateToken(token)
    if (!payload) throw CustomError.unauthorize('Invalid token');

    const {email}=payload as {email:string};

    if(!email) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({email})
    if(!user)  throw CustomError.internalServer('Email not exist');

    user.emailValidated=true

    await user.save()

    return true;

  }
}
