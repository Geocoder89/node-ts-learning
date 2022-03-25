import {cleanEnv,port,str} from 'envalid'

require('dotenv').config({
    path: 'config/config.env'
})

function validateEnv() {


    cleanEnv(process.env,{
        JWT_SECRET: str(),
        MONGODB_PASSWORD: str(),
        MONGODB_PATH: str(),
        MONGODB_USER: str(),
        PORT: port()

    })
}


export default validateEnv
