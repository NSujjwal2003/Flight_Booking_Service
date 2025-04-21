const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");



function validateCreateRequest(req, res, next){
    console.log("hitting middlewares")
    if(!req.body.name){
        ErrorResponse.message = "something went wrong while creating city";
        ErrorResponse.error = new AppError([ "City name not found in the incoming request in the correct form"], StatusCodes.BAD_REQUEST);
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse);
    }
    next();
}

module.exports = {
    validateCreateRequest
};