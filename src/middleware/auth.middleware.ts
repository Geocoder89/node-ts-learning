import {NextFunction, request, Response} from 'express'

import * as jwt from 'jsonwebtoken'
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException'

import WrongAuthenticationToken from '../exceptions/WrongAuthenticationTokenException'
import DataStoredInToken from '../interfaces/DataStoredInToken'

import RequestWithUser from '../interfaces/requestWithUser.interface'

import userModel from '../users/user.model'



async function authMiddleware(req: RequestWithUser,response: Response,next: NextFunction) {
    const cookies = req.cookies

    if(cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET


        try {
            const verificationResponse = jwt.verify(cookies.Authorization,secret) as DataStoredInToken

            const id = verificationResponse._id
            const user = await userModel.findById(id)


            if(user) {
                req.user = user;
                next()
            } else {
                next(new WrongAuthenticationToken())
            }


        } catch(error) {
                next (new WrongAuthenticationToken())
        } 
    }

    else {
        next(new AuthenticationTokenMissingException())
    }
}


export default authMiddleware



