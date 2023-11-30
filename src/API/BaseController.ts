import { BadRequestException } from "@src/other/classes";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";




async function requestValidator(request: Request,response: Response,next:NextFunction){
    const error = validationResult(request)
    if(!error.isEmpty()){
    return response.send({
        status: false,
        message: error.array({onlyFirstError:true})
        })
    }  
    next()
}


export {
    requestValidator
}
// @param request

