import HttpException from "./HttpException";



class WrongCredentialsException extends HttpException {
    constructor() {
        super(401,'Wrong Credentials Provided.')
    }

    
}

export default WrongCredentialsException