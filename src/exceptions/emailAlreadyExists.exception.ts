import HttpException from "./HttpException";

class EmailAlreadyExistsException extends HttpException {
    constructor(email) {
        super(400,`User with email ${email} already exists`)
    }
}

export default EmailAlreadyExistsException