import HttpException from "./HttpException";


class WrongAuthenticationToken extends HttpException{
    constructor() {
        super(401,'Wrong Authentication Token')
    }
}


export default WrongAuthenticationToken