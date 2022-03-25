import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import userModel from "../users/user.model";
import EmailAlreadyExistsException from "../exceptions/emailAlreadyExists.exception";

import DataStoredInToken from "../interfaces/DataStoredInToken";

import TokenData from "../interfaces/tokenData.interface";

import CreateUserDto from '../users/user.dto';
import User from '../users/user.interface';


class AuthenticationService {
    public user = userModel



    public async register(userData: CreateUserDto) {
        if (await this.user.findOne({email: userData.email})
        ) 

        {
            throw new EmailAlreadyExistsException(userData.email)
        }

        const hashedPassword = await bcrypt.hash(userData.password,10)

        const user = await this.user.create({
            ...userData,
            password: hashedPassword
        })

        const tokenData = this.createToken(user)

        const cookie = this.createCookie(tokenData)

        return {
            cookie,
            user
        }
    }

    public createCookie (tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly;Max-Age=${tokenData.expiresIn}`
    }

    public createToken(user: User):TokenData {
        const expiresIn = 60 *60 //an hour in milliseconds
        const secret = process.env.JWT_SECRET;

        const dataStoredInToken: DataStoredInToken = {
            _id: user._id
        }

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken,secret,{expiresIn})
        }
    }
}

export default AuthenticationService