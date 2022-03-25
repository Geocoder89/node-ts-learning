import ErrorResponse from "utils/errorResponse";
import * as express from 'express'

const errorHandler =(err,req: express.Request, res: express.Response)=> {
   

    let error = {...err}

    error.message = err.message

    // log to console for dev

    console.log(err)



  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    let messages = {};

      Object.keys(err.errors).forEach((key) => {
        messages[key] = err.errors[key].message;
      });
    error = new ErrorResponse(messages, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
}

export default errorHandler