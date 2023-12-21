import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";


type HashFunction = (password: string) => string
type compareFunction = (password: string, hashed: string) => boolean

export class AuthDatasourceImpl implements AuthDatasource {

    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: compareFunction = BcryptAdapter.compare,
    ) {}

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
       
        const { name, email, password } = registerUserDto;

        try {

            // 1. verify if the email exist
            const exists =  await UserModel.findOne({ email });
            if ( exists ) throw CustomError.badRequest('User already exists');

            // 2. Password hash
            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword( password ),
            });

            console.log(this.hashPassword)

            await user.save();

            // 3. Map the response to our entity
            // todo: a mapper is missing
            return UserMapper.UserEntityFromObject(user);
            
        } catch (error) {
            
            if ( error instanceof CustomError ){
                throw error;
            }
            throw CustomError.internalServer();

        }

    }


}