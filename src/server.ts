import 'dotenv/config'
import App from "./app";
// import {mongoose,} from 'mongoose'
import PostsController from "./posts/posts.controller";
import * as dotenv from 'dotenv'
import validateEnv from './utils/validateEnv'
import AuthenticationController from './authentication/authentication.controller';





validateEnv()
const app = new App(
    [
        new PostsController(),
        new AuthenticationController()
    ],
    
)

app.listen()