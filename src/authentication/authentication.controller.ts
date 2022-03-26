import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import WrongCredentialsException from '../exceptions/WrongCredentialsException'
import * as express from 'express'
import User from 'users/user.interface'

import Controller from '../interfaces/controller.interface'
import AuthenticationService from './authentication.service'
import validationMiddleware from '../middleware/validation.middleware'

import CreateUserDto from '../users/user.dto'
import userModel from '../users/user.model'
import LoginDto from './login.dto'
import TokenData from '../interfaces/tokenData.interface'
import DataStoredInToken from '../interfaces/DataStoredInToken'



class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router()
    private user = userModel;
    private authenticationService = new AuthenticationService()


    constructor(){
        this.initializeRoutes()
    }


    private initializeRoutes () {
        this.router.post(`${this.path}/register`,validationMiddleware(CreateUserDto),this.registration)

        this.router.post(`${this.path}/login`,validationMiddleware(LoginDto),this.loggingIn)
        this.router.post(`${this.path}/logout`,this.loggingOut)
    }

    private registration = async(req: express.Request,res: express.Response,next: express.NextFunction)=> {
        // validate that the body coming in is of the dto standard

        const userData: CreateUserDto = req.body;

        try {
           const {cookie,user} = await this.authenticationService.register(userData)

           res.setHeader('Set-Cookie',[cookie])
           res.status(201).json({
               success: true,
               message: "Registration Successful",
               data: user
           })
        } catch (error) {
            next(error)
        }
        
       
    }


    private loggingIn = async(req: express.Request,res: express.Response,next: express.NextFunction)=> {
       const loginData: LoginDto = req.body

       const user = await this.user.findOne({
           email: loginData.email
       })

       if(user) {
           const isPasswordMatch = await bcrypt.compare(loginData.password,user.password)

           if(isPasswordMatch) {
               user.password = undefined;
               // we then create a token for the user and attach cookies for each request made by the authorized user.

            const tokenData = this.createToken(user)
            res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
               res.status(200).json({
                    success: true,
                    message: 'successfully logged in',
                    data: user
               })
           } else {
               next (new WrongCredentialsException())
           }
       } else {
           next(new WrongCredentialsException())
       }
    }

    private loggingOut = (req: express.Request,res: express.Response,next: express.NextFunction)=> {
        res.setHeader('Set-Cookie',['Authorization=;Max-age=0'])

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
            data: {}
        })
    }

    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
      }


    private createToken(user: User) {
        const expiresIn = 60 * 60 * 1000 // an hour in milliseconds

        const secret = process.env.JWT_SECRET
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id
        }
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken,secret,{expiresIn})
        }
    }

}


export default AuthenticationController



