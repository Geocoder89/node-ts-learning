import 'colorts/lib/string'
import * as express from 'express';
import errorMiddleware from '../src/middleware/error.middleware';

import * as mongoose from 'mongoose'
import Controller from './interfaces/controller.interface'
import * as cookieParser from 'cookie-parser';

class App {
    public app: express.Application;


    constructor(controllers: Controller[]) {
        this.app = express()
        this.connectToTheDatabase()
        this.initializeMiddlewares()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()

    }
   

    private initializeMiddlewares() {
        this.app.use(express.json())
        this.app.use(cookieParser())
    }



   
    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller)=>{
            this.app.use('/',controller.router)
        })
    }

    public listen() {
        this.app.listen(process.env.PORT,()=>{
            console.log(`App is listening on ${process.env.PORT}`.blue.italic)
        })
    }

    private async connectToTheDatabase() {
        const {
            MONGODB_USER,
            MONGODB_PASSWORD,
            MONGODB_PATH
        } = process.env

       const connection =  await mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}${MONGODB_PATH}`)

       console.log(`MongoDB connected on ${connection.connection.host}`.yellow.underline)
    }



    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }



}


export default App